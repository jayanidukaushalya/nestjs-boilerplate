import {
  ClassSerializerInterceptor,
  Injectable,
  SerializeOptions,
  UseInterceptors,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AlreadyExistsError } from 'src/common/exceptions/already-exists-exception';
import { NotFoundError } from 'src/common/exceptions/not-found-exception';
import { UserEntity } from 'src/user/user.entity';
import { Repository } from 'typeorm';
import { ChangePasswordRequestBodyDto } from './dtos/change-password.dto';
import { LoginRequestBodyDto } from './dtos/login.dto';
import { RegisterRequestDto } from './dtos/register.dto';

@Injectable()
@UseInterceptors(ClassSerializerInterceptor)
@SerializeOptions({ strategy: 'excludeAll' })
export class AuthService {
  constructor(@InjectRepository(UserEntity) private readonly userRepo: Repository<UserEntity>) {}

  async login(body: LoginRequestBodyDto) {
    const user = await this.findUserByUsername(body.username);

    if (!user) {
      throw new NotFoundError();
    }

    return user;
  }

  async register(body: RegisterRequestDto) {
    let user = await this.findUserByUsername(body.username);

    if (user) {
      throw new AlreadyExistsError();
    }

    user = this.userRepo.create(body);
    return this.userRepo.save(user);
  }

  async changePassword(id: string, body: ChangePasswordRequestBodyDto) {
    const user = await this.findUserById(id);

    if (!user) {
      throw new NotFoundError();
    }

    user.password = body.password;
    return this.userRepo.save(user);
  }

  private async findUserByUsername(username: string) {
    return this.userRepo.findOne({
      where: {
        username,
      },
    });
  }

  private async findUserById(id: string) {
    return this.userRepo.findOneBy({ id });
  }
}
