import axios from 'axios';
import {cfg} from '../config';

export interface Utxo {
  txid: string;
  vout: number;
  status: {
    confirmed: boolean;
    block_height: number;
    block_hash: string;
    block_time: number;
  };
  value: number;
}

export interface Tx {
  vin: {
    prevout: {
      scriptpubkey_address: string;
    };
  }[];
}

export interface FeeEstimates {
  [index: string]: number;
}

const request = async (subUrl: string, data?: any): Promise<any> => {
  const url = `${cfg.btc.esploraUrl}${subUrl}`;
  if (data) {
    return (await axios.post(url, data)).data;
  } else {
    return (await axios.get(url)).data;
  }
};

export const findUtxo = async (
  address: string,
  txId: string
): Promise<Utxo | null> => {
  const utxoArr: Utxo[] = await request(`address/${address}/utxo`);
  for (const utxo of utxoArr) {
    if (txidEqual(utxo.txid, txId)) {
      return utxo;
    }
  }
  return null;
};

export const findAndVerifyUtxo = async (
  receiptId: string,
  address: string,
  txId: string,
  amount: number,
  blockHeight: number
): Promise<Utxo> => {
  const utxo = await findUtxo(address, txId);
  if (!utxo) {
    throw new Error(`uxto not found: ${receiptId} ${txId}`);
  }
  if (
    !utxo.status.confirmed ||
    utxo.value !== amount ||
    utxo.status.block_height !== blockHeight
  ) {
    throw new Error(`umatched utxo: ${receiptId} ${utxo}`);
  }

  return utxo;
};

export const queryTx = async (txId: string): Promise<Tx> => {
  return request(`tx/${txId}`);
};

export const feerate = async (feeEstimateInBlocks: number): Promise<number> => {
  const feeEstimates = await request('/fee-estimates');
  const ret = feeEstimates[feeEstimateInBlocks.toString()];
  if (!ret) {
    throw new Error(`feerate not found: ${feeEstimateInBlocks}`);
  }
  return ret;
};

// TODO: handle error messages
export const sendTx = async (raw: string): Promise<string> => {
  return request('tx', raw);
};

const normalizeTxid = (txid: string): string => {
  txid = txid.toLowerCase();
  if (!txid.startsWith('0x')) {
    txid = '0x' + txid;
  }
  return txid;
};

export const txidEqual = (lhs: string, rhs: string): boolean => {
  return normalizeTxid(lhs) === normalizeTxid(rhs);
};
