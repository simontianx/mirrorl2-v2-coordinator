import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({
  name: 'refund_signatures',
})
export default class RefundSignature extends BaseEntity {
  @PrimaryColumn({
    length: 100,
    type: 'varchar',
  })
  txId!: string;

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
