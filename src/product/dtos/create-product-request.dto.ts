import { IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

export class CreateProductRequestDto {
  @IsString()
  @MaxLength(60)
  name: string;

  @IsString()
  @IsUUID()
  uomId: string;

  @IsString()
  @MaxLength(60)
  @IsOptional()
  model: string;

  @IsString()
  @IsUUID()
  @IsOptional()
  categoryId: string;

  @IsString()
  @IsUUID()
  @IsOptional()
  brandId: string;
}
