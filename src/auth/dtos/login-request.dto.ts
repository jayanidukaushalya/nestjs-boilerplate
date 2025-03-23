import { IsNotEmpty, IsString } from 'class-validator';

export class LoginRequestBodyDto {
  @IsNotEmpty()
  @IsString()
  username: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
