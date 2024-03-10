import { ethers, BigNumber } from 'ethers';
import { cfg } from '../config';
import DepositSignature from '../entities/deposit_signature';
import * as alarm from '../lib/alarm';
import * as btclib from '../lib/btclib';
import * as contract from '../lib/contract';
import * as time from '../lib/time';
import { DepositStatus } from '../models/deposit';
import * as groupService from './group';

/* tslint:disable:max-classes-per-file */

class NodeCooldown extends Error {
  constructor(message: string) {
    super(message);
  }
}

class DepositTask {
  retry = 0;
  lastTryTime = 0;
}

let NODE_COOLDOWN = 0;

const depositTasks = new Map<string, DepositTask>();
const localNodeCooldown = new Map<string, number>();

export const init = async () => {
  NODE_COOLDOWN = await contract.mirrorSystem.NODE_COOLDOWN();
  await checkBalance();
  run();
};

const run = async () => {
  for (; ;) {
    try {
      await checkDepositTasks();
    } catch (err) {
      console.error(err);
    }

    await time.sleep(10);
  }
};

const checkDepositTasks = async () => {
  const maxRetryTimes = 5;
  const now = time.now();

  for (const [receiptId, task] of depositTasks) {
    if (task.retry < maxRetryTimes && task.lastTryTime + 5 * 60 < now) {
      task.lastTryTime = now;
      try {
        await sendSignature(receiptId);
        depositTasks.delete(receiptId);
      } catch (err) {
        if (err instanceof NodeCooldown) {
          console.log(err.message);
        } else {
          task.retry += 1;
          console.error(err);

          if (task.retry === maxRetryTimes) {
            alarm.send(`[fatal] deposit failed: ${receiptId}`);
          }
        }
      } finally {
        await checkBalance();
      }
    }
  }
};

const checkBalance = async () => {
  const balance = await contract.signer.getBalance();
  const minBalane = ethers.utils.parseEther(cfg.alarm.minEthBalance.toString());
  if (balance.lt(minBalane)) {
    alarm.send(`[warn] low balance: ${ethers.utils.formatEther(balance)}`);
  }
};

export const processSignature = async (
  receiptId: string,
  nodeId: string,
  txId: string,
  blockHeight: number,
  signature: Buffer
) => {
  let entity = await DepositSignature.findOne({
    receiptId,
    nodeId,
  });

  if (!entity) {
    const receipt = await contract.mirrorSystem.getReceipt(receiptId);
    if (receipt.status === contract.ReceiptStatus.Available) {
      throw new Error(`receipt not found: ${receiptId}`);
    }

    const groupId = receipt.groupBtcAddress;
    const group = await groupService.getGroup(groupId);
    if (!group) {
      throw new Error(`group not found: ${groupId}`);
    }

    await btclib.findAndVerifyUtxo(
      receiptId,
      groupId,
      txId,
      receipt.amountInSatoshi,
      blockHeight
    );

    entity = new DepositSignature();
    entity.receiptId = receiptId;
    entity.groupId = groupId;
    entity.nodeId = nodeId;
    entity.txId = txId;
    entity.blockHeight = blockHeight;
    entity.signature = signature.toString('hex');

    await entity.save();
    console.log(`deposit signature received: ${receiptId} ${nodeId}`);

    if ((await DepositSignature.count({ receiptId })) === group.requiredNum) {
      depositTasks.set(receiptId, new DepositTask());
    }
  }
};

const sendSignatureImpl = async (signatures: DepositSignature[]) => {
  const rList = [];
  const sList = [];
  let vShift = 0;
  let packedV = BigNumber.from(0);

  for (const signature of signatures) {
    const s = ethers.utils.splitSignature('0x' + signature.signature);
    rList.push(s.r);
    sList.push(s.s);
    packedV = packedV.or(BigNumber.from(s.v).shl(vShift));

    vShift += 8;
  }

  const sig = signatures[0];
  const nodes = signatures.map(s => s.nodeId);

  await contract.mirrorSystem.verifyMint(
    {
      receiptId: sig.receiptId,
      txId: '0x' + sig.txId,
      height: sig.blockHeight,
    },
    nodes,
    rList,
    sList,
    packedV
  );

  const receipt = await contract.mirrorSystem.getReceipt(sig.receiptId);
  await contract.mirrorController.mintMBTC(receipt.recipient, receipt.amountInSatoshi);
};

export const sendSignature = async (receiptId: string) => {
  let signatures = await DepositSignature.find({ receiptId });
  if (signatures.length === 0) {
    throw new Error(`no signatures found with receiptId: ${receiptId}`);
  }

  const group = await groupService.getGroup(signatures[0].groupId);
  if (!group) {
    throw new Error('group not ready');
  }

  if (signatures.length < group.requiredNum) {
    throw new Error(
      `not enough signature num: ${signatures.entries}/${group.requiredNum}`
    );
  }

  signatures = signatures.filter(
    s => (localNodeCooldown.get(s.nodeId) || 0) < time.now()
  );

  const cooldown = await Promise.all(
    signatures.map(s => contract.mirrorSystem.cooldownUntil(s.nodeId))
  );
  const block = await contract.mirrorSystem.provider.getBlock('latest');
  signatures = signatures.filter((s, i) => cooldown[i] < block.timestamp);
  if (signatures.length < group.requiredNum) {
    throw new NodeCooldown(`node cooldown: ${group.id}`);
  }

  signatures.sort((a, b) => a.nodeId.localeCompare(b.nodeId));
  signatures = signatures.slice(0, group.requiredNum);

  await sendSignatureImpl(signatures);
  console.log(`deposit signature sent: ${receiptId}`);

  const now = time.now();
  signatures.forEach(s =>
    localNodeCooldown.set(s.nodeId, now + NODE_COOLDOWN)
  );
};

export const depositStatus = async (
  receiptId: string
): Promise<DepositStatus> => {
  const groupId = await contract.getGroupId(receiptId);
  const group = await groupService.getGroup(groupId);
  if (!group) {
    throw new Error(`group not found with receiptId: ${receiptId}`);
  }

  const status = new DepositStatus();
  status.requiredNum = group.requiredNum;
  status.currentNum = await DepositSignature.count({ receiptId });
  return status;
};
