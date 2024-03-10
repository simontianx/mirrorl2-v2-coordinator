import { getAddressInfo } from 'bitcoin-address-validation';
import * as bitcoin from 'bitcoinjs-lib';
import { BaseEntity } from 'typeorm';
import { btcNetwork, cfg } from '../config';
import { GroupModel } from '../models/group';
import * as btclib from './btclib';

interface CommonWithdrawEntity extends BaseEntity {
  requiredNum: number;
  psbt: string;
  paymentHash: string;
  save(): Promise<this>;
}

// https://gist.github.com/junderw/b43af3253ea5865ed52cb51c200ac19c
const getByteCount = (group: GroupModel, outAddrType: string): number => {
  const outputs: { [key: string]: number } = {
    P2SH: 32,
    P2PKH: 34,
    P2WPKH: 31,
    P2WSH: 43,
  };

  const outBytes = outputs[outAddrType];
  if (!outBytes) {
    throw new Error(`unknown address type: ${outAddrType}`);
  }

  return 53 + outBytes + (73 * group.requiredNum + 34 * group.totalNum) / 4;
};

export const estimateFee = async (
  group: GroupModel,
  outAddrType: string
): Promise<number> => {
  const feerate = await btclib.feerate(cfg.btc.feeEstimateInBlocks);
  return Math.ceil(getByteCount(group, outAddrType) * feerate);
};

export const makePsbt = async (
  group: GroupModel,
  utxo: btclib.Utxo,
  recipient: string
): Promise<string> => {
  if (!group.redeemScript) {
    throw new Error(`redeem script not ready: ${group.id}`);
  }

  const addrInfo = getAddressInfo(recipient);
  const fee = await estimateFee(group, addrInfo.type.toUpperCase());
  const amount = utxo.value;

  if (amount <= fee) {
    throw new Error(`fee not covered: ${amount} ${fee}`);
  }

  const psbt = new bitcoin.Psbt({ network: btcNetwork })
    .addInput({
      hash: utxo.txid,
      index: utxo.vout,
      witnessUtxo: {
        script: bitcoin.address.toOutputScript(group.id, btcNetwork),
        value: amount,
      },
      witnessScript: Buffer.from(group.redeemScript, 'hex'),
    })
    .addOutput({
      address: recipient,
      value: amount - fee,
    });

  console.log(
    `make psbt. group: ${group.id} recipient: ${recipient} fee: ${fee} sat`
  );

  return psbt.toBase64();
};

export const combineAndSendPsbt = async (
  entityId: string,
  entity: CommonWithdrawEntity,
  signatures: string[]
) => {
  if (signatures.length < entity.requiredNum) {
    return;
  }
  signatures = signatures.slice(0, entity.requiredNum);

  const psbtArr = signatures.map(s => bitcoin.Psbt.fromBase64(s));
  const psbt = bitcoin.Psbt.fromBase64(entity.psbt).combine(...psbtArr);
  if (!psbt.validateSignaturesOfAllInputs()) {
    throw new Error(`validateSignaturesOfAllInputs failed: ${entityId}`);
  }
  psbt.finalizeAllInputs();

  const txid = await btclib.sendTx(psbt.extractTransaction().toHex());
  entity.paymentHash = txid;
  await entity.save();

  console.log(`btc transaction sent: ${entityId} txid: ${txid}`);
};
