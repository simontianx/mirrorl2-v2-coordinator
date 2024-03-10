import * as redis from 'redis';
import {promisify} from 'util';

const client = redis.createClient('redis://localhost:6379');
const getAsync = promisify(client.get).bind(client);
const setAsync = promisify(client.set).bind(client);

const makeKey = (id: string, key: string) => {
  return `node:${key}:${id}`;
};

export const setNumber = async (
  id: string,
  key: string,
  num: number
): Promise<void> => {
  await setAsync(makeKey(id, key), num.toString());
};

export const getNumber = async (
  id: string,
  key: string
): Promise<number | null> => {
  const val = await getAsync(makeKey(id, key));
  return val === null ? null : parseFloat(val);
};

export const del = (id: string, key: string): void => {
  client.del(makeKey(id, key));
};
