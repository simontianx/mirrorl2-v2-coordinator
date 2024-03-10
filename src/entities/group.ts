import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';
import Node from './node';

@Entity({
  name: 'groups',
})
export default class Group extends BaseEntity {
  @PrimaryColumn({
    length: 100,
    type: 'varchar',
  })
  id!: string;

  @Column('int')
  requiredNum!: number;

  @ManyToMany(() => Node, node => node.groups)
  @JoinTable({
    name: 'group_nodes',
    joinColumn: {
      name: 'group',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'node',
      referencedColumnName: 'id',
    },
  })
  nodes!: Node[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
