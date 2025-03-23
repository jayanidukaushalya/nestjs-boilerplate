import {
  Body,
  ClassSerializerInterceptor,
  ConflictException,
  Controller,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
  Res,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { ERROR_MESSAGES } from 'src/common/constants/error-messages';
import { FindByIdRequestParamDto } from 'src/common/dtos/find-by-id.dto';
import { AlreadyExistsError } from 'src/common/exceptions/already-exists-exception';
import { NotFoundError } from 'src/common/exceptions/not-found-exception';
import { IAppConfig } from 'src/config/config.schema';
import { User } from 'src/user/user.entity';
import { AuthService } from './auth.service';
import { REFRESH_TOKEN_KEY } from './constants';
import { CurrentUser } from './decorators/current-user.decorator';
import { Public } from './decorators/public.decorator';
import { ChangePasswordRequestBodyDto } from './dtos/change-password.dto';
import { LoginRequestBodyDto } from './dtos/login-request.dto';
import { LoginResponseDTO } from './dtos/login-response.dto';
import { RegisterRequestDto } from './dtos/register-request.dto';
import { LocalGuard } from './guards/local.guard';

@Controller('auth')
@UseInterceptors(ClassSerializerInterceptor)
@ApiTags('Authentication')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService<IAppConfig>,
  ) {}

  @Post('/login')
  @Public()
  @UseGuards(LocalGuard)
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: LoginRequestBodyDto, @CurrentUser() user: User, @Res() res: Response) {
    const { accessToken, refreshToken } = await this.authService.generateTokens(
      user.id,
      user.username,
    );

    res.cookie(REFRESH_TOKEN_KEY, refreshToken, {
      // 30 days
      maxAge: 60 * 60 * 24 * 30,
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
    });

    res.json(new LoginResponseDTO({ accessToken }));
  }

  @Post('/register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() body: RegisterRequestDto): Promise<User> {
    try {
      return await this.authService.register(body);
    } catch (error) {
      if (error instanceof AlreadyExistsError) {
        throw new ConflictException(ERROR_MESSAGES.ALREADY_EXISTS);
      }

      throw error;
    }
  }

  @Patch('/change-password/:id')
  @HttpCode(HttpStatus.OK)
  async changePassword(
    @Param() param: FindByIdRequestParamDto,
    @Body() body: ChangePasswordRequestBodyDto,
  ): Promise<User> {
    try {
      return await this.authService.changePassword(param.id, body);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw new NotFoundException();
      }

      throw error;
    }
  }
}
