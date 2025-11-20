import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HabitController } from './habit.controller';
import { HabitService } from './habit.service';
import { Habit } from './habit.entity';
import { HabitLog } from './habit-log.entity';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Habit, HabitLog]),
    forwardRef(() => UserModule),
  ],
  controllers: [HabitController],
  providers: [HabitService],
  exports: [HabitService],
})
export class HabitModule {}
