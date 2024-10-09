import { NestFactory, Reflector } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AuditTrailInterceptor } from '@sanofi/shadow-wolf-api-client-nestjs-interceptor';
import { Logger, LoggerErrorInterceptor } from 'nestjs-pino';
import serverlessExpress from '@vendia/serverless-express';
import { Callback, Context, Handler } from 'aws-lambda';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import { ApiConfig } from './config/api.config';

let server: Handler;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.useLogger(app.get(Logger));
  app.useGlobalInterceptors(new LoggerErrorInterceptor());
  app.useGlobalInterceptors((new AuditTrailInterceptor('shadowwolf', app.get(Reflector)) as any));

  app.enableCors();
  app.enableShutdownHooks();

  const apiSettings = app.get(ConfigService).get<ApiConfig>('api');

  const prefix = `${apiSettings.globalPrefix}/${apiSettings.version}`;
  app.setGlobalPrefix(prefix);

  await app.init();

  const expressApp = app.getHttpAdapter().getInstance();
  return serverlessExpress({ app: expressApp });
}

export const handler: Handler = async (
  event: any,
  context: Context,
  callback: Callback,
) => {
  server = server ?? (await bootstrap());
  return server(event, context, callback);
};
