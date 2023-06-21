import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { UserSignUpDto } from './dto/sign-up.dto';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(private readonly prisma: PrismaService) {}

  async signUp({
    username,
    email,
    password,
  }: UserSignUpDto): Promise<User | void> {
    const passwordHash: string = await bcrypt.hash(password, 10);
    const newUser: User = await this.prisma.user.create({
      data: { email, username, passwordHash },
    });

    return newUser;
  }
}
