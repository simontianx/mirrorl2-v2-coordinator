import { Request, Response } from 'express';
import * as nodeService from '../services/node';
import { sendError, sendResult } from './helper';

export const nodeInWhitelist = async (req: Request, res: Response) => {
  const ret = nodeService.nodeInWhitelist(req.params.id);
  sendResult(res, { ret });
};

export const whitelistNum = async (req: Request, res: Response) => {
  const ret = nodeService.whitelistNum();
  sendResult(res, { ret });
};

export const findNodes = async (req: Request, res: Response) => {
  const nodes = await nodeService.findNodes({
    limit: req.query.limit ? Number(req.query.limit) : undefined,
    skip: req.query.skip ? Number(req.query.skip) : undefined,
  });
  sendResult(res, { nodes });
};

export const getNodeInfo = async (req: Request, res: Response) => {
  try {
    const info = await nodeService.getNodeInfo(req.params.id);
    sendResult(res, { info });
  } catch (err) {
    sendError(res, err);
  }
};

export const findNodeByPubKey = async (req: Request, res: Response) => {
  try {
    const id = await nodeService.findNodeByPubKey(req.params.pubkey);
    sendResult(res, { id });
  } catch (err) {
    sendError(res, err);
  }
};

export const findOnlineProof = async (req: Request, res: Response) => {
  try {
    const proof = await nodeService.findOnlineProof(
      req.body.id,
      req.body.endTime,
      req.body.interval
    );
    sendResult(res, { proof });
  } catch (err) {
    sendError(res, err);
  }
};
