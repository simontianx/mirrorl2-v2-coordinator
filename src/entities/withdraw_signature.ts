import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({
  name: 'withdraw_signatures',
})
export default class WithdrawSignature extends BaseEntity {
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

  @Column('text')
  psbt!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
