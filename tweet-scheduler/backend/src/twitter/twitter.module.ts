import { Module, forwardRef } from '@nestjs/common';
import { TwitterService } from './twitter.service';
import { TwitterController } from './twitter.controller';
import { ConfigModule } from '@nestjs/config';
import { SchedulerModule } from 'src/scheduler/scheduler.module';

@Module({
  imports: [ConfigModule, forwardRef(() => SchedulerModule)], // Use forwardRef to break circular dependency
  providers: [TwitterService],
  controllers: [TwitterController],
  exports: [TwitterService],
})
export class TwitterModule {}
