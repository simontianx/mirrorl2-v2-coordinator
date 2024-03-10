import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({
  name: 'deposit_signatures',
})
export default class DepositSignature extends BaseEntity {
  @PrimaryColumn({
    length: 100,
    type: 'varchar',
  })
  receiptId!: string;

  @PrimaryColumn({
    length: 50,
    type: 'varchar',
  })
  nodeId!: string;

  @Column({
    length: 100,
    type: 'varchar',
  })
  groupId!: string;

  @Column({
    length: 100,
    type: 'varchar',
  })
  txId!: string;

  @Column('int')
  blockHeight!: number;

  @Column({
    length: 255,
    type: 'varchar',
  })
  signature!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
