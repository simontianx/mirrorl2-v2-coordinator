import { BaseEntity, Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ name: 'online_proof' })
export default class OnlineProof extends BaseEntity {
  @PrimaryColumn({
    length: 50,
    type: 'varchar',
  })
  nodeId!: string;

  @PrimaryColumn('int')
  timestamp!: number;

  @Column({
    length: 255,
    type: 'varchar',
  })
  signature!: string;
}
