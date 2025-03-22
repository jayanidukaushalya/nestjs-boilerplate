import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './user.entity';

@Injectable()
export class UserService {
  constructor(@InjectRepository(UserEntity) private readonly userRepo: Repository<UserEntity>) {}

  async findAll() {
    return this.userRepo.find();
  }

  async findById(id: string) {
    return this.userRepo.findOneBy({ id });
  }

  async findUserByUsername(username: string) {
    return this.userRepo.findOneBy({ username });
  }
}
