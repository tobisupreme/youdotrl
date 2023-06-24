import { Injectable } from '@nestjs/common';
import * as QRCode from 'qrcode';

@Injectable()
export class QrcodeService {
  async generateQrCode(text: string) {
    return await QRCode.toDataURL(text);
  }
}
