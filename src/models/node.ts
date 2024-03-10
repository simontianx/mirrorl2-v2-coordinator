/* eslint-disable @typescript-eslint/ban-ts-comment */
import NodeEntity from '../entities/node';

export class NodeModel {
  id!: string;
  pubKey!: string;
  email?: string;
  online!: boolean;

  static fromEntity(entity: NodeEntity): NodeModel {
    const model: NodeModel = {
      id: entity.id,
      pubKey: entity.pubKey,
      email: entity.email,
      online: false,
    };

    return model;
  }
}

export interface NodeInfo {
  pubKey: string;
  online: boolean;
  lastHeartbeat: number;
}
