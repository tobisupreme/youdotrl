import { PickType } from '@nestjs/swagger';
import { CreateShortUrlDto } from './create-url.dto';
import { IsOptional, IsString } from 'class-validator';

export class UpdateUrlDto extends PickType(CreateShortUrlDto, [
  'tags',
  'generateQrCode',
]) {
  @IsString()
  @IsOptional()
  customShortId?: string;
}
