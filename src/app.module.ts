import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UrlModule } from './urls/urls.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { QrcodeModule } from './qrcode/qrcode.module';
import { TagsModule } from './tags/tags.module';
import configuration from '../config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      expandVariables: true,
    }),
    UrlModule,
    AuthModule,
    UsersModule,
    QrcodeModule,
    TagsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
