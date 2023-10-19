import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Tag } from '@prisma/client';

@Injectable()
export class TagsService {
  constructor(private readonly prisma: PrismaService) {}

  async getTags(tagNames: string[]) {
    const tags: Tag[] = await Promise.all(
      tagNames.map((tag) => {
        return this.addTag(tag);
      }),
    );

    return tags;
  }

  private async findTagByName(tagName: string) {
    return await this.prisma.tag.findFirst({
      where: { name: tagName.toLowerCase() },
    });
  }

  private async addTag(tagName: string) {
    const tag = tagName.toLowerCase();
    const tagExists = await this.findTagByName(tag);
    if (tagExists) {
      return tagExists;
    }

    return await this.prisma.tag.create({ data: { name: tag } });
  }

  async getAllTags() {
    return await this.prisma.tag.findMany();
  }
}
