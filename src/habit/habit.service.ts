import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Habit } from './habit.entity';
import { HabitLog } from './habit-log.entity';
import { formatDateForAPI } from 'src/util/common';
import { ResourceNotFoundException } from '../common/exceptions/custom.exception';

@Injectable()
export class HabitService {
  constructor(
    @InjectRepository(Habit)
    private habitRepository: Repository<Habit>,
    @InjectRepository(HabitLog)
    private habitLogRepository: Repository<HabitLog>,
  ) {}

  async create(
    userId: string,
    title: string,
    description?: string,
    date?: Date,
  ): Promise<Habit> {
    const habit = this.habitRepository.create({
      userId,
      title,
      description,
      date: date || new Date(),
    });
    return this.habitRepository.save(habit);
  }

  async findAll(userId: string): Promise<any[]> {
    const habits = await this.habitRepository.find({
      where: { userId },
      order: { date: 'DESC' },
    });

    const habitsWithStatus = await Promise.all(
      habits.map(async (habit) => {
        const lastLog = await this.habitLogRepository.findOne({
          where: { habitId: habit.id },
          order: { date: 'DESC' },
        });

        return {
          ...habit,
          done: lastLog?.done ?? false,
        };
      }),
    );

    return habitsWithStatus;
  }

  private async getHabitEntity(id: string, userId: string): Promise<Habit> {
    const habit = await this.habitRepository.findOne({
      where: { id, userId },
    });
    if (!habit) {
      throw new ResourceNotFoundException('Habit', id);
    }
    return habit;
  }

  async findOne(id: string, userId: string): Promise<any> {
    const habit = await this.getHabitEntity(id, userId);

    const lastLog = await this.habitLogRepository.findOne({
      where: { habitId: id },
      order: { date: 'DESC' },
    });

    return {
      ...habit,
      done: lastLog?.done ?? false,
      date: lastLog?.date ?? null,
    };
  }

  async update(
    id: string,
    userId: string,
    title?: string,
    description?: string,
  ): Promise<Habit> {
    const habit = await this.getHabitEntity(id, userId);
    if (title !== undefined) habit.title = title;
    if (description !== undefined) habit.description = description;
    return this.habitRepository.save(habit);
  }

  async toggleDone(
    id: string,
    userId: string,
    date: Date,
    done: boolean,
  ): Promise<Habit> {
    const habit = await this.getHabitEntity(id, userId);
    habit.date = date;

    const existingLog = await this.habitLogRepository.findOne({
      where: { habitId: id, date },
    });

    if (existingLog) {
      existingLog.done = done;
      await this.habitLogRepository.save(existingLog);
    } else {
      const habitLog = this.habitLogRepository.create({
        habitId: id,
        date: date,
        done,
      });
      await this.habitLogRepository.save(habitLog);
    }

    return this.habitRepository.save(habit);
  }

  async remove(id: string, userId: string): Promise<void> {
    const habit = await this.getHabitEntity(id, userId);
    await this.habitRepository.remove(habit);
  }

  async getWeekLogs(
    habitId: string,
    userId: string,
    weekStart: Date,
  ): Promise<HabitLog[]> {
    await this.getHabitEntity(habitId, userId);

    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 7);

    const logs = await this.habitLogRepository.find({
      where: {
        habitId,
      },
      order: { date: 'ASC' },
    });

    const weekLogs = logs.filter((log) => {
      const logDate = new Date(log.date);
      return logDate >= weekStart && logDate < weekEnd;
    });

    return weekLogs;
  }

  async findAllForToday(userId: string): Promise<any[]> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const habits = await this.habitRepository.find({
      where: { userId },
      order: { date: 'DESC' },
    });

    const habitsWithTodayStatus = await Promise.all(
      habits.map(async (habit) => {
        const todayLog = await this.habitLogRepository.findOne({
          where: {
            habitId: habit.id,
            date: today,
          },
        });

        return {
          ...habit,
          done: todayLog?.done ?? false,
          logDate: todayLog?.date ?? null,
        };
      }),
    );

    return habitsWithTodayStatus;
  }

  async getWeeklyReport(userId: string, weekStart: Date): Promise<any> {
    const weekStartDate = new Date(weekStart);
    weekStartDate.setHours(0, 0, 0, 0);

    const weekEndDate = new Date(weekStartDate);
    weekEndDate.setDate(weekEndDate.getDate() + 7);

    const habits = await this.habitRepository.find({
      where: { userId },
      order: { date: 'DESC' },
    });

    const habitsReport = await Promise.all(
      habits.map(async (habit) => {
        const logs = await this.habitLogRepository.find({
          where: { habitId: habit.id },
        });

        const weekLogs = logs.filter((log) => {
          const logDate = new Date(log.date);
          logDate.setHours(0, 0, 0, 0);
          return logDate >= weekStartDate && logDate < weekEndDate;
        });

        const daysCompleted = weekLogs.filter((log) => log.done).length;
        const daysMissed = 7 - daysCompleted;
        if (weekLogs.length !== 0)
          return {
            habitId: habit.id,
            title: habit.title,
            daysCompleted,
            daysMissed,
          };
      }),
    );

    const responseWeekEnd = new Date(weekEndDate);
    responseWeekEnd.setDate(responseWeekEnd.getDate() - 1);

    return {
      weekStart: formatDateForAPI(weekStartDate),
      weekEnd: formatDateForAPI(responseWeekEnd),
      habits: habitsReport.filter((habit) => habit),
    };
  }
}
