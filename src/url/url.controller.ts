import { Controller, Post, Body } from '@nestjs/common';
import { UrlService } from './url.service';
import { CreateShortUrlDto } from './dto/create-url.dto';
import { Url } from '@prisma/client';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('URLs')
@Controller('url')
export class UrlController {
  constructor(private readonly urlService: UrlService) {}

  /**
   * Post a URL to be shortened
   */
  @Post()
  async create(@Body() createUrlDto: CreateShortUrlDto): Promise<Url> {
    return this.urlService.create(createUrlDto);
  }
}
