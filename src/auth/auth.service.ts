import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { AlreadyExistsError } from 'src/common/exceptions/already-exists.exception';
import { NotFoundError } from 'src/common/exceptions/not-found.exception';
import { IAppConfig } from 'src/config';
import { IAuthConfig } from 'src/config/auth.config';
import { User } from 'src/user/user.entity';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
import { ChangePasswordRequestBodyDto } from './dtos/change-password.dto';
import { LoginRequestBodyDto } from './dtos/login-request.dto';
import { RegisterRequestDto } from './dtos/register-request.dto';
import { IJwtPayload } from './types/jwt-payload.types';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService<IAppConfig>,
    private jwtService: JwtService,
    private readonly userService: UserService,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
  ) {}

  async validateUser(body: LoginRequestBodyDto): Promise<User | null> {
    const user = await this.userService.findUserByUsername(body.username);

    if (!user || !(await this.comparePassword(body.password, user.password))) return null;

    return user;
  }

  async register(body: RegisterRequestDto): Promise<User> {
    let user = await this.userService.findUserByUsername(body.username);

    if (user) throw new AlreadyExistsError();

    const hashedPassword = await this.hashPassword(body.password);
    body.password = hashedPassword;

    user = this.userRepo.create(body);
    return this.userRepo.save(user);
  }

  async changePassword(id: string, body: ChangePasswordRequestBodyDto): Promise<User> {
    const user = await this.userService.findById(id);

    if (!user) throw new NotFoundError();

    const hashedPassword = await this.hashPassword(body.password);
    user.password = hashedPassword;

    return this.userRepo.save(user);
  }

  private async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  private async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  async generateTokens(
    payload: IJwtPayload,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const [accessToken, refreshToken] = await Promise.all([
      this.generateAccessToken(payload),
      this.generateRefreshToken(payload),
    ]);

    return { accessToken, refreshToken };
  }

  async generateAccessToken(payload: IJwtPayload): Promise<string> {
    return this.jwtService.signAsync(payload, {
      secret: this.configService.get<IAuthConfig>('auth')?.accessToken.secret,
      expiresIn: this.configService.get<IAuthConfig>('auth')?.accessToken.expiresIn,
    });
  }

  async generateRefreshToken(payload: IJwtPayload): Promise<string> {
    return this.jwtService.signAsync(payload, {
      secret: this.configService.get<IAuthConfig>('auth')?.refreshToken.secret,
      expiresIn: this.configService.get<IAuthConfig>('auth')?.refreshToken.expiresIn,
    });
  }
}
