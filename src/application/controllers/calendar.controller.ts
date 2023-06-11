import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/shared/jwt-auth.guard';
import { CalendarService } from '../services/calendar.service';

@Controller('calendar')
export class CalendarController {
  constructor(private readonly calendarService: CalendarService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getCalendar(@Req() req) {
    const user_id = req.user.user_id;
    const data = await this.calendarService.findCalendarByUserId(user_id);
    return {
      message: 'Calendar retrieved successfully',
      data,
    };
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  async createCalendar(@Req() req) {
    const user_id = req.user.user_id;
    const { description, timestamp, event_type } = req.body;
    return await this.calendarService.createCalendar({
      user_id,
      description,
      start_at: timestamp,
      event_type,
    });
  }
}
