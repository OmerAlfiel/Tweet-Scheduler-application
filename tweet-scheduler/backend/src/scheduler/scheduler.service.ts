import { Injectable } from '@nestjs/common';
import { Cron, Interval, Timeout } from '@nestjs/schedule';
import { BullService } from 'src/scheduler/bull.service';

import { UserService } from '../user/user.service';

@Injectable()
export class SchedulerService {
  constructor(
    private readonly bullService: BullService,
    private readonly userService: UserService, // Inject UserService
  ) {}

  // Run a task every day at 8:00 AM
  @Cron('0 8 * * *')
  async fetchDailyTweets() {
    console.log('Cron job triggered: Fetching daily tweets...');
    await this.executeFetchDailyTweets();
  }

  // Run a one-time task at startup
  @Timeout(0)
  async fetchDailyTweetsAtStartup() {
    console.log('Startup job triggered: Fetching daily tweets...');
    await this.executeFetchDailyTweets();
  }

  private async executeFetchDailyTweets() {
    try {
      const accounts = await this.userService.listAccounts();
      for (const account of accounts) {
        await this.userService.fetchAndSaveTweets(account.id, 10); // Fetch and save tweets for each account
        await this.bullService.addFetchTweetsJob(); // Add a job to fetch tweets
      }
    } catch (error) {
      console.error('Error fetching daily tweets:', error);
    }
  }

  // Run a task every 30 seconds
  @Interval(500000)
  async postScheduledTweets() {
    console.log('Interval job triggered: Posting scheduled tweets...');
    try {
      await this.bullService.processTweetJobs(); // Process any pending tweet jobs
    } catch (error) {
      if (error.message.includes('Cannot define the same handler twice')) {
        console.warn('Handler already defined, skipping...');
      } else {
        console.error('Error posting scheduled tweets:', error);
      }
    }
  }

  // Run a one-time task after 10 seconds of startup
  @Timeout(10000)
  handleStartupTask() {
    console.log('Timeout job triggered: Scheduler initialized...');
  }
}

