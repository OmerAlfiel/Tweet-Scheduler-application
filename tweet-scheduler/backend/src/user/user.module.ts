import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserService } from './user.service';
import { AccountEntity } from '../database/entities/account.entity';
import { HistoryEntity } from '../database/entities/history.entity';
import { TwitterModule } from '../twitter/twitter.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([AccountEntity, HistoryEntity]),
    forwardRef(() => TwitterModule), // Use forwardRef to break circular dependency
  ],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}

