import { LoginResponseDTO } from './login-response.dto';

export class RefreshTokenResponseDto extends LoginResponseDTO {
  constructor(partial: Partial<RefreshTokenResponseDto>) {
    super(partial);
  }
}
