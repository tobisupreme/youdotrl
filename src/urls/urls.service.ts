import { Injectable } from '@nestjs/common';
import { CreateShortUrlDto } from './dto/create-url.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Url } from '@prisma/client';
import { AppUtilities } from '../app.utilities';
import { RequestUser } from '../common/interfaces';
import { QrcodeService } from '../qrcode/qrcode.service';

@Injectable()
export class UrlService {
  constructor(
    private readonly prisma: PrismaService,
    private qrCodeService: QrcodeService,
  ) {}

  async create(
    { generateQrCode, ...createUrlDto }: CreateShortUrlDto,
    { headers, user }: RequestUser,
  ): Promise<Url> {
    const shortId = AppUtilities.generateShortCode(7);
    const shortUrl = `${headers.referer}${shortId}`;
    const qrCode = generateQrCode
      ? await this.qrCodeService.generateQrCode(shortUrl)
      : undefined;

    return await this.prisma.url.create({
      data: {
        longUrl: createUrlDto.url,
        shortUrl,
        shortId,
        qrCode,
        createdBy: user.sub,
        userId: user.sub,
      },
    });
  }

  async redirectOrThrow(shortId: string) {
    const url = await this.prisma.url.findFirstOrThrow({
      where: { shortId },
    });

    return url.longUrl;
  }

  async fetchUrls({ user }: RequestUser): Promise<Url[] | []> {
    return await this.prisma.url.findMany({
      where: { userId: user.sub, status: true },
    });
  }
}
