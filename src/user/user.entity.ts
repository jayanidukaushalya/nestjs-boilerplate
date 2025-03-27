import { ApiHideProperty } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';
import { ENTITY_STATUS } from 'src/common/constants/db.constants';
import {
  BeforeInsert,
  BeforeUpdate,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    length: 20,
    unique: true,
  })
  username: string;

  @Column()
  @Exclude()
  @ApiHideProperty()
  password: string;

  @Column({
    name: 'first_name',
    length: 60,
    nullable: true,
  })
  firstName: string;

  @Column({
    name: 'last_name',
    length: 60,
    nullable: true,
  })
  lastName: string;

  @Column({
    name: 'full_name',
    length: 120,
    nullable: true,
  })
  fullName: string;

  @Column({
    type: 'enum',
    enum: ENTITY_STATUS,
    default: ENTITY_STATUS.ACTIVE,
  })
  status: ENTITY_STATUS;

  @CreateDateColumn({
    name: 'created_at',
  })
  createdAt: Date;

  @UpdateDateColumn({
    name: 'updated_at',
  })
  updatedAt: Date;

  @BeforeInsert()
  @BeforeUpdate()
  updateFullName() {
    this.fullName = [this.firstName, this.lastName].filter(Boolean).join(' ');
  }
}
