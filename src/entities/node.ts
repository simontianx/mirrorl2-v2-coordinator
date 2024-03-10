import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import Group from './group';

@Entity({
  name: 'nodes',
})
export default class Node extends BaseEntity {
  @PrimaryColumn({
    length: 50,
    type: 'varchar',
  })
  id!: string;

  @Column({
    length: 66,
    type: 'varchar',
  })
  pubKey!: string;

  @Column({
    length: 50,
    type: 'varchar',
  })
  email!: string;

  @ManyToMany(() => Group, group => group.nodes)
  groups: Group[] | undefined;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
