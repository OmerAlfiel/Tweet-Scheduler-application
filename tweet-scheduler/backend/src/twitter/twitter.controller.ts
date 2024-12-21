import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { TwitterService } from './twitter.service';

@Controller('twitter')
export class TwitterController {
  constructor(private readonly twitterService: TwitterService) {}

  @Post('tweet')
  async postTweet(@Body('content') content: string) {
    return this.twitterService.postTweet(content);
  }

  @Get('tweets')
  async fetchTweets(@Query('account') account: string, @Query('count') count: number) {
    return this.twitterService.fetchTweets(account, count);
  }

  @Post('schedule')
  async scheduleTweet(@Body('content') content: string, @Body('date') date: string) {
    const scheduledDate = new Date(date);
    return this.twitterService.scheduleTweet(content, scheduledDate);
  }
}

