import { Request, Response } from 'express';
import * as groupService from '../services/group';
import { sendResult } from './helper';

export const allGroups = async (req: Request, res: Response) => {
  const groups = await groupService.allGroups({
    limit: req.query.limit ? Number(req.query.limit) : 20,
    skip: req.query.skip ? Number(req.query.skip) : 0,
  });
  sendResult(res, { groups });
};

export const getGroup = async (req: Request, res: Response) => {
  const node = await groupService.getGroup(req.params.id);
  sendResult(res, { node });
};
