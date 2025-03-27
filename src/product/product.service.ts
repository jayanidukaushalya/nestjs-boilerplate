import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ENTITY_STATUS } from 'src/common/constants/db.constants';
import { AlreadyExistsError } from 'src/common/exceptions/already-exists.exception';
import { NotFoundError } from 'src/common/exceptions/not-found.exception';
import { Not, Repository, SelectQueryBuilder } from 'typeorm';
import { CreateProductRequestDto } from './dtos/create-product-request.dto';
import { FindAllProductsRequestDto } from './dtos/find-all-products-request.dto';
import { Product } from './product.entity';

@Injectable()
export class ProductService {
  constructor(@InjectRepository(Product) private readonly productRepo: Repository<Product>) {}

  async findAll(filters: FindAllProductsRequestDto): Promise<[Product[], number]> {
    const queryBuilder: SelectQueryBuilder<Product> = this.productRepo
      .createQueryBuilder('product')
      .innerJoin('product.uom', 'uom')
      .leftJoin('product.category', 'category')
      .leftJoin('product.brand', 'brand');
    queryBuilder.andWhere('product.status = :status', { status: ENTITY_STATUS.ACTIVE });

    if (filters.status) {
      queryBuilder.andWhere('product.status = :status', { status: filters.status });
    }

    if (filters.search?.trim()) {
      queryBuilder.andWhere('product.name LIKE :search OR product.model LIKE :search', {
        search: `%${filters.search}%`,
      });
    }

    if (filters.category_id) {
      queryBuilder.andWhere('product.categoryId = :categoryId', {
        categoryId: filters.category_id,
      });
    }

    if (filters.brand_id) {
      queryBuilder.andWhere('product.brandId = :brandId', {
        brandId: filters.brand_id,
      });
    }

    if (filters.uom_id) {
      queryBuilder.andWhere('product.uomId = :uomId', {
        uomId: filters.uom_id,
      });
    }

    queryBuilder.orderBy(`product.${filters.sort_by}`, filters.sort_order);

    queryBuilder.skip(filters.skip).take(filters.limit);

    return await queryBuilder.getManyAndCount();
  }

  async findById(id: string): Promise<Product> {
    const product = await this.productRepo.findOneBy({ id, status: ENTITY_STATUS.ACTIVE });
    if (!product) throw new NotFoundError();
    return product;
  }

  async create(body: CreateProductRequestDto): Promise<Product> {
    const checkDuplicates = await this.productRepo.findOneBy({
      name: body.name,
      model: body.model,
    });

    if (checkDuplicates) throw new AlreadyExistsError();

    const product = this.productRepo.create(body);
    return this.productRepo.save(product);
  }

  async update(id: string, body: CreateProductRequestDto): Promise<Product> {
    let product = await this.findById(id);

    const checkDuplicates = await this.productRepo.findOneBy({
      name: body.name,
      model: body.model,
      id: Not(id),
    });

    if (checkDuplicates) throw new AlreadyExistsError();

    product.name = body.name;

    product = this.productRepo.create(product);
    return this.productRepo.save(product);
  }

  async delete(id: string): Promise<void> {
    const product = await this.findById(id);
    product.status = ENTITY_STATUS.DELETED;
    await this.productRepo.save(product);
  }
}
