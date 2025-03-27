import {
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { NotFoundError } from 'rxjs';
import { ERROR_MESSAGES } from 'src/common/constants/error-messages.constants';
import { FindByIdRequestParamDto } from 'src/common/dtos/find-by-id.dto';
import { AlreadyExistsError } from 'src/common/exceptions/already-exists.exception';
import { IPaginatedResponseDTO } from 'src/common/types/response.types';
import { Category } from './category.entity';
import { CategoryService } from './category.service';
import { CreateCategoryRequestDto } from './dtos/create-category-request.dto';
import { FindAllCategoriesRequestDto } from './dtos/find-all-categories-request.dto';

@Controller('category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Query() query: FindAllCategoriesRequestDto,
  ): Promise<IPaginatedResponseDTO<Category>> {
    const [categories, total] = await this.categoryService.findAll(query);

    return {
      results: categories,
      extras: {
        total,
        skip: query.skip,
        limit: query.limit ?? null,
      },
    };
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findById(@Param() param: FindByIdRequestParamDto): Promise<Category> {
    try {
      return await this.categoryService.findById(param.id);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw new NotFoundException();
      }

      throw error;
    }
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() body: CreateCategoryRequestDto): Promise<Category> {
    try {
      return await this.categoryService.create(body);
    } catch (error) {
      if (error instanceof AlreadyExistsError) {
        throw new ConflictException(ERROR_MESSAGES.ALREADY_EXISTS);
      }

      throw error;
    }
  }

  @Patch('id')
  @HttpCode(HttpStatus.OK)
  async update(
    @Param() param: FindByIdRequestParamDto,
    @Body() body: CreateCategoryRequestDto,
  ): Promise<Category> {
    try {
      return await this.categoryService.update(param.id, body);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw new NotFoundException();
      } else if (error instanceof AlreadyExistsError) {
        throw new ConflictException(ERROR_MESSAGES.ALREADY_EXISTS);
      }

      throw error;
    }
  }

  @Delete('id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param() param: FindByIdRequestParamDto): Promise<void> {
    try {
      await this.categoryService.delete(param.id);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw new NotFoundException();
      }

      throw error;
    }
  }
}
