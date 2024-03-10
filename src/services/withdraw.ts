import WithdrawEntity from '../entities/withdraw';
import WithdrawSignature from '../entities/withdraw_signature';
import * as alarm from '../lib/alarm';
import * as btclib from '../lib/btclib';
import * as contract from '../lib/contract';
import * as psbtlib from '../lib/psbtlib';
import { WithdrawStatus } from '../models/withdraw';
import * as groupService from './group';

export const getOrCreateWithdraw = async (
  receiptId: string
): Promise<WithdrawEntity> => {
  let withdraw = await WithdrawEntity.findOne(receiptId);
  if (withdraw) {
    return withdraw;
  }

  const receipt = await contract.mirrorSystem.getReceipt(receiptId);
  if (receipt.status !== contract.ReceiptStatus.WithdrawRequested) {
    throw new Error(`receipt not in status WithdrawRequested: ${receiptId}`);
  }

  const groupId = receipt.groupBtcAddress;
  const group = await groupService.getGroup(groupId);
  if (!group) {
    throw new Error(`group not found: ${groupId}`);
  }

  const utxo = await btclib.findAndVerifyUtxo(
    receiptId,
    groupId,
    receipt.txId,
    receipt.amountInSatoshi,
    receipt.height
  );

  const psbt = await psbtlib.makePsbt(group, utxo, receipt.withdrawBtcAddress);

  withdraw = new WithdrawEntity();
  withdraw.receiptId = receiptId;
  withdraw.requiredNum = group.requiredNum;
  withdraw.psbt = psbt;
  withdraw.paymentHash = '';

  await WithdrawEntity.createQueryBuilder()
    .insert()
    .into(WithdrawEntity)
    .values(withdraw)
    .orIgnore()
    .execute();

  return await WithdrawEntity.findOneOrFail(receiptId);
};

export const processSignature = async (
  receiptId: string,
  nodeId: string,
  psbt: string
) => {
  const withdraw = await WithdrawEntity.findOne(receiptId);
  if (withdraw && withdraw.paymentHash === '') {
    let signature = await WithdrawSignature.findOne({
      receiptId,
      nodeId,
    });
    if (!signature) {
      signature = new WithdrawSignature();
      signature.receiptId = receiptId;
      signature.nodeId = nodeId;
      signature.psbt = psbt;
      await signature.save();

      console.log(`withdraw signature received: ${receiptId} ${nodeId}`);
    }

    // TODO: this function may fail, call it again later?
    // we should return ok to the node even this failed, or the node will try to sign it again
    try {
      await sendSignature(receiptId);
    } catch (err) {
      alarm.send(`[error] send btc tx failed: ${receiptId} ${err}`);
    }
  }
};

export const sendSignature = async (receiptId: string) => {
  const withdraw = await WithdrawEntity.findOne(receiptId);
  if (!withdraw) {
    throw new Error(`withdraw not found: ${receiptId}`);
  }

  const signatures = await WithdrawSignature.createQueryBuilder()
    .where({ receiptId })
    .getMany();

  await psbtlib.combineAndSendPsbt(
    withdraw.receiptId,
    withdraw,
    signatures.map(s => s.psbt)
  );
};

// export const checkWithdraws

export const withdrawStatus = async (
  receiptId: string
): Promise<WithdrawStatus> => {
  const groupId = await contract.getGroupId(receiptId);
  const group = await groupService.getGroup(groupId);
  if (!group) {
    throw new Error(`group not found with receiptId: ${receiptId}`);
  }

  const status = new WithdrawStatus();
  status.requiredNum = group.requiredNum;
  status.currentNum = await WithdrawSignature.count({ receiptId });

  const withdraw = await WithdrawEntity.findOne(receiptId);
  if (withdraw) {
    status.txid = withdraw.paymentHash;
  }

  return status;
};

export const estimateWithdrawFee = async (): Promise<number> => {
  const group = await groupService.getAnyGroup();
  if (!group) {
    return 0;
  }

  // any group and output address type
  return (await psbtlib.estimateFee(group, 'P2SH')) / 1e8;
};
