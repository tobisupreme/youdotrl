import { Request } from 'express';

export enum ResponseMessage {
  SUCCESS = 'Request Successful!',
  FAILED = 'Request Failed!',
}

export interface RequestUser extends Request {
  user: JwtPayload;
}

export interface JwtPayload {
  sub: string;
  username: string;
  iat: number;
  exp: number;
}
