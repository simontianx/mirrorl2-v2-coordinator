import { Response } from 'express';

export const sendResult = (res: Response, ret: any) => {
  ret.success = true;
  res.send(ret);
};

export const sendError = (res: Response, err: Error) => {
  console.error(err.message);
  res
    .status(500)
    .send({ success: false, message: err.message || 'unknown error' });
};
