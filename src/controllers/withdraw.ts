import { Request, Response } from 'express';
import * as withdrawService from '../services/withdraw';
import { sendError, sendResult } from './helper';

export const withdrawStatus = async (req: Request, res: Response) => {
  try {
    const status = await withdrawService.withdrawStatus(req.params.id);
    sendResult(res, { status });
  } catch (err) {
    sendError(res, err);
  }
};

export const estimateWithdrawFee = async (req: Request, res: Response) => {
  const fee = await withdrawService.estimateWithdrawFee();
  sendResult(res, { fee });
};

export const sendWithdrawSignature = async (req: Request, res: Response) => {
  try {
    await withdrawService.sendSignature(req.body.receipt);
    sendResult(res, { message: 'ok' });
  } catch (err) {
    sendError(res, err);
  }
};
