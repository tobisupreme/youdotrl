import { Module } from '@nestjs/common';
import { TagsService } from './tags.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  providers: [TagsService, PrismaService],
  exports: [TagsService],
})
export class TagsModule {}
