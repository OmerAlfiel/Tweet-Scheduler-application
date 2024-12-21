import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccountEntity } from '../database/entities/account.entity';
import { HistoryEntity } from '../database/entities/history.entity';
import { TwitterService } from '../twitter/twitter.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(AccountEntity)
    private readonly accountRepository: Repository<AccountEntity>,
    @InjectRepository(HistoryEntity)
    private readonly historyRepository: Repository<HistoryEntity>,
    private readonly twitterService: TwitterService, // Inject TwitterService
  ) {}

  async addAccount(username: string, schedule: string): Promise<AccountEntity> {
    const account = this.accountRepository.create({ username, schedule });
    return await this.accountRepository.save(account);
  }

  async removeAccount(accountId: string): Promise<void> {
    await this.accountRepository.delete(accountId);
  }

  async listAccounts(): Promise<AccountEntity[]> {
    return await this.accountRepository.find();
  }

  async updateSchedule(accountId: string, schedule: string): Promise<AccountEntity> {
    const account = await this.accountRepository.findOne({ where: { id: accountId } });
    if (!account) {
      throw new Error('Account not found');
    }
    account.schedule = schedule;
    return await this.accountRepository.save(account);
  }

  async trackHistory(tweetId: string, postedTweetId: string): Promise<HistoryEntity> {
    const history = this.historyRepository.create({ tweetId, postedTweetId, timestamp: new Date() });
    return await this.historyRepository.save(history);
  }

  async fetchAndSaveTweets(accountId: string, count: number): Promise<void> {
    const account = await this.accountRepository.findOne({ where: { id: accountId } });
    if (!account) {
      throw new Error('Account not found');
    }
    const tweets = await this.twitterService.fetchTweets(account.username, count);
    
    for (const tweet of tweets.tweets) {
      const history = this.historyRepository.create({
        tweetId: tweet.id_str,
        postedTweetId: null, // Assuming this is for fetched tweets, not posted ones
        timestamp: new Date(tweet.created_at),
      });
      await this.historyRepository.save(history);
    }
    
    console.log(`Fetched and saved ${tweets.tweets.length} tweets for account ${account.username}`);
  }
}

