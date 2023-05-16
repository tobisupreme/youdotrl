import { Injectable } from '@nestjs/common';
import { customAlphabet } from 'nanoid';

const CHARS = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

@Injectable()
export class AppUtilities {
  public static generateShortCode(charLen = 6): string {
    const nanoid = customAlphabet(CHARS, charLen);

    return nanoid();
  }
}
