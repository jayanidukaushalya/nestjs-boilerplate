import { AMOUNT_TYPE, ENTITY_STATUS } from 'src/common/constants/db.constants';
import { Product } from 'src/product/product.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Stock {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'numeric',
    precision: 10,
    scale: 2,
  })
  sellingPrice: number;

  @Column({
    type: 'numeric',
    precision: 10,
    scale: 2,
    default: 0,
  })
  maxDiscount: number;

  @Column({
    type: 'enum',
    enum: AMOUNT_TYPE,
    default: AMOUNT_TYPE.PERCENTAGE,
  })
  maxDiscountType: AMOUNT_TYPE;

  @Column({
    type: 'int',
  })
  availableQty: number;

  @Column({
    type: 'uuid',
  })
  productId: string;

  @ManyToOne(() => Product, (product) => product.stocks)
  product: Product;

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
