import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { INestApplication } from '@nestjs/common';
import { SwaggerModule } from '@nestjs/swagger';
import { DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

function setupSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('NestJS Template')
    .setDescription('The NestJS Template API description')
    .setVersion('1.0.0')
    .addTag('NestJS Template')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  if (configService.get('NODE_ENV') === 'production') {
    app.use(helmet());
    app.enableCors();
  } else {
    setupSwagger(app);
  }

  await app.listen(configService.get('PORT') ?? 3000);
}
bootstrap();
