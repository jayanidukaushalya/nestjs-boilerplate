import { IsString, MaxLength } from 'class-validator';

export class CreateCategoryRequestDto {
  @IsString()
  @MaxLength(60)
  name: string;
}
