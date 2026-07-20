import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ServiceService } from './service/service.service';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
     ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
     PrismaModule,
  ],
  controllers: [AppController],
  providers: [AppService, ServiceService],
})
export class AppModule {}
