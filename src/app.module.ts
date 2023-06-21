import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UrlModule } from './urls/urls.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), UrlModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
