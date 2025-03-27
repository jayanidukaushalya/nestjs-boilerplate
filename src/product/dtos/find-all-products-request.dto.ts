import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { FindAllRequestQueryParamsDTO } from 'src/common/dtos/find-all.dto';
import { SORT_BY_PRODUCT } from '../product.constants';

export class FindAllProductsRequestDto extends FindAllRequestQueryParamsDTO {
  @IsEnum(SORT_BY_PRODUCT)
  @IsOptional()
  sort_by: SORT_BY_PRODUCT = SORT_BY_PRODUCT.NAME;

  @IsString()
  @IsUUID()
  @IsOptional()
  category_id: string;

  @IsString()
  @IsUUID()
  @IsOptional()
  brand_id: string;

  @IsString()
  @IsUUID()
  @IsOptional()
  uom_id: string;
}
