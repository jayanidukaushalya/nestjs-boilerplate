import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AlreadyExistsError } from 'src/common/exceptions/already-exists-exception';
import { NotFoundError } from 'src/common/exceptions/not-found-exception';
import { User } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import { LoginDto } from './dtos/login.dto';

@Injectable()
export class AuthService {
  constructor(@InjectRepository(User) private readonly userRepo: Repository<User>) {}

  async login(body: LoginDto) {
    const user = await this.findByUsername(body.username);

    if (!user) {
      throw new NotFoundError();
    }

    return user;
  }

  async register(body: LoginDto) {
    let user = await this.findByUsername(body.username);

    if (user) {
      throw new AlreadyExistsError();
    }

    user = this.userRepo.create(body);
    return this.userRepo.save(user);
  }

  private async findByUsername(username: string) {
    return await this.userRepo.findOne({
      where: {
        username,
      },
    });
  }
}
