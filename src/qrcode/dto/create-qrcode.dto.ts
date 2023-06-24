import { IsOptional, IsString } from 'class-validator';

export class CreateQrCodeDto {
  @IsString()
  @IsOptional()
  text: string;
}
