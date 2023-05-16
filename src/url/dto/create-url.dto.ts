import { IsString, IsUrl } from 'class-validator';

export class CreateShortUrlDto {
  @IsUrl()
  url: string;

  @IsString()
  customDomain?: string;
}
