import { Pagination, PaginationQuery } from '../entities/common';
import GroupEntity from '../entities/group';
import NodeEntity from '../entities/node';
import * as contract from '../lib/contract';
import { GroupModel } from '../models/group';
import { NodeModel } from '../models/node';
import * as nodeService from './node';

export const allGroups = async (
  query: PaginationQuery
): Promise<Pagination<GroupModel>> => {
  const build = GroupEntity.createQueryBuilder();

  const groups = await build.limit(query.limit).skip(query.skip).getMany();
  const total = await build.getCount();

  const models = [];
  for (const entity of groups) {
    const nodes = await NodeEntity.createQueryBuilder('node')
      .innerJoin('node.groups', 'group', 'group.id = :id', {
        id: entity.id,
      })
      .getMany();

    entity.nodes = nodes;

    models.push(GroupModel.fromEntity(entity));
  }

  return {
    total,
    data: models,
  };
};

export const getGroup = async (id: string): Promise<GroupModel | null> => {
  let group = await GroupEntity.findOne(id, { relations: ['nodes'] });
  if (!group) {
    const g = await contract.mirrorSystem.getGroup(id);
    if (g.required > 0) {
      group = await addGroup(id, g.required, g.nodes);
    }
  }

  if (group) {
    return GroupModel.fromEntity(group);
  }
  return null;
};

export const getAnyGroup = async (): Promise<GroupModel | null> => {
  const group = await GroupEntity.findOne(undefined, { relations: ['nodes'] });
  if (group) {
    return GroupModel.fromEntity(group);
  }
  return null;
};

const getOrCreateNode = async (nodeId: string): Promise<NodeEntity> => {
  // TODO: use upsert for nodes

  let node = await nodeService.getNodeEntity(nodeId);
  if (!node) {
    const model = new NodeModel();
    model.id = nodeId;
    model.pubKey = '';
    model.email = '';
    node = await nodeService.createNode(model);
  }
  return node;
};

const addGroup = async (
  id: string,
  requiredNum: number,
  nodes: string[]
): Promise<GroupEntity> => {
  const group = new GroupEntity();
  group.id = id;
  group.requiredNum = requiredNum;
  group.nodes = await Promise.all(
    nodes.map((v: string) => getOrCreateNode(v))
  );

  await group.save();
  console.log(`new group: ${group.id} [${nodes}]`);

  return group;
};

export const onGroupAdded = async (event: contract.EventType<'GroupAdded'>) => {
  const args = event.args;
  if (!(await GroupEntity.findOne(args.btcAddress))) {
    await addGroup(args.btcAddress, args.required, args.nodes);
  }
};

export const onGroupDeleted = async (
  event: contract.EventType<'GroupDeleted'>
) => {
  const btcAddress = event.args.btcAddress;
  if (await GroupEntity.findOne(btcAddress)) {
    await GroupEntity.delete(btcAddress);
    console.log(`delete group ${btcAddress}`);
  }
};
