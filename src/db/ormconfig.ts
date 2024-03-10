import { createConnection, getConnection, getConnectionOptions } from 'typeorm';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';
import { cfg } from '../config';

// import entities
import DepositSignature from '../entities/deposit_signature';
import Group from '../entities/group';
import Node from '../entities/node';
import OnlineProof from '../entities/online_proof';
import Refund from '../entities/refund';
import RefundSignature from '../entities/refund_signature';
import Withdraw from '../entities/withdraw';
import WithdrawSignature from '../entities/withdraw_signature';

const connectOptions = (): MysqlConnectionOptions => {
  const connectionOptions = getConnectionOptions();

  return {
    ...connectionOptions,
    type: 'mysql',
    url: cfg.db.url,
    entities: [
      Node,
      OnlineProof,
      Group,
      Withdraw,
      WithdrawSignature,
      DepositSignature,
      Refund,
      RefundSignature,
    ],
    migrations: [],
    maxQueryExecutionTime: 30,
    logging: cfg.db.showSql,
    synchronize: true,
  };
};

export const connect = async () => {
  try {
    await getConnection().close();
  } catch (err) {
    // do nothing
  }
  const connectionOptions = connectOptions();

  try {
    await createConnection(connectionOptions);
  } catch (err) {
    console.log(err);
  }
};

export default connect;
