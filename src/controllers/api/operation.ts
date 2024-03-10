import { ethers } from 'ethers';
import { Request, Response } from 'express';
import { sendError } from '../helper';

import * as proto from '../../proto/message';
import * as depositService from '../../services/deposit';
import * as nodeService from '../../services/node';
import * as refundService from '../../services/refund';
import * as withdrawService from '../../services/withdraw';

const handleHeartbeat = async (
  nodeId: string,
  op: proto.Heartbeat
): Promise<Uint8Array | null> => {
  const proof = await nodeService.processHeartbeat(
    op.clientInfo,
    nodeId,
    Buffer.from(op.btcPubKey).toString('hex'),
    op.email,
    op.groupNum,
    op.syncMinutes
  );
  return proto.OnlineProof.encode(proof).finish();
};

const handleDepositSignature = async (
  nodeId: string,
  op: proto.DepositSignature
): Promise<Uint8Array | null> => {
  await depositService.processSignature(
    op.receiptId,
    nodeId,
    op.txId,
    op.blockHeight,
    Buffer.from(op.signature)
  );

  return null;
};

const handleWithdrawRequest = async (
  nodeId: string,
  op: proto.WithdrawRequest
): Promise<Uint8Array | null> => {
  const withdraw = await withdrawService.getOrCreateWithdraw(op.receiptId);
  return proto.Withdraw.encode(withdraw).finish();
};

const handleWithdrawSignature = async (
  nodeId: string,
  op: proto.WithdrawSignature
): Promise<Uint8Array | null> => {
  await withdrawService.processSignature(op.receiptId, nodeId, op.psbt);
  return null;
};

const handleRefundRequest = async (
  nodeId: string,
  op: proto.RefundRequest
): Promise<Uint8Array | null> => {
  const refund = await refundService.getOrCreateRefund(op.txId);
  return proto.Refund.encode(refund).finish();
};

const handleRefundSignature = async (
  nodeId: string,
  op: proto.RefundSignature
): Promise<Uint8Array | null> => {
  await refundService.processSignature(op.txId, nodeId, op.psbt);
  return null;
};

const decodeMessage = (body: any): proto.Operation => {
  const req = proto.Request.decode(body);
  const addr = ethers.utils.recoverAddress(
    ethers.utils.keccak256(req.data),
    req.signature
  );

  const msg = proto.Operation.decode(req.data);
  if (addr !== msg.nodeId) {
    throw new Error(`verify signature failed: ${addr} ${msg.nodeId}`);
  }

  return msg;
};

export const operation = async (req: Request, res: Response) => {
  try {
    const msg = decodeMessage(req.body);
    const nodeId = msg.nodeId;
    let data: Uint8Array | null;

    if (msg.heartbeat) {
      data = await handleHeartbeat(nodeId, msg.heartbeat);
    } else if (msg.depositSignature) {
      data = await handleDepositSignature(nodeId, msg.depositSignature);
    } else if (msg.withdrawRequest) {
      data = await handleWithdrawRequest(nodeId, msg.withdrawRequest);
    } else if (msg.withdrawSignature) {
      data = await handleWithdrawSignature(nodeId, msg.withdrawSignature);
    } else if (msg.refundRequest) {
      data = await handleRefundRequest(nodeId, msg.refundRequest);
    } else if (msg.refundSignature) {
      data = await handleRefundSignature(nodeId, msg.refundSignature);
    } else {
      throw new Error('unknown operation');
    }

    res
      .status(200)
      .send({ success: true, message: 'ok', data: Array.from(data || []) });
  } catch (err) {
    sendError(res, err);
    return;
  }

  res.end();
};
