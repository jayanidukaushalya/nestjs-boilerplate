import { IsEnum, IsOptional } from 'class-validator';
import { FindAllRequestQueryParamsDTO } from 'src/common/dtos/find-all.dto';
import { SORT_BY_UOM } from '../uom.constants';

export class FindAllUomRequestDto extends FindAllRequestQueryParamsDTO {
  @IsEnum(SORT_BY_UOM)
  @IsOptional()
  sort_by: SORT_BY_UOM = SORT_BY_UOM.NAME;
}
