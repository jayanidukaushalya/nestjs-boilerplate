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
      secret: process.env.ACCESS_TOKEN_SECRET as string,
      expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN ?? '60m',
    },
    refreshToken: {
      secret: process.env.REFRESH_TOKEN_SECRET as string,
      expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN ?? '30d',
    },
  }),
);
