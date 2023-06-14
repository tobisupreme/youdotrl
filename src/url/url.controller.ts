import { Controller, Post, Body, Get, Param, Redirect } from '@nestjs/common';
import { UrlService } from './url.service';
import { CreateShortUrlDto } from './dto/create-url.dto';
import { Url } from '@prisma/client';
import { ApiTags } from '@nestjs/swagger';
import { ApiResponseMetadata } from '../common/decorators/response.decorator';

@ApiTags('URLs')
@Controller()
export class UrlController {
  constructor(private readonly urlService: UrlService) {}

  /**
   * Redirect with shortened URL
   */
  @Get('/:shortCode')
  @ApiResponseMetadata({
    statusCode: 302,
  })
  @Redirect()
  async redirect(@Param('shortCode') shortCode: string) {
    const url = await this.urlService.redirectOrThrow(shortCode);

    return { url };
  }

  /**
   * Post a URL to be shortened
   */
  @Post('shorten')
  @ApiResponseMetadata({
    statusCode: 201,
  })
  async shortenUrl(@Body() createUrlDto: CreateShortUrlDto): Promise<Url> {
    return this.urlService.create(createUrlDto);
  }
}
