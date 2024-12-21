import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TwitterModule } from './twitter/twitter.module';
import { SchedulerModule } from './scheduler/scheduler.module';
import { BullService } from './scheduler/bull.service';
import { ScheduleModule } from '@nestjs/schedule';
import { BullModule } from '@nestjs/bull';
import { DatabaseModule } from './database/database.module';
import { UserModule } from './user/user.module';
import { UserController } from './user/user.controller';
import { UserService } from './user/user.service';
import { SchedulerService } from './scheduler/scheduler.service';
import { TwitterService } from './twitter/twitter.service';
import { TwitterUtility } from './twitter/utils/twitter.utility';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env', // Ensure this path is correct
    }),
    TwitterModule, 
    SchedulerModule,
    ScheduleModule.forRoot(),
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT, 10),
      },
    }),
    BullModule.registerQueue({
      name: 'tweetQueue',
    }),
    BullModule.registerQueue({
      name: 'tweets',
    }),
    DatabaseModule,
    UserModule,
  ],
  controllers: [AppController, UserController],
  providers: [
    AppService, 
    BullService, 
    UserService, 
    SchedulerService, 
    TwitterService, 
    TwitterUtility,
    ConfigService
  ],
})
export class AppModule {}
