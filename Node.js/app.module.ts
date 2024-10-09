import { Module } from '@nestjs/common';
import { LoggerModule, Params } from 'nestjs-pino';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TerminusModule } from '@nestjs/terminus';
import { SequelizeModuleOptions, SequelizeModule } from '@nestjs/sequelize';
import {
  apiConfig, logConfig, sequelizeConfig,
} from './config';

import JoiSchema from './config/schema/validation.schema';
import { AuthModule } from './auth/auth.module';
import { TerminusController } from './terminus/terminus.controller';
import { SimplyModule } from './simply/simply.module';

const imports = [
  TerminusModule,
  ConfigModule.forRoot({
    validationSchema: JoiSchema,
    validationOptions: {
      allowUnknown: true,
      abortEarly: false,
    },
    isGlobal: true,
    envFilePath: process.env.NODE_ENV ? `env/.env.${process.env.NODE_ENV}` : 'env/.env.local',
    load: [
      apiConfig,
      logConfig,
      sequelizeConfig,
    ],
  }),

  LoggerModule.forRootAsync({
    useFactory: async (configService: ConfigService) => configService.get<Params>('log'),
    inject: [ConfigService],
  }),
  SequelizeModule.forRootAsync({
    useFactory: async (configService: ConfigService) =>
      configService.get<SequelizeModuleOptions>('sequelize'),
    inject: [ConfigService],
  }),
  AuthModule,
  SimplyModule,
];

@Module({
  imports,
  controllers: [TerminusController],
  providers: [],
})
export class AppModule {}
