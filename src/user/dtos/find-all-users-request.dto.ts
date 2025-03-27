import { IsEnum, IsOptional } from 'class-validator';
import { FindAllRequestQueryParamsDTO } from 'src/common/dtos/find-all.dto';
import { SORT_BY_USER } from '../user.constants';

export class FindAllUsersRequestDto extends FindAllRequestQueryParamsDTO {
  @IsEnum(SORT_BY_USER)
  @IsOptional()
  sort_by: SORT_BY_USER = SORT_BY_USER.FULL_NAME;
}
