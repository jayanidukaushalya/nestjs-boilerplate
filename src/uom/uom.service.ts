import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ENTITY_STATUS } from 'src/common/constants/db.constants';
import { AlreadyExistsError } from 'src/common/exceptions/already-exists.exception';
import { NotFoundError } from 'src/common/exceptions/not-found.exception';
import { Not, Repository, SelectQueryBuilder } from 'typeorm';
import { CreateUomRequestDto } from './dtos/create-uom-request.dto';
import { FindAllUomRequestDto } from './dtos/find-all-uom-request.dto';
import { UOM } from './uom.entity';

@Injectable()
export class UomService {
  constructor(@InjectRepository(UOM) private readonly uomRepo: Repository<UOM>) {}

  async findAll(filters: FindAllUomRequestDto): Promise<[UOM[], number]> {
    const queryBuilder: SelectQueryBuilder<UOM> = this.uomRepo.createQueryBuilder('uom');
    queryBuilder.andWhere('uom.status = :status', { status: ENTITY_STATUS.ACTIVE });

    if (filters.status) {
      queryBuilder.andWhere('uom.status = :status', { status: filters.status });
    }

    if (filters.search?.trim()) {
      queryBuilder.andWhere('uom.name LIKE :search', { search: `%${filters.search}%` });
    }

    queryBuilder.orderBy(`uom.${filters.sort_by}`, filters.sort_order);

    queryBuilder.skip(filters.skip).take(filters.limit);

    return await queryBuilder.getManyAndCount();
  }

  async findById(id: string): Promise<UOM> {
    const uom = await this.uomRepo.findOneBy({ id, status: ENTITY_STATUS.ACTIVE });
    if (!uom) throw new NotFoundError();
    return uom;
  }

  async create(body: CreateUomRequestDto): Promise<UOM> {
    const checkDuplicates = await this.uomRepo.findOneBy({
      name: body.name,
    });

    if (checkDuplicates) throw new AlreadyExistsError();

    const uom = this.uomRepo.create(body);
    return this.uomRepo.save(uom);
  }

  async update(id: string, body: CreateUomRequestDto): Promise<UOM> {
    let uom = await this.findById(id);

    const checkDuplicates = await this.uomRepo.findOneBy({
      name: body.name,
      id: Not(id),
    });

    if (checkDuplicates) throw new AlreadyExistsError();

    uom.name = body.name;

    uom = this.uomRepo.create(uom);
    return this.uomRepo.save(uom);
  }

  async delete(id: string): Promise<void> {
    const uom = await this.findById(id);
    uom.status = ENTITY_STATUS.DELETED;
    await this.uomRepo.save(uom);
  }
}
