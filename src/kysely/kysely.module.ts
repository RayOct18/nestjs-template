import { DynamicModule, Global, Module } from '@nestjs/common';
import { KyselyService } from './kysely.service';
import { ConfigService } from '@nestjs/config';

@Global()
@Module({
  providers: [KyselyService],
  exports: [KyselyService],
})
export class KyselyModule {
  static forRoot(): DynamicModule {
    return {
      module: KyselyModule,
      providers: [
        {
          provide: KyselyService,
          useFactory: async (configService: ConfigService) => {
            return new KyselyService(configService);
          },
          inject: [ConfigService],
        },
      ],
      exports: [KyselyService],
    };
  }
}
