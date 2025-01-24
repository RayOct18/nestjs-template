import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerModule } from 'nestjs-pino';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { AccountsModule } from './accounts/accounts.module';
import { KyselyModule } from './kysely/kysely.module';
import * as Joi from 'joi';

const configValidationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  CSRF_SECRET: Joi.string().required(),
  THROTTLE_DEFAULT_TTL: Joi.number().default(60000),
  THROTTLE_DEFAULT_LIMIT: Joi.number().default(10),
  DB_NAME: Joi.string().required(),
  DB_HOST: Joi.string().required(),
  DB_USER: Joi.string().required(),
  DB_PORT: Joi.number().required(),
});

const createLoggerConfig = (configService: ConfigService) => {
  const isProduction = configService.get('NODE_ENV') === 'production';
  return {
    pinoHttp: {
      level: isProduction ? 'info' : 'debug',
      transport: isProduction ? undefined : { target: 'pino-pretty' },
      serializers: isProduction
        ? {
            req: (req) => ({
              id: req.id,
              method: req.method,
              url: req.url,
              query: req.query,
              params: req.params,
              body: req.body,
              remoteAddress: req.remoteAddress,
            }),
            res: (res) => ({
              statusCode: res.statusCode,
            }),
          }
        : undefined,
    },
  };
};

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: configValidationSchema,
    }),
    LoggerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: createLoggerConfig,
    }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => [
        {
          ttl: configService.get('THROTTLE_DEFAULT_TTL'),
          limit: configService.get('THROTTLE_DEFAULT_LIMIT'),
        },
      ],
    }),
    AccountsModule,
    KyselyModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
