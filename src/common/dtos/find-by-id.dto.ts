import { IsString, IsUUID } from 'class-validator';

export class FindByIdRequestParamDto {
  @IsString()
  @IsUUID()
  id: string;
}
