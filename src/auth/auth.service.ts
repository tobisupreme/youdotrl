import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { hash, compare } from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { UserSignUpDto } from './dto/sign-up.dto';
import { User } from '@prisma/client';
import { UsersService } from '../users/users.service';
import { UserSignInDto } from './dto/sign-in.dto';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private readonly prisma: PrismaService,
    private usersService: UsersService,
  ) {}

  async signUp({
    username,
    email,
    password,
  }: UserSignUpDto): Promise<User | void> {
    const userExists = await this.userExists({ username, email });
    if (userExists) {
      throw new ConflictException('Username or email exists!');
    }

    const passwordHash: string = await hash(password, 10);
    const newUser: User = await this.prisma.user.create({
      data: { email, username, passwordHash },
    });

    delete newUser.passwordHash;
    return newUser;
  }

  async signIn({ identity, password }: UserSignInDto): Promise<any> {
    const user = await this.usersService.findOne(identity);
    const isMatch = user ? await compare(password, user.passwordHash) : false;
    if (!isMatch) {
      throw new UnauthorizedException();
    }

    const payload = { sub: user.id, username: user.username };
    return {
      token: await this.jwtService.signAsync(payload),
    };
  }

  async userExists({ email, username }: { username: string; email: string }) {
    const user = await this.prisma.user.findFirst({
      where: { OR: [{ email }, { username }] },
    });

    return !!user;
  }
}
