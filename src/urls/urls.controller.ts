import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Redirect,
  Req,
} from '@nestjs/common';
import { UrlService } from './urls.service';
import { CreateShortUrlDto } from './dto/create-url.dto';
import { Url } from '@prisma/client';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ApiResponseMetadata } from '../common/decorators/response.decorator';
import { Public } from '../common/decorators/auth.public.decorator';
import { RequestUser } from '../common/interfaces';

@ApiTags('URLs')
@Controller()
export class UrlController {
  constructor(private readonly urlService: UrlService) {}

  /**
   * Fetch URLs
   */
  @ApiBearerAuth()
  @Get('/urls')
  @ApiResponseMetadata({
    statusCode: 200,
  })
  async fetchUserUrls(@Req() req: RequestUser): Promise<Url[] | []> {
    return this.urlService.fetchUrls(req);
  }

  /**
   * Redirect with shortened URL
   */
  @Public()
  @ApiResponseMetadata({
    statusCode: 302,
  })
  @Get('/:shortCode')
  @Redirect()
  async redirect(@Param('shortCode') shortCode: string) {
    const url = await this.urlService.redirectOrThrow(shortCode);

    return { url };
  }

  /**
   * Post a URL to be shortened
   */
  @ApiBearerAuth()
  @Post('shorten')
  @ApiResponseMetadata({
    statusCode: 201,
  })
  async shortenUrl(
    @Body() createUrlDto: CreateShortUrlDto,
    @Req() req: RequestUser,
  ): Promise<Url> {
    return this.urlService.create(createUrlDto, req);
  }
}
