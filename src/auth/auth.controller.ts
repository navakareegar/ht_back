import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  Response,
  Get,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { LocalAuthGuard } from './guards/local.guard';
import { JwtAuthGuard } from './guards/jwt.guard';
import { getCookieOptions } from '../config/cookie.config';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  async signup(@Body() dto: RegisterDto) {
    return this.authService.signup(dto);
  }

  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Response({ passthrough: true }) res,
  ) {
    const user = await this.authService.validateUser(
      loginDto.email,
      loginDto.password,
    );

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const { access_token, refresh_token } = await this.authService.login(user);

    res.cookie('refresh_token', refresh_token, getCookieOptions());

    return {
      access_token,
    };
  }

  @Get('refresh-token')
  @HttpCode(HttpStatus.OK)
  async refreshToken(@Request() req, @Response({ passthrough: true }) res) {
    const refreshToken = req.cookies['refresh_token'];

    if (!refreshToken) {
      return res.status(400).json({ message: 'Refresh token not provided' });
    }

    try {
      const { access_token, refresh_token: new_refresh_token } =
        await this.authService.refreshTokens(refreshToken);

      res.cookie('refresh_token', new_refresh_token, getCookieOptions());

      return { access_token };
    } catch (error) {
      return res.status(401).json({ message: 'Invalid refresh token' });
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@Request() req) {
    return this.authService.getProfile(req.user.id);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(@Request() req, @Response({ passthrough: true }) res) {
    const authHeader = req.headers.authorization;

    if (authHeader) {
      try {
        const token = authHeader.split(' ')[1];
        const payload = await this.authService.verifyToken(token);
        await this.authService.logout(payload.sub);
      } catch (error) {}
    }

    res.clearCookie('refresh_token', getCookieOptions());

    return { message: 'Logged out successfully' };
  }
}
