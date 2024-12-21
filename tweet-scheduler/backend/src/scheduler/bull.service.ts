import { Injectable } from '@nestjs/common';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { TwitterApi } from 'twitter-api-v2';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class BullService {
  constructor(
    @InjectQueue('tweets') private readonly tweetQueue: Queue,
    private readonly configService: ConfigService
  ) {}

  // Add a job to post a tweet
  // This method is called by the TwitterService
  // when it needs to post a tweet at a scheduled time

  async addPostTweetJob(tweetContent: string, date: Date) {
    await this.tweetQueue.add('postTweet', { tweetContent }, { delay: date.getTime() - Date.now() });
  }

  // Add a job to fetch tweets
  // This method is called by the SchedulerService
  // when it fetches tweets for all accounts every day at 8:00 AM 

  async addFetchTweetsJob() {
    await this.tweetQueue.add('fetchTweets', { date: new Date() });
  }

  // Process jobs in the queue
  // This method is called by the Interval job in the SchedulerService
  // every 5 minutes to process any pending tweet jobs  

  async processTweetJobs() {
    const bearerToken = this.configService.get<string>('Bearer_Token');
    this.tweetQueue.process('fetchTweets', async (job) => {
      console.log('Fetching tweets:', job.data);
      try {
        const twitterClient = new TwitterApi(bearerToken);
        const tweets = await twitterClient.v2.homeTimeline();
        console.log('Fetched tweets:', tweets);
      } catch (error) {
        console.error('Error fetching tweets:', error);
      }
    });

    this.tweetQueue.process('postTweet', async (job) => {
      console.log('Posting tweet:', job.data.tweetContent);
      try {
        const twitterClient = new TwitterApi(bearerToken);
        const tweet = await twitterClient.v2.tweet(job.data.tweetContent);
        console.log('Posted tweet:', tweet);
      } catch (error) {
        console.error('Error posting tweet:', error);
      }
    });
  }
}

