import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ServiceService } from './service/service.service';
import { PrismaModule } from './prisma/prisma.module';
import { TaskModule } from './task/task.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
     ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
     PrismaModule,
     TaskModule,
     UserModule,
  ],
  controllers: [AppController],
  providers: [AppService, ServiceService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
   consumer.apply(LoggerMiddleware).forRoutes({
  path: '*',
  method: RequestMethod.ALL,
});
  }
}
