import * as ethers from 'ethers';
import * as nodemailer from 'nodemailer';
import { Between, Not } from 'typeorm';
import { cfg, clientVersion } from '../config';
import { Pagination, PaginationQuery } from '../entities/common';
import NodeEntity from '../entities/node';
import OnlineProof from '../entities/online_proof';
import * as contract from '../lib/contract';
import * as nodeCache from '../lib/node_cache';
import * as stats from '../lib/stats';
import * as time from '../lib/time';
import { Whitelist } from '../lib/whitelist';
import { NodeInfo, NodeModel } from '../models/node';

const cacheKey = {
  lastHeartbeatTime: 'lastHeartbeatTime',
  lastNotifyOfflineTime: 'lastNotifyOfflineTime',
};

const whitelist = new Whitelist();

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: cfg.mail.user,
    pass: cfg.mail.pass,
  },
});

const isNodeOnline = async (id: string): Promise<boolean> => {
  const lastHeartbeatTime = await nodeCache.getNumber(
    id,
    cacheKey.lastHeartbeatTime
  );
  return (
    lastHeartbeatTime !== null && lastHeartbeatTime + 10 * 60 >= time.now()
  );
};

const toModel = async (node: NodeEntity): Promise<NodeModel> => {
  const model = NodeModel.fromEntity(node);
  model.online = await isNodeOnline(node.id);
  return model;
};

const updateOnlineStats = async () => {
  const models = (await findNodes({})).data;
  for (const model of models) {
    stats.nodeStats('online', model.id, model.online ? 1 : 0);
  }
};

const sendMail = async (
  id: string,
  email: string,
  subject: string,
  text: string
) => {
  try {
    const info = await transporter.sendMail({
      from: cfg.mail.user,
      to: email,
      subject,
      text,
    });

    console.log(`mail sent: ${id} - ${email} - ${subject}: ${info.messageId}`);
  } catch (err) {
    console.error(`send mail failed: ${id} - ${email} - ${subject}: ${err}`);
  }
};

const checkOffline = async () => {
  const nodes = await NodeEntity.find({ email: Not('') });
  let models = await Promise.all(nodes.map(v => toModel(v)));
  models = models.filter(v => !v.online);

  for (const model of models) {
    const now = time.now();
    const lastHeartbeatTime = await nodeCache.getNumber(
      model.id,
      cacheKey.lastHeartbeatTime
    );
    if (lastHeartbeatTime === null || lastHeartbeatTime + 3600 < now) {
      const lastNotifyOfflineTime = await nodeCache.getNumber(
        model.id,
        cacheKey.lastNotifyOfflineTime
      );
      if (
        lastNotifyOfflineTime === null ||
        lastNotifyOfflineTime + cfg.mail.mailInterval < now
      ) {
        await nodeCache.setNumber(
          model.id,
          cacheKey.lastNotifyOfflineTime,
          now
        );
        if (await contract.nodeRegistry.isNodeQualified(model.id)) {
          await sendMail(
            model.id,
            model.email!,
            'Mirror Node Client Offline',
            `Your node client ${model.id} is offline, please check your program.`
          );
        }
      }
    }
  }

  await updateOnlineStats();
};

export const init = async () => {
  const loop = () =>
    setInterval(() => {
      checkOffline().catch(err => {
        console.error(`checkOffline err: ${err}`);
      });
    }, 120 * 1000);

  setTimeout(loop, 1200 * 1000);
};

export const nodeInWhitelist = (id: string): boolean => {
  return whitelist.has(ethers.utils.getAddress(id));
};

export const whitelistNum = (): number => {
  return whitelist.size();
};

export const findNodes = async (
  query: PaginationQuery
): Promise<Pagination<NodeModel>> => {
  const build = NodeEntity.createQueryBuilder();

  const nodes = await build.limit(query.limit).skip(query.skip).getMany();
  const total = await build.getCount();
  const models = await Promise.all(nodes.map(v => toModel(v)));
  models.forEach(v => delete v.email);

  return {
    total,
    data: models,
  };
};

export const getNodeInfo = async (id: string): Promise<NodeInfo> => {
  // the client may send lower case address
  id = ethers.utils.getAddress(id);

  const node = await NodeEntity.findOne(id, { relations: ['groups'] });
  if (!node) {
    throw new Error(`node not found: ${id}`);
  }

  const proof = await OnlineProof.findOne({
    where: {
      nodeId: id,
    },
    order: {
      timestamp: 'DESC',
    },
  });

  return {
    pubKey: node.pubKey,
    online: await isNodeOnline(id),
    lastHeartbeat: proof ? proof.timestamp : 0,
  };
};

