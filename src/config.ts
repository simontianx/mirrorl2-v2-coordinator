import * as bitcoin from 'bitcoinjs-lib';
import * as fs from 'fs';
import * as yaml from 'yaml';

export const clientVersion: string = 'v0.0.1';

export let btcNetwork: bitcoin.Network;

interface Config {
  machine: string;

  mail: {
    user: string;
    pass: string;
    mailInterval: number;
  };

  db: {
    url: string;
    showSql: boolean;
  };

  btc: {
    network: string;
    esploraUrl: string;
    feeEstimateInBlocks: number;
  };

  eth: {
    provider: string;
    privateKey: string;
    mirrorController: string;
    mirrorControllerStartBlock: number;
  };

  arb: {
    provider: string;
    mirrorSystem: string;
    nodeReward: string;
    mirrorSystemStartBlock: number;
  }

  alarm: {
    feishu: string;
    minEthBalance: number;
  };
}

const loadConfig = (): Config => {
  const c: Config = yaml.parse(fs.readFileSync('./config.yaml', 'utf8'));
  if (c.btc.network === 'testnet') {
    btcNetwork = bitcoin.networks.testnet;
  } else if (c.btc.network === 'mainnet') {
    btcNetwork = bitcoin.networks.bitcoin;
  } else {
    throw new Error(`unknown btc network: ${c.btc.network}`);
  }

  return c;
};

export const cfg = loadConfig();
