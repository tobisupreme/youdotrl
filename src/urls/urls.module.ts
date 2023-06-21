import { Module } from '@nestjs/common';
import { UrlService } from './urls.service';
import { UrlController } from './urls.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [UrlController],
  providers: [PrismaService, UrlService],
})
export class UrlModule {}
