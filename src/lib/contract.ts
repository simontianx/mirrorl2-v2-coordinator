import { ethers } from 'ethers';
import * as memoizee from 'memoizee';
import { cfg } from '../config';
import DepositSignature from '../entities/deposit_signature';
import { MirrorSystem } from './abi/MirrorSystem';
import { MirrorController } from './abi/MirrorController';
import { NodeRegistry } from './abi/NodeRegistry';
import { NodeReward } from './abi/NodeReward';
import { TypedEvent, TypedEventFilter } from './abi/commons';
import { MirrorSystem__factory } from './abi/factories/MirrorSystem__factory';
import { MirrorController__factory } from './abi/factories/MirrorController__factory';
import { NodeRegistry__factory } from './abi/factories/NodeRegistry__factory';
import { NodeReward__factory } from './abi/factories/NodeReward__factory';

export let signer: ethers.Wallet;

export let signer_arb: ethers.Wallet;

export let mirrorSystem: MirrorSystem;

export let mirrorController: MirrorController;

export let nodeRegistry: NodeRegistry;

export let nodeReward: NodeReward;

export let userAddress: string;

export let chainId: number;

export type AnyEventType = TypedEvent<any[]>;

type Filters = MirrorSystem['filters'];
export type AllEvents = keyof Filters;

export type EventType<T extends AllEvents> = ReturnType<
  Filters[T]
> extends TypedEventFilter<infer ArgsArray, infer ArgsObject>
  ? ArgsArray extends any[]
  ? TypedEvent<ArgsArray & ArgsObject>
  : never
  : never;

export enum ReceiptStatus {
  Available,
  DepositRequested,
  DepositReceived,
  WithdrawRequested,
}

export const init = async () => {
  const provider = new ethers.providers.JsonRpcProvider(cfg.eth.provider);
  const provider_arb = new ethers.providers.JsonRpcProvider(cfg.arb.provider);
  signer = new ethers.Wallet(cfg.eth.privateKey, provider);
  signer_arb = new ethers.Wallet(cfg.eth.privateKey, provider_arb);
  userAddress = await signer.getAddress();
  chainId = await signer_arb.getChainId();

  mirrorController = MirrorController__factory.connect(
    cfg.eth.mirrorController,
    signer
  );

  mirrorSystem = MirrorSystem__factory.connect(cfg.arb.mirrorSystem, signer_arb);
  nodeRegistry = NodeRegistry__factory.connect(
    await mirrorSystem.nodeRegistry(),
    provider_arb
  );
  nodeReward = NodeReward__factory.connect(cfg.arb.nodeReward, provider_arb);
};

export const getGroupId = memoizee(
  async (receiptId: string): Promise<string> => {
    const groupId = (await mirrorSystem.getReceipt(receiptId)).groupBtcAddress;
    if (!groupId) {
      // the receipt may have been erased
      const sig = await DepositSignature.findOne({ where: { receiptId } });
      if (sig) {
        return sig.groupId;
      }

      throw new Error(`invalid receiptId: ${receiptId}`);
    }
    return groupId;
  },
  { promise: true }
);
