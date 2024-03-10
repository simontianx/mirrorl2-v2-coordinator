import GroupEntity from '../entities/group';
import * as multisig from '../lib/multisig';

export class GroupModel {
  id!: string;
  requiredNum!: number;
  totalNum!: number;
  redeemScript: string | undefined;

  static fromEntity(entity: GroupEntity): GroupModel {
    const model = new GroupModel();
    model.id = entity.id;
    model.requiredNum = entity.requiredNum;
    model.totalNum = 0;

    if (entity.nodes && entity.nodes.length > 0) {
      model.totalNum = entity.nodes.length;

      const pubKeys = entity.nodes.map(node => node.pubKey);
      if (!pubKeys.includes('')) {
        const script = multisig.generateMultisig(entity.requiredNum, pubKeys);
        model.redeemScript = script.redeem;

        if (script.address !== entity.id) {
          console.error(
            `unmatched group address: ${script.address} ${entity.id}`
          );
        }
      }
    }

    return model;
  }
}
