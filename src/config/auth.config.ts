import { registerAs } from '@nestjs/config';

export interface IAuthConfig {
  accessToken: {
    secret: string;
    expiresIn: string;
  };
  refreshToken: {
    secret: string;
    expiresIn: string;
  };
}

export const authConfig = registerAs(
  'auth',
  (): IAuthConfig => ({
    accessToken: {
      secret: process.env.JWT_SECRET as string,
      expiresIn: process.env.JWT_EXPIRES_IN ?? '60m',
    },
    refreshToken: {
      secret: process.env.JWT_SECRET as string,
      expiresIn: process.env.JWT_EXPIRES_IN ?? '30d',
    },
  }),
);
