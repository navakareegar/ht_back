import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { HabitModule } from './habit/habit.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'habit-tracker',
      autoLoadEntities: true,
      synchronize: process.env.NODE_ENV !== 'production', // Only in development
      migrations: ['dist/migrations/*.js'],
      migrationsRun: false, // Set to true to auto-run migrations on app start
    }),
    UserModule,
    AuthModule,
    HabitModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
