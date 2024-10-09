import { registerAs } from '@nestjs/config';

export interface ApiConfig {
  globalPrefix: string;
  version: string;
}

export default registerAs(
  'api',
  (): ApiConfig => ({
    globalPrefix: 'api',
    version: process.env.API_VERSION,
  }),
);
