import * as bitcoin from 'bitcoinjs-lib';
import { btcNetwork } from '../config';

export interface MultisigScript {
  redeem: string;
  address: string;
}

export const generateMultisig = (
  m: number,
  pubkeys: string[]
): MultisigScript => {
  if (m > pubkeys.length) {
    throw new Error('m greater than pubkeys length');
  }

  const keys = [...pubkeys].sort().map(hex => Buffer.from(hex, 'hex'));
  if (new Set(keys.map(v => v.toString('hex'))).size !== keys.length) {
    throw new Error('duplicated pubkeys');
  }

  const script = bitcoin.payments.p2wsh({
    redeem: bitcoin.payments.p2ms({
      m,
      pubkeys: keys,
      network: btcNetwork,
    }),
    network: btcNetwork,
  });

  return {
    redeem: script.redeem!.output!.toString('hex'),
    address: script.address!,
  };
};
