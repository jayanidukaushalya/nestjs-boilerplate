import { IsEnum, IsOptional } from 'class-validator';
import { FindAllRequestQueryParamsDTO } from 'src/common/dtos/find-all.dto';
import { SORT_BY_CATEGORY } from '../category.constants';

export class FindAllCategoriesRequestDto extends FindAllRequestQueryParamsDTO {
  @IsEnum(SORT_BY_CATEGORY)
  @IsOptional()
  sort_by: SORT_BY_CATEGORY = SORT_BY_CATEGORY.NAME;
}
