import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { ENTITY_SORT_ORDER, ENTITY_STATUS } from '../constants/db.constants';

export class FindAllRequestQueryParamsDTO {
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @IsOptional()
  limit: number;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  @IsOptional()
  skip: number = 0;

  @IsEnum(ENTITY_SORT_ORDER)
  @IsOptional()
  sort_order: ENTITY_SORT_ORDER = ENTITY_SORT_ORDER.ASC;

  @IsString()
  @IsOptional()
  search: string;

  @IsEnum(ENTITY_STATUS)
  @IsOptional()
  status: ENTITY_STATUS;
}
