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
import { CreateUomRequestDto } from './dtos/create-uom-request.dto';
import { FindAllUomRequestDto } from './dtos/find-all-uom-request.dto';
import { UOM } from './uom.entity';
import { UomService } from './uom.service';

@Controller('uom')
export class UomController {
  constructor(private readonly uomService: UomService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll(@Query() query: FindAllUomRequestDto): Promise<IPaginatedResponseDTO<UOM>> {
    const [categories, total] = await this.uomService.findAll(query);

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
  async findById(@Param() param: FindByIdRequestParamDto): Promise<UOM> {
    try {
      return await this.uomService.findById(param.id);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw new NotFoundException();
      }

      throw error;
    }
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() body: CreateUomRequestDto): Promise<UOM> {
    try {
      return await this.uomService.create(body);
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
    @Body() body: CreateUomRequestDto,
  ): Promise<UOM> {
    try {
      return await this.uomService.update(param.id, body);
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
      await this.uomService.delete(param.id);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw new NotFoundException();
      }

      throw error;
    }
  }
}
