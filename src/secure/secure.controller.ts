import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';

@Controller('secure')
export class SecureController {
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return {
      message: 'This is a protected route',
      user: req.user,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('dashboard')
  getDashboard(@Request() req) {
    return {
      message: 'Welcome to the dashboard',
      user: req.user,
    };
  }
}
