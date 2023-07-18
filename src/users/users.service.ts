import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findOne(identity: string): Promise<User | undefined> {
    const user = await this.prisma.user.findFirst({
      where: { OR: [{ email: identity }, { username: identity }] },
    });

    if (!user) {
      throw new NotFoundException();
    }

    return user;
  }
}
