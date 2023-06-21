import { IsOptional, IsString, IsUrl } from 'class-validator';

export class CreateShortUrlDto {
  @IsUrl({}, { message: 'Please use a valid URL' })
  url: string;

  @IsString()
  @IsOptional()
  customDomain?: string;
}