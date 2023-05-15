import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UrlModule } from './url/url.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), UrlModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
