import { Request, Response } from 'express';
import * as depositService from '../services/deposit';
import { sendError, sendResult } from './helper';

export const depositStatus = async (req: Request, res: Response) => {
  try {
    const status = await depositService.depositStatus(req.params.id);
    sendResult(res, { status });
  } catch (err) {
    sendError(res, err);
  }
};

export const sendDepositSignature = async (req: Request, res: Response) => {
  try {
    await depositService.sendSignature(req.body.receipt);
    sendResult(res, { message: 'ok' });
  } catch (err) {
    sendError(res, err);
  }
};
