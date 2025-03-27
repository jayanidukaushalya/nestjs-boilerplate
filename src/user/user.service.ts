import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { FindAllUsersRequestDto } from './dtos/find-all-users-request.dto';
import { User } from './user.entity';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private readonly userRepo: Repository<User>) {}

  async findAll(filters: FindAllUsersRequestDto): Promise<[User[], number]> {
    const queryBuilder: SelectQueryBuilder<User> = this.userRepo.createQueryBuilder('user');

    if (filters.status) {
      queryBuilder.andWhere('user.status = :status', { status: filters.status });
    }

    if (filters.search?.trim()) {
      queryBuilder.andWhere(
        'user.firstName LIKE :search OR user.lastName LIKE :search OR user.fullName LIKE :search OR user.username LIKE :search',
        { search: `%${filters.search}%` },
      );
    }

    queryBuilder.orderBy(`user.${filters.sort_by}`, filters.sort_order);

    queryBuilder.skip(filters.skip).take(filters.limit);

    return await queryBuilder.getManyAndCount();
  }

  async findById(id: string) {
    return this.userRepo.findOneBy({ id });
  }

  async findUserByUsername(username: string) {
    return this.userRepo.findOneBy({ username });
  }
}
