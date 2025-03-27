import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ENTITY_STATUS } from 'src/common/constants/db.constants';
import { AlreadyExistsError } from 'src/common/exceptions/already-exists.exception';
import { NotFoundError } from 'src/common/exceptions/not-found.exception';
import { Not, Repository, SelectQueryBuilder } from 'typeorm';
import { Category } from './category.entity';
import { CreateCategoryRequestDto } from './dtos/create-category-request.dto';
import { FindAllCategoriesRequestDto } from './dtos/find-all-categories-request.dto';

@Injectable()
export class CategoryService {
  constructor(@InjectRepository(Category) private readonly categoryRepo: Repository<Category>) {}

  async findAll(filters: FindAllCategoriesRequestDto): Promise<[Category[], number]> {
    const queryBuilder: SelectQueryBuilder<Category> =
      this.categoryRepo.createQueryBuilder('category');
    queryBuilder.andWhere('category.status = :status', { status: ENTITY_STATUS.ACTIVE });

    if (filters.status) {
      queryBuilder.andWhere('category.status = :status', { status: filters.status });
    }

    if (filters.search?.trim()) {
      queryBuilder.andWhere('category.name LIKE :search', { search: `%${filters.search}%` });
    }

    queryBuilder.orderBy(`category.${filters.sort_by}`, filters.sort_order);

    queryBuilder.skip(filters.skip).take(filters.limit);

    return await queryBuilder.getManyAndCount();
  }

  async findById(id: string): Promise<Category> {
    const category = await this.categoryRepo.findOneBy({ id, status: ENTITY_STATUS.ACTIVE });
    if (!category) throw new NotFoundError();
    return category;
  }

  async create(body: CreateCategoryRequestDto): Promise<Category> {
    const checkDuplicates = await this.categoryRepo.findOneBy({
      name: body.name,
    });

    if (checkDuplicates) throw new AlreadyExistsError();

    const category = this.categoryRepo.create(body);
    return this.categoryRepo.save(category);
  }

  async update(id: string, body: CreateCategoryRequestDto): Promise<Category> {
    let category = await this.findById(id);

    const checkDuplicates = await this.categoryRepo.findOneBy({
      name: body.name,
      id: Not(id),
    });

    if (checkDuplicates) throw new AlreadyExistsError();

    category.name = body.name;

    category = this.categoryRepo.create(category);
    return this.categoryRepo.save(category);
  }

  async delete(id: string): Promise<void> {
    const category = await this.findById(id);
    category.status = ENTITY_STATUS.DELETED;
    await this.categoryRepo.save(category);
  }
}
