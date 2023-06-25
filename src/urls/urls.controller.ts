import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Redirect,
  Req,
  Patch,
} from '@nestjs/common';
import { UrlService } from './urls.service';
import { CreateShortUrlDto } from './dto/create-url.dto';
import { Url } from '@prisma/client';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ApiResponseMetadata } from '../common/decorators/response.decorator';
import { Public } from '../common/decorators/auth.public.decorator';
import { RequestUser } from '../common/interfaces';
import { UpdateUrlDto } from './dto/update-url.dto';

@ApiTags('URLs')
@Controller()
export class UrlController {
  constructor(private readonly urlService: UrlService) {}

  /**
   * Get shortened links
   */
  @ApiBearerAuth()
  @Get('/links')
  @ApiResponseMetadata({
    statusCode: 200,
  })
  async fetchUserlinks(@Req() req: RequestUser): Promise<Url[] | []> {
    return this.urlService.fetchLinks(req);
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
  @Post('/shorten')
  @ApiResponseMetadata({
    statusCode: 201,
  })
  async shortenUrl(
    @Body() createUrlDto: CreateShortUrlDto,
    @Req() req: RequestUser,
  ): Promise<Url> {
    return this.urlService.createLink(createUrlDto, req);
  }

  /**
   * Update shortened link
   */
  @Public()
  @Patch('links/:id')
  async updateLink(
    @Param('id') linkId: string,
    @Body() updateDto: UpdateUrlDto,
    @Req() req: RequestUser,
  ) {
    return this.urlService.updateLink(linkId, updateDto, req);
  }
}
