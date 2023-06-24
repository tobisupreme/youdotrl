import { Module } from '@nestjs/common';
import { UrlService } from './urls.service';
import { UrlController } from './urls.controller';
import { PrismaService } from '../prisma/prisma.service';
import { QrcodeService } from '../qrcode/qrcode.service';

@Module({
  controllers: [UrlController],
  providers: [PrismaService, QrcodeService, UrlService],
})
export class UrlModule {}
