import { Controller, Post, Delete, Get, Patch, Body, Param } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('accounts')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async addAccount(@Body('username') username: string, @Body('schedule') schedule: string) {
    return await this.userService.addAccount(username, schedule);
  }

  @Delete(':id')
  async removeAccount(@Param('id') id: string) {
    return await this.userService.removeAccount(id);
  }

  @Get()
  async listAccounts() {
    return await this.userService.listAccounts();
  }

  @Patch(':id/schedule')
  async updateSchedule(@Param('id') id: string, @Body('schedule') schedule: string) {
    return await this.userService.updateSchedule(id, schedule);
  }

  @Post('history')
  async trackHistory(@Body('tweetId') tweetId: string, @Body('postedTweetId') postedTweetId: string) {
    return await this.userService.trackHistory(tweetId, postedTweetId);
  }
}

