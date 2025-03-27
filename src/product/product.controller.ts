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
import { ERROR_MESSAGES } from 'src/common/constants/error-messages.constants';
import { FindByIdRequestParamDto } from 'src/common/dtos/find-by-id.dto';
import { AlreadyExistsError } from 'src/common/exceptions/already-exists.exception';
import { NotFoundError } from 'src/common/exceptions/not-found.exception';
import { IPaginatedResponseDTO } from 'src/common/types/response.types';
import { ProductService } from 'src/product/product.service';
import { CreateProductRequestDto } from './dtos/create-product-request.dto';
import { FindAllProductsRequestDto } from './dtos/find-all-products-request.dto';
import { Product } from './product.entity';

@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(
    @Query() query: FindAllProductsRequestDto,
  ): Promise<IPaginatedResponseDTO<Product>> {
    const [categories, total] = await this.productService.findAll(query);

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
  async findById(@Param() param: FindByIdRequestParamDto): Promise<Product> {
    try {
      return await this.productService.findById(param.id);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw new NotFoundException();
      }

      throw error;
    }
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() body: CreateProductRequestDto): Promise<Product> {
    try {
      return await this.productService.create(body);
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
    @Body() body: CreateProductRequestDto,
  ): Promise<Product> {
    try {
      return await this.productService.update(param.id, body);
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
      await this.productService.delete(param.id);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw new NotFoundException();
      }

      throw error;
    }
  }
}
