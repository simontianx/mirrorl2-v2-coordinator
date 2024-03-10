import RefundEntity from '../entities/refund';
import RefundSignature from '../entities/refund_signature';
import * as btclib from '../lib/btclib';
import * as contract from '../lib/contract';
import * as psbtlib from '../lib/psbtlib';
import * as groupService from './group';

export const getOrCreateRefund = async (
  txId: string
): Promise<RefundEntity> => {
  let refund = await RefundEntity.findOne(txId);
  if (refund) {
    return refund;
  }

  const refundData = await contract.mirrorSystem.getRefundData();
  if (!btclib.txidEqual(refundData.txId, txId)) {
    throw new Error(`umatched txid: ${txId} ${refundData.txId}`);
  }

  const utxo = await btclib.findUtxo(refundData.groupBtcAddress, txId);
  if (utxo === null) {
    throw new Error(`utxo not found: ${refundData.groupBtcAddress} ${txId}`);
  }

  const receiptId = (
    await contract.mirrorSystem.getGroup(refundData.groupBtcAddress)
  ).workingReceiptId;
  const receipt = await contract.mirrorSystem.getReceipt(receiptId);
  if (btclib.txidEqual(receipt.txId, txId)) {
    throw new Error(`utxo is used by receipt: ${receiptId} ${txId}`);
  }

  const tx = await btclib.queryTx(txId);
  if (tx.vin.length === 0) {
    throw new Error(`no inputs in tx: ${txId}`);
  }

  const group = await groupService.getGroup(refundData.groupBtcAddress);
  if (!group) {
    throw new Error(`group not found: ${refundData.groupBtcAddress}`);
  }

  const psbt = await psbtlib.makePsbt(
    group,
    utxo,
    tx.vin[0].prevout.scriptpubkey_address
  );
  refund = new RefundEntity();
  refund.txId = txId;
  refund.requiredNum = group.requiredNum;
  refund.psbt = psbt;
  refund.paymentHash = '';

  await RefundEntity.createQueryBuilder()
    .insert()
    .into(RefundEntity)
    .values(refund)
    .orIgnore()
    .execute();

  return RefundEntity.findOneOrFail(txId);
};

export const processSignature = async (
  txId: string,
  nodeId: string,
  psbt: string
) => {
  const refund = await RefundEntity.findOne(txId);
  if (refund && refund.paymentHash === '') {
    let signature = await RefundSignature.findOne({ txId, nodeId });
    if (!signature) {
      signature = new RefundSignature();
      signature.txId = txId;
      signature.nodeId = nodeId;
      signature.psbt = psbt;
      await signature.save();

      console.log(`refund signature received: ${txId} ${nodeId}`);
    }

    try {
      await sendSignature(txId);
    } catch (err) {
      console.error(err);
    }
  }
};

export const sendSignature = async (txId: string) => {
  const refund = await RefundEntity.findOne(txId);
  if (!refund) {
    return;
  }

  const signatures = await RefundSignature.createQueryBuilder()
    .where({ txId })
    .getMany();

  await psbtlib.combineAndSendPsbt(
    refund.txId,
    refund,
    signatures.map(s => s.psbt)
  );
};
