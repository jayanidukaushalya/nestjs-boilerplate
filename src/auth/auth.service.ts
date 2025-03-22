import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { AlreadyExistsError } from 'src/common/exceptions/already-exists-exception';
import { NotFoundError } from 'src/common/exceptions/not-found-exception';
import { UnauthorizedError } from 'src/common/exceptions/unauthorized-exception copy';
import { UserEntity } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { ChangePasswordRequestBodyDto } from './dtos/change-password.dto';
import { LoginRequestBodyDto } from './dtos/login.dto';
import { RegisterRequestDto } from './dtos/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    @InjectRepository(UserEntity) private readonly userRepo: Repository<UserEntity>,
  ) {}

  async login(body: LoginRequestBodyDto) {
    const user = await this.userService.findUserByUsername(body.username);

    if (!user) {
      throw new UnauthorizedError();
    }

    if (!(await this.comparePassword(body.password, user.password))) {
      throw new UnauthorizedError();
    }

    return user;
  }

  async register(body: RegisterRequestDto) {
    let user = await this.userService.findUserByUsername(body.username);

    if (user) {
      throw new AlreadyExistsError();
    }

    const hashedPassword = await this.hashPassword(body.password);
    body.password = hashedPassword;

    user = this.userRepo.create(body);
    return this.userRepo.save(user);
  }

  async changePassword(id: string, body: ChangePasswordRequestBodyDto) {
    const user = await this.userService.findById(id);

    if (!user) {
      throw new NotFoundError();
    }

    const hashedPassword = await this.hashPassword(body.password);
    user.password = hashedPassword;

    return this.userRepo.save(user);
  }

  private async hashPassword(password: string) {
    return bcrypt.hash(password, 10);
  }

  private async comparePassword(password: string, hash: string) {
    return bcrypt.compare(password, hash);
  }
}
