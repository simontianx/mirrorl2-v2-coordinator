import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({
  name: 'withdraws',
})
export default class Withdraw extends BaseEntity {
  @PrimaryColumn({
    length: 100,
    type: 'varchar',
  })
  receiptId!: string;

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
