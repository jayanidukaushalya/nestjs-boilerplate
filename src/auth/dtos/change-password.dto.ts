import { PickType } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';
import { RegisterRequestDto } from './register.dto';

export class ChangePasswordRequestBodyDto extends PickType(RegisterRequestDto, ['password']) {
  @IsString()
  @Length(6, 20)
  password: string;
}
