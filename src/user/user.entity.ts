import { Exclude } from 'class-transformer';
import { BaseEntity } from 'src/common/entity/base.entity';
import { Column, Entity } from 'typeorm';

@Entity({
  name: 'user',
})
export class UserEntity extends BaseEntity {
  @Column({
    length: 20,
    unique: true,
  })
  username: string;

  @Column()
  @Exclude()
  password: string;

  @Column({
    length: 60,
    nullable: true,
  })
  firstName: string;

  @Column({
    length: 60,
    nullable: true,
  })
  lastName: string;
}
