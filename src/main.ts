import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { RequestInterceptor } from './common/interceptors/request.interceptor';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { ValidationPipe } from '@nestjs/common';
import { ErrorInterceptor } from './common/interceptors/error.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalInterceptors(
    new ErrorInterceptor(),
    new RequestInterceptor(),
    new ResponseInterceptor(),
  );

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  const swaggerOptions = new DocumentBuilder()
    .setTitle('youdotrl')
    .setDescription('Shorten your URLS')
    .setVersion('0.0.1')
    .addBearerAuth()
    .build();

  const swagDocument = SwaggerModule.createDocument(app, swaggerOptions);
  SwaggerModule.setup('/', app, swagDocument);

  const configService = app.get<ConfigService>(ConfigService);
  const port = configService.get('PORT');
  await app.listen(port);
}
bootstrap();
