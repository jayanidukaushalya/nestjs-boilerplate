import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ENTITY_STATUS } from 'src/common/constants/db.constants';
import { AlreadyExistsError } from 'src/common/exceptions/already-exists.exception';
import { NotFoundError } from 'src/common/exceptions/not-found.exception';
import { Not, Repository, SelectQueryBuilder } from 'typeorm';
import { Brand } from './brand.entity';
import { CreateBrandRequestDto } from './dtos/create-brand-request.dto';
import { FindAllBrandsRequestDto } from './dtos/find-all-brands-request.dto';

@Injectable()
export class BrandService {
  constructor(@InjectRepository(Brand) private readonly brandRepo: Repository<Brand>) {}

  async findAll(filters: FindAllBrandsRequestDto): Promise<[Brand[], number]> {
    const queryBuilder: SelectQueryBuilder<Brand> = this.brandRepo.createQueryBuilder('brand');
    queryBuilder.andWhere('brand.status = :status', { status: ENTITY_STATUS.ACTIVE });

    if (filters.status) {
      queryBuilder.andWhere('brand.status = :status', { status: filters.status });
    }

    if (filters.search?.trim()) {
      queryBuilder.andWhere('brand.name LIKE :search', { search: `%${filters.search}%` });
    }

    queryBuilder.orderBy(`brand.${filters.sort_by}`, filters.sort_order);

    queryBuilder.skip(filters.skip).take(filters.limit);

    return await queryBuilder.getManyAndCount();
  }

  async findById(id: string): Promise<Brand> {
    const brand = await this.brandRepo.findOneBy({ id, status: ENTITY_STATUS.ACTIVE });
    if (!brand) throw new NotFoundError();
    return brand;
  }

  async create(body: CreateBrandRequestDto): Promise<Brand> {
    const checkDuplicates = await this.brandRepo.findOneBy({
      name: body.name,
    });

    if (checkDuplicates) throw new AlreadyExistsError();

    const brand = this.brandRepo.create(body);
    return this.brandRepo.save(brand);
  }

  async update(id: string, body: CreateBrandRequestDto): Promise<Brand> {
    let brand = await this.findById(id);

    const checkDuplicates = await this.brandRepo.findOneBy({
      name: body.name,
      id: Not(id),
    });

    if (checkDuplicates) throw new AlreadyExistsError();

    brand.name = body.name;

    brand = this.brandRepo.create(brand);
    return this.brandRepo.save(brand);
  }

  async delete(id: string) {
    const brand = await this.findById(id);
    brand.status = ENTITY_STATUS.DELETED;
    return this.brandRepo.save(brand);
  }
}
