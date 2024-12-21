import { Injectable } from '@nestjs/common';
import { Logger } from '@nestjs/common';

import { TwitterApi } from 'twitter-api-v2';
import { TwitterUtility } from './utils/twitter.utility';
import { ConfigService } from '@nestjs/config';
import { BullService } from '../scheduler/bull.service';

@Injectable()
export class TwitterService {
  private readonly twitterClient: TwitterApi;
  private readonly tweetHistory: Set<string> = new Set();
  private readonly bearerToken: string;
  private readonly logger = new Logger(TwitterService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly bullService: BullService
  ) {
    const appKey = this.configService.get<string>('TWITTER_API_KEY');
    const appSecret = this.configService.get<string>('TWITTER_API_SECRET');
    const accessToken = this.configService.get<string>('ACCESS_TOKEN');
    const accessSecret = this.configService.get<string>('ACCESS_TOKEN_SECRET');
    this.bearerToken = this.configService.get<string>('Bearer_Token');

    if (!appKey || !appSecret || !accessToken || !accessSecret || !this.bearerToken) {
      throw new Error('Twitter API keys and tokens must be defined in the environment variables');
    }

    this.logger.log(`Twitter API Key: ${appKey}`);
    this.logger.log(`Twitter API Secret: ${appSecret ? 'Loaded' : 'Not Loaded'}`);
    this.logger.log(`Access Token: ${accessToken ? 'Loaded' : 'Not Loaded'}`);
    this.logger.log(`Access Secret: ${accessSecret ? 'Loaded' : 'Not Loaded'}`);
    this.logger.log(`Bearer Token: ${this.bearerToken ? 'Loaded' : 'Not Loaded'}`);

    this.twitterClient = new TwitterApi({
      appKey,
      appSecret,
      accessToken,
      accessSecret
      // bearerToken: this.bearerToken,
    });
  }

  async authenticate() {
    // Authentication logic if needed
  }

  async fetchTweets(account: string, count: number) {
    const tweets = await this.twitterClient.v1.userTimeline(account, { count, exclude_replies: true, include_rts: false });
    // Save fetched tweets to the database for debugging or audit purposes
    return tweets;
  }

  async postTweet(content: string) {
    try {
      const modifiedContent = TwitterUtility.modifyTweet(content);
      if (TwitterUtility.validateTweet(modifiedContent, this.tweetHistory)) {
        TwitterUtility.logTweet(modifiedContent); // Log the tweet
        const response = await this.twitterClient.v1.tweet(modifiedContent);
        this.tweetHistory.add(modifiedContent);
        return response;
      } else {
        throw new Error('Invalid tweet content');
      }
    } catch (error) {
      this.logger.error('Error posting tweet:', error.message);
      if (error.response) {
        this.logger.error('Twitter API response:', error.response.data);
      }
      throw new Error('Failed to post tweet');
    }
  }

  async scheduleTweet(content: string, date: Date) {
    try {
      const modifiedContent = TwitterUtility.modifyTweet(content);
      if (TwitterUtility.validateTweet(modifiedContent, this.tweetHistory)) {
        await this.bullService.addPostTweetJob(modifiedContent, date);
        return { message: 'Tweet scheduled successfully' };
      } else {
        throw new Error('Invalid tweet content');
      }
    } catch (error) {
      console.error('Error scheduling tweet:', error);
      throw new Error('Failed to schedule tweet');
    }
  }
}
