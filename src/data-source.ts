import { DataSource } from 'typeorm';
import { User } from './user/user.entity';
import { Habit } from './habit/habit.entity';
import { HabitLog } from './habit/habit-log.entity';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'postgres',
  password: 'postgres',
  database: 'habit-tracker',
  entities: [User, Habit, HabitLog],
  migrations: ['src/migrations/*.ts'],
  synchronize: false,
  logging: true,
});

