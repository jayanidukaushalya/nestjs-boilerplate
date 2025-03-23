export class LoginResponseDTO {
  constructor(partial: Partial<LoginResponseDTO>) {
    Object.assign(this, partial);
  }

  accessToken: string;
}
