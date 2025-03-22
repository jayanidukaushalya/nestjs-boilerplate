import {
  Body,
  ConflictException,
  Controller,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ERROR_MESSAGES } from 'src/common/constants/error-messages';
import { AlreadyExistsError } from 'src/common/exceptions/already-exists-exception';
import { NotFoundError } from 'src/common/exceptions/not-found-exception';
import { AuthService } from './auth.service';
import { LoginDto } from './dtos/login.dto';
import { RegisterDto } from './dtos/register.dto';

@Controller('auth')
@ApiTags('Authentication')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: LoginDto) {
    try {
      return await this.authService.login(body);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw new NotFoundException();
      }

      throw error;
    }
  }

  @Post('/register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() body: RegisterDto) {
    try {
      return await this.authService.register(body);
    } catch (error) {
      if (error instanceof AlreadyExistsError) {
        throw new ConflictException(ERROR_MESSAGES.ALREADY_EXISTS);
      }

      throw error;
    }
  }
}
