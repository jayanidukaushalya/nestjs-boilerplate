import { IsNotEmpty } from 'class-validator';

export class LoginRequestBodyDto {
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  password: string;
}
