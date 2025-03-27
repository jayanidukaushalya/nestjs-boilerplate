import { IsString, MaxLength } from 'class-validator';

export class CreateUomRequestDto {
  @IsString()
  @MaxLength(60)
  name: string;
}
