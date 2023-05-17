import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';

@Injectable()
export class RequestInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const { body, headers, method, params, query, url } = context
      .switchToHttp()
      .getRequest<Request>();

    const xHeaders = { ...headers };
    const xBody = { ...body };
    delete xHeaders.authorization;
    delete xBody.password;
    delete xBody.newPassword;
    console.log('🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥');
    console.log('URL -->', `${method} ${url}`);
    console.log('headers -->', xHeaders);
    xBody && console.log('body -->', xBody);
    params && console.log('params -->', params);
    query && console.log('query -->', query);
    console.log('🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥🔥');

    return next.handle();
  }
}
