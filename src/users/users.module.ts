import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  exports: [UsersService],
  providers: [PrismaService, UsersService],
})
export class UsersModule {}
