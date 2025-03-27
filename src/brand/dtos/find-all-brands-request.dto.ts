import { IsEnum, IsOptional } from 'class-validator';
import { FindAllRequestQueryParamsDTO } from 'src/common/dtos/find-all.dto';
import { SORT_BY_BRAND } from '../brand.constants';

export class FindAllBrandsRequestDto extends FindAllRequestQueryParamsDTO {
  @IsEnum(SORT_BY_BRAND)
  @IsOptional()
  sort_by: SORT_BY_BRAND = SORT_BY_BRAND.NAME;
}
