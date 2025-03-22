import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ERROR_MESSAGES } from 'src/common/constants/error-messages';
import { FindByIdRequestParamDto } from 'src/common/dtos/find-by-id.dto';
import { AlreadyExistsError } from 'src/common/exceptions/already-exists-exception';
import { NotFoundError } from 'src/common/exceptions/not-found-exception';
import { UnauthorizedError } from 'src/common/exceptions/unauthorized-exception copy';
import { AuthService } from './auth.service';
import { ChangePasswordRequestBodyDto } from './dtos/change-password.dto';
import { LoginRequestBodyDto } from './dtos/login.dto';
import { RegisterRequestDto } from './dtos/register.dto';

@Controller('auth')
@ApiTags('Authentication')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: LoginRequestBodyDto) {
    try {
      return await this.authService.login(body);
    } catch (error) {
      if (error instanceof UnauthorizedError) {
        throw new BadRequestException('Invalid Credentials');
      }

      throw error;
    }
  }

  @Post('/register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() body: RegisterRequestDto) {
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
  ) {
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
