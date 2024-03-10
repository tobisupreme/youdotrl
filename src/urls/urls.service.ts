import { CrudService } from '@@/common/database/crud.service';
import { RequestUser } from '@@/common/interfaces';
import { PrismaService } from '@@/prisma/prisma.service';
import { QrcodeService } from '@@/qrcode/qrcode.service';
import { TagsService } from '@@/tags/tags.service';
import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma, Url } from '@prisma/client';
import { AppUtilities } from '../app.utilities';
import { CreateShortUrlDto } from './dto/create-url.dto';
import { UpdateUrlDto } from './dto/update-url.dto';
import { UrlMapType } from './urls.maptype';

@Injectable()
export class UrlService extends CrudService<Prisma.UrlDelegate, UrlMapType> {
  constructor(
    private readonly prisma: PrismaService,
    private qrCodeService: QrcodeService,
    private tagService: TagsService,
  ) {
    super(prisma.url);
  }

  async createLink(
    { generateQrCode, tags, ...createUrlDto }: CreateShortUrlDto,
    { headers, user }: RequestUser,
  ) {
    const shortId = AppUtilities.generateShortCode(7);
    const shortUrl = `${headers.referer}${shortId}`;
    const qrCode = generateQrCode
      ? await this.qrCodeService.generateQrCode(shortUrl)
      : undefined;
    const lTags = tags?.length
      ? tags.map((tag) => tag.toLowerCase())
      : undefined;

    const url = await this.prisma.url.create({
      data: {
        longUrl: createUrlDto.url,
        shortUrl,
        shortId,
        qrCode,
        createdBy: user.sub,
        userId: user.sub,
        ...(lTags && {
          tags: {
            connectOrCreate: lTags.map((name) => ({
              where: {
                name,
              },
              create: {
                name,
              },
            })),
          },
        }),
      },
      include: { tags: { select: { name: true } } },
    });

    return { url: { ...url, tags: url.tags.map((tag) => tag.name) } };
  }

  async redirectOrThrow(shortId: string) {
    const url = await this.prisma.url.findFirstOrThrow({
      where: { shortId },
    });

    return url.longUrl;
  }

  async fetchLinks({ user }: RequestUser): Promise<Url[] | []> {
    const args: Prisma.UrlFindManyArgs = {
      where: { userId: user.sub, status: true },
      include: {
        creator: { select: { id: true, username: true } },
        tags: { select: { name: true } },
      },
    };

    return await this.findManyPaginate(args, {}, (data) => {
      if (!data.tags.length) return data;
      return { ...data, tags: data.tags.map((tag) => tag.name) };
    });
  }

  async updateLink(
    id: string,
    { customShortId, generateQrCode, tags: tagNames }: UpdateUrlDto,
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

    const tags = await this.tagService.getTags(tagNames);
    const tagsArray = tags.map(({ id }) => ({ id }));

    return await this.prisma.url.update({
      where: { id },
      data: {
        shortId: customShortId,
        shortUrl,
        ...(qrCode && { qrCode }),
        tags: { set: tagsArray },
      },
      include: { tags: { select: { name: true } } },
    });
  }

  async shortIdExists(shortId: string) {
    return !!(await this.prisma.url.findFirst({
      where: { shortId },
    }));
  }
}
