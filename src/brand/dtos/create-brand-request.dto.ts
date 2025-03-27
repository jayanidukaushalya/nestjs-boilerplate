import { IsString, MaxLength } from 'class-validator';

export class CreateBrandRequestDto {
  @IsString()
  @MaxLength(60)
  name: string;
}
