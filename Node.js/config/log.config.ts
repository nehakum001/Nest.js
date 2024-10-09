import { registerAs } from '@nestjs/config';
import { Params } from 'nestjs-pino';

export default registerAs<Params>('log', () => ({
  pinoHttp: {
    // can be on of 'fatal', 'error', 'warn', 'info', 'debug', 'trace' or 'silent'.
    level: process.env.LOG_LEVEL ? process.env.LOG_LEVEL : 'debug',
    autoLogging: true,
    transport:
        process.env.NODE_ENV === 'local' || !process.env.NODE_ENV
          ? {
            target: 'pino-pretty',
            options: { colorize: true },
          }
          : undefined,
    serializers: {
      req: (req) => ({
        id: req.id,
        method: req.method,
        url: req.url,
      }),
      res: (res) => ({
        statusCode: res.statusCode,
      }),
    },
  },
}));
