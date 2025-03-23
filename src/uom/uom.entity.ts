import { ENTITY_STATUS } from 'src/common/constants/db.constants';
import { Product } from 'src/product/product.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class UOM {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    length: 20,
  })
  name: string;

  @OneToMany(() => Product, (product) => product.uomId)
  products: Product[];

  @Column({
    type: 'enum',
    enum: ENTITY_STATUS,
    default: ENTITY_STATUS.ACTIVE,
  })
  status: ENTITY_STATUS;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
