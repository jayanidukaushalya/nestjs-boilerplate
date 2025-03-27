import { Controller, Get, HttpCode, HttpStatus, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { IPaginatedResponseDTO } from 'src/common/types/response.types';
import { FindAllUsersRequestDto } from './dtos/find-all-users-request.dto';
import { User } from './user.entity';
import { UserService } from './user.service';

@Controller('user')
@ApiTags('User')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() query: FindAllUsersRequestDto): Promise<IPaginatedResponseDTO<User>> {
    const [users, total] = await this.userService.findAll(query);

    return {
      results: users,
      extras: {
        total,
        skip: query.skip,
        limit: query.limit ?? null,
      },
    };
  }
}