export const findNodeByPubKey = async (pubKey: string): Promise<string> => {
  const node = await NodeEntity.findOne({ pubKey });
  if (!node) {
    throw new Error('node not found');
  }
  return node.id;
};

export const getNodeEntity = async (
  id: string
): Promise<NodeEntity | null> => {
  return (await NodeEntity.findOne(id, { relations: ['groups'] })) || null;
};

export const findOnlineProof = async (
  id: string,
  endTime: number,
  interval: number
): Promise<OnlineProof> => {
  if (endTime === 0) {
    endTime = time.now();
  }

  const proof = await OnlineProof.findOne({
    where: {
      nodeId: id,
      timestamp: Between(endTime - interval, endTime),
    },
    order: {
      timestamp: 'DESC',
    },
  });
  if (!proof) {
    throw new Error('online proof not found');
  }

  return proof;
};

const generateOnlineProof = async (id: string): Promise<OnlineProof> => {
  const domain = {
    name: 'NodeReward',
    version: '1.0',
    chainId: contract.chainId,
    verifyingContract: cfg.arb.nodeReward,
  };
  const types = {
    OnlineProof: [
      { name: 'timestamp', type: 'uint256' },
      { name: 'node', type: 'address' },
    ],
  };
  const value = {
    node: id,
    timestamp: Math.floor(time.now()),
  };

  const proof = new OnlineProof();
  proof.nodeId = id;
  proof.timestamp = value.timestamp;
  proof.signature = await contract.signer._signTypedData(domain, types, value);

  await proof.save();

  return proof;
};

const getClientInfo = (): string => {
  return [clientVersion, contract.chainId.toString(), cfg.arb.mirrorSystem].join(
    '|'
  );
};

export const processHeartbeat = async (
  clientInfo: string,
  id: string,
  pubKey: string,
  email: string,
  groupNum?: number,
  syncMinutes?: number
): Promise<OnlineProof> => {
  if (clientInfo !== getClientInfo()) {
    throw new Error(`unmatched client info: ${clientInfo}`);
  }

  if (!whitelist.has(id)) {
    throw new Error(`not in whitelist: ${id}`);
  }

  stats.nodeStats('group_num', id, groupNum);
  stats.nodeStats('sync_min', id, syncMinutes);

  const entity = await getNodeEntity(id);
  if (entity && entity.pubKey !== '') {
    if (entity.pubKey !== pubKey) {
      throw new Error(`unmatched pubKey: ${id} ${pubKey}`);
    }

    if (entity.email !== email) {
      console.log(`update email: ${id} - ${email}`);
      entity.email = email;
      await entity.save();
    }
  } else {
    const model = new NodeModel();
    model.id = id;
    model.pubKey = pubKey;
    model.email = email;
    await createNode(model);
  }

  if (!(await isNodeOnline(id))) {
    console.log(`node connected: ${id}`);

    if (email !== '') {
      const lastNotifyOfflineTime = await nodeCache.getNumber(
        id,
        cacheKey.lastNotifyOfflineTime
      );
      if (lastNotifyOfflineTime !== null) {
        nodeCache.del(id, cacheKey.lastNotifyOfflineTime);

        await sendMail(
          id,
          email,
          'Mirror Node Client Online',
          `Your node client ${id} is back online.`
        );
      }
    }
  }

  await nodeCache.setNumber(id, cacheKey.lastHeartbeatTime, time.now());

  return await generateOnlineProof(id);
};

export const createNode = async (
  node: NodeModel
): Promise<NodeEntity> => {
  if (node.pubKey !== '') {
    const count = await NodeEntity.createQueryBuilder()
      .where({
        pubKey: node.pubKey,
      })
      .getCount();

    if (count > 0) {
      throw new Error(`pubKey already exist: ${node.pubKey}`);
    }
  }
  const entity = new NodeEntity();
  entity.id = node.id;
  entity.pubKey = node.pubKey;
  entity.email = node.email!;
  await entity.save();

  return entity;
};

export const onAccuse = async (id: string) => {
  const node = await NodeEntity.findOne(id);
  if (node === undefined) {
    throw new Error(`accused. node not found: ${id}`);
  }
  if (!node.email) {
    throw new Error(`accused. email not provided: ${id}`);
  }
  await sendMail(
    id,
    node.email,
    'Mirror Node Accused',
    `Your node ${id} is accused, please provide online certificate within 12 hours or you will be fined. `
  );
};
