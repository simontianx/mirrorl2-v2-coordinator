import axios from 'axios';
import {cfg} from '../config';

export const send = async (msg: string) => {
  console.log(`alarm: ${msg}`);
  axios.post(cfg.alarm.feishu, {
    msg_type: 'text',
    content: {
      text: msg,
    },
  });
};
