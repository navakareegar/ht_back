import {
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsOptional,
} from 'class-validator';

export class HabitLogDto {
  @IsDateString()
  @IsOptional()
  date?: Date;

  @IsBoolean()
  @IsNotEmpty()
  done: boolean;
}
