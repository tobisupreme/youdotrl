import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateShortUrlDto } from './dto/create-url.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Url } from '@prisma/client';
import { AppUtilities } from '../app.utilities';
import { RequestUser } from '../common/interfaces';
import { QrcodeService } from '../qrcode/qrcode.service';
import { UpdateUrlDto } from './dto/update-url.dto';

@Injectable()
export class UrlService {
  constructor(
    private readonly prisma: PrismaService,
    private qrCodeService: QrcodeService,
  ) {}

  async createLink(
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

  async fetchLinks({ user }: RequestUser): Promise<Url[] | []> {
    return await this.prisma.url.findMany({
      where: { userId: user.sub, status: true },
    });
  }

  async updateLink(
    id: string,
    { customShortId, generateQrCode, tags }: UpdateUrlDto,
    { headers }: RequestUser,
  ): Promise<Url> {
    const url = await this.prisma.url.findFirstOrThrow({
      where: { id },
    });

    const shortIdExists =
      customShortId && (await this.shortIdExists(customShortId));
    if (shortIdExists) throw new BadRequestException();
    const shortUrl = `${headers.referer}${customShortId}`;

    let qrCode;
    if (generateQrCode) {
      qrCode = customShortId
        ? await this.qrCodeService.generateQrCode(shortUrl)
        : await this.qrCodeService.generateQrCode(url.shortUrl);
    }

    await this.prisma.tags.deleteMany({ where: { urlId: id } });
    const createdTags = await Promise.all(
      tags.map(async (tagName) => {
        return await this.prisma.tags.create({
          data: { name: tagName, urlId: id },
        });
      }),
    );

    return await this.prisma.url.update({
      where: { id },
      data: {
        shortId: customShortId,
        shortUrl,
        ...(qrCode && { qrCode }),
        tags: { connect: createdTags.map(({ id }) => ({ id })) },
      },
      include: { tags: true },
    });
  }

  async shortIdExists(shortId: string) {
    return !!(await this.prisma.url.findFirst({
      where: { shortId },
    }));
  }
}
