import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({
  name: 'refunds',
})
export default class Refund extends BaseEntity {
  @PrimaryColumn({
    length: 100,
    type: 'varchar',
  })
  txId!: string;

  @Column('int')
  requiredNum!: number;

  @Column('text')
  psbt!: string;

  @Column({
    length: 100,
    type: 'varchar',
  })
  paymentHash!: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
