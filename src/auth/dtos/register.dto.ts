import { IsNotEmpty, IsString, Length, MaxLength } from 'class-validator';

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  username: string;

  @IsString()
  @Length(6, 20)
  password: string;
}
