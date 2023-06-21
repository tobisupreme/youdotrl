import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { UserSignUpDto } from './dto/sign-up.dto';
import { User } from '@prisma/client';
import { UsersService } from '../users/users.service';
import { UserSignInDto } from './dto/sign-in.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private usersService: UsersService,
  ) {}

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

  async signIn({ email, password }: UserSignInDto): Promise<any> {
    const user = await this.usersService.findOne(email);
    const isMatch = user
      ? await bcrypt.compare(password, user.passwordHash)
      : false;
    if (!isMatch) {
      throw new UnauthorizedException();
    }
    const { passwordHash, ...result } = user;
    return result;
  }
}
