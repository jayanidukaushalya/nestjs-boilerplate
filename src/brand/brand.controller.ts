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
import { Brand } from './brand.entity';
import { BrandService } from './brand.service';
import { CreateBrandRequestDto } from './dtos/create-brand-request.dto';
import { FindAllBrandsRequestDto } from './dtos/find-all-brands-request.dto';

@Controller('brand')
export class BrandController {
  constructor(private readonly brandService: BrandService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() query: FindAllBrandsRequestDto): Promise<IPaginatedResponseDTO<Brand>> {
    const [brands, total] = await this.brandService.findAll(query);

    return {
      results: brands,
      extras: {
        total,
        skip: query.skip,
        limit: query.limit ?? null,
      },
    };
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findById(@Param() param: FindByIdRequestParamDto): Promise<Brand> {
    try {
      return await this.brandService.findById(param.id);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw new NotFoundException();
      }

      throw error;
    }
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() body: CreateBrandRequestDto): Promise<Brand> {
    try {
      return await this.brandService.create(body);
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
    @Body() body: CreateBrandRequestDto,
  ): Promise<Brand> {
    try {
      return await this.brandService.update(param.id, body);
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
      await this.brandService.delete(param.id);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw new NotFoundException();
      }

      throw error;
    }
  }
}
