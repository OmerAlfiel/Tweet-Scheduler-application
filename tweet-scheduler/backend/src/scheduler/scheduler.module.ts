import { Module, forwardRef } from '@nestjs/common';
import { SchedulerService } from './scheduler.service';
import { TwitterModule } from '../twitter/twitter.module';
import { ScheduleModule } from '@nestjs/schedule';
import { BullModule } from '@nestjs/bull';
import { BullService } from './bull.service';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    UserModule,
    forwardRef(() => TwitterModule), // Use forwardRef to break circular dependency
    ScheduleModule.forRoot(),
    BullModule.registerQueue({
      name: 'tweets',
    }),
  ],
  providers: [SchedulerService, BullService],
  exports: [BullService], // Export BullService
})
export class SchedulerModule {}

