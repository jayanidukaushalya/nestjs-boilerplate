import { Brand } from 'src/brand/brand.entity';
import { Category } from 'src/category/category.entity';
import { ENTITY_STATUS } from 'src/common/constants/db.constants';
import { Stock } from 'src/stock/stock.entity';
import { UOM } from 'src/uom/uom.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    length: 60,
  })
  name: string;

  @Column({
    length: 60,
  })
  model: string;

  @Column({ type: 'uuid', nullable: true })
  categoryId: string;

  @ManyToOne(() => Category, (category) => category.products)
  category: Category;

  @Column({ type: 'uuid', nullable: true })
  brandId: string;

  @ManyToOne(() => Brand, (brand) => brand.products)
  brand: Brand;

  @Column({ type: 'uuid', nullable: true })
  uomId: string;

  @ManyToOne(() => UOM, (uom) => uom.products)
  uom: UOM;

  @OneToMany(() => Stock, (stock) => stock.product)
  stocks: Stock[];

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
