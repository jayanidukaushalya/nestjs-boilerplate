import { registerAs } from '@nestjs/config';

export interface IDBConfig {
  host: string;
}

export const dbConfig = registerAs(
  'db',
  (): IDBConfig => ({
    host: process.env.DB_HOST as string,
  }),
);
