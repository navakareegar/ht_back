import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Request,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { HabitService } from './habit.service';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { habitDto } from './dto/habit.dto';
import { HabitLogDto } from './dto/habit-log.dto';

@Controller('habits')
@UseGuards(JwtAuthGuard)
export class HabitController {
  constructor(private readonly habitService: HabitService) {}

  @Post()
  async create(@Request() req, @Body() createHabitDto: habitDto) {
    return this.habitService.create(
      req.user.id,
      createHabitDto.title,
      createHabitDto.description,
      createHabitDto.date,
    );
  }

  @Get()
  async findAll(@Request() req) {
    return this.habitService.findAll(req.user.id);
  }

  @Get('today')
  async findAllForToday(@Request() req) {
    return this.habitService.findAllForToday(req.user.id);
  }

  @Get('report/weekly')
  async getWeeklyReport(@Request() req, @Query('weekStart') weekStart: string) {
    if (!weekStart) {
      throw new BadRequestException('weekStart query parameter is required');
    }

    const weekStartDate = new Date(weekStart);
    return this.habitService.getWeeklyReport(req.user.id, weekStartDate);
  }

  @Get(':id/logs')
  async getWeekLogs(
    @Request() req,
    @Param('id') id: string,
    @Query('weekStart') weekStart: string,
  ) {
    if (!weekStart) {
      throw new BadRequestException('weekStart query parameter is required');
    }

    const weekStartDate = new Date(weekStart);
    const logs = await this.habitService.getWeekLogs(
      id,
      req.user.id,
      weekStartDate,
    );

    return logs;
  }

  @Get('/:id')
  async findOne(@Request() req, @Param('id') id: string) {
    return this.habitService.findOne(id, req.user.id);
  }

  @Put(':id')
  async update(
    @Request() req,
    @Param('id') id: string,
    @Body() updateHabitDto: habitDto,
  ) {
    let result;

    result = await this.habitService.update(
      id,
      req.user.id,
      updateHabitDto.title,
      updateHabitDto.description,
    );

    if (updateHabitDto.done !== undefined) {
      result = await this.habitService.toggleDone(
        id,
        req.user.id,
        updateHabitDto?.date || new Date(),
        updateHabitDto.done ?? false,
      );
    }

    return result;
  }

  @Delete(':id')
  async remove(@Request() req, @Param('id') id: string) {
    await this.habitService.remove(id, req.user.id);
    return { message: 'Habit deleted successfully' };
  }

  @Post(':id/log')
  async toggleDone(
    @Request() req,
    @Param('id') id: string,
    @Body() toggleHabitDto: HabitLogDto,
  ) {
    return this.habitService.toggleDone(
      id,
      req.user.id,
      toggleHabitDto.date || new Date(),
      toggleHabitDto.done ?? false,
    );
  }
}
