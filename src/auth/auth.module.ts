import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';

@Module({
  providers: [AuthService, PrismaService, UsersService],
  controllers: [AuthController],
})
export class AuthModule {}
