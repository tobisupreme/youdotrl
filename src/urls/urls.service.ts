import { Injectable } from '@nestjs/common';
import { CreateShortUrlDto } from './dto/create-url.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Url } from '@prisma/client';
import { AppUtilities } from '../app.utilities';
import { RequestUser } from '../common/interfaces';

@Injectable()
export class UrlService {
  constructor(private readonly prisma: PrismaService) {}

  async create(
    createUrlDto: CreateShortUrlDto,
    { headers, user }: RequestUser,
  ): Promise<Url> {
    const shortUrl = AppUtilities.generateShortCode(7);
    return await this.prisma.url.create({
      data: {
        longUrl: createUrlDto.url,
        shortUrl: `${headers.referer}${shortUrl}`,
        shortId: shortUrl,
        createdBy: user.sub,
        userId: user.sub,
      },
    });
  }

  async redirectOrThrow(shortUrl: string) {
    const url = await this.prisma.url.findFirstOrThrow({
      where: { shortUrl },
    });

    return url.longUrl;
  }

  async fetchUrls({ user }: RequestUser): Promise<Url[] | []> {
    return await this.prisma.url.findMany({
      where: { userId: user.sub, status: true },
    });
  }
}
