import { CallHandler, Injectable, NestInterceptor } from "@nestjs/common";

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(context: any, next: CallHandler,) {
   return next.handle()
  }
}