import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const swaggerOptions = new DocumentBuilder()
    .setTitle('youdotrl')
    .setDescription('Shorten your URLS')
    .setVersion('0.0.1')
    .build();

  const swagDocument = SwaggerModule.createDocument(app, swaggerOptions);
  SwaggerModule.setup('api', app, swagDocument);

  const configService = app.get<ConfigService>(ConfigService);
  const port = configService.get('APP_PORT');
  await app.listen(port);
}
bootstrap();
