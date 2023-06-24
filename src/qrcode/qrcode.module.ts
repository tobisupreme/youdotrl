import { Module } from '@nestjs/common';
import { QrcodeService } from './qrcode.service';

@Module({
  providers: [QrcodeService],
  exports: [QrcodeService],
})
export class QrcodeModule {}
