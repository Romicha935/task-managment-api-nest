import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    console.log('Incoming Request');
    console.log(req.method);
    console.log(req.originalUrl);
    next();
  }
}
