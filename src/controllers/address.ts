import { Request, Response } from 'express';
import * as multisig from '../lib/multisig';
import { sendError, sendResult } from './helper';

export const generateMultisig = async (req: Request, res: Response) => {
  try {
    const script = multisig.generateMultisig(req.body.m, req.body.pubkeys);
    sendResult(res, { address: script.address });
  } catch (err) {
    sendError(res, err);
  }
};
