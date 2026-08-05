import { Body, Controller, Get, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt.auth.guard';
import { RefreshTokenDto } from './dto/refresh-token-dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { VerifyOtpDto } from './dto/verify-otp-dto';
import { ResetPasswordDto } from './dto/reset-password-dto';
import { ForgotPasswordDto } from './dto/forgot-password-dto';
import { Role } from '@prisma/client';
import { Roles } from './decorator/roles.decorator';
import { RolesGuard } from './roles.guard';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';

type CurrentUserType = {
  userId: string;
  email: string;
};

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('refresh') 
  refresh(
    @Body() refreshTokenDto: RefreshTokenDto
  ) {
    return this.authService.refresh(refreshTokenDto);
  }
  
  @UseGuards(JwtAuthGuard)
   @Get('profile')
  getProfile(@CurrentUser() user: CurrentUserType) {
   return this.authService.profile(user.userId)
  }

  @UseGuards(JwtAuthGuard)
@Post('logout')
logout(@Req() req: any) {
  return this.authService.logout(req.user.userId);
}


@UseGuards(JwtAuthGuard)
@Patch('change-password')
changePassword(@Req() req: any, @Body() changePasswordDto: ChangePasswordDto) {
  return this.authService.changePassword(req.user.userId, changePasswordDto);
}

@Post('forgot-password')
forgotPassword(
  @Body() forgotPasswordDto: ForgotPasswordDto,
) {
  return this.authService.forgotPassword(
    forgotPasswordDto,
  );
}

@Post('verify-otp')
verifyOtp(
  @Body() verifyOtpDto: VerifyOtpDto,
) {
  return this.authService.verifyOtp(
    verifyOtpDto,
  );
}

@Post('reset-password')
resetPassword(
  @Body() resetPasswordDto: ResetPasswordDto,
) {
  return this.authService.resetPassword(
    resetPasswordDto,
  );
}

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@Get('admin-test')
adminTest() {
  return {
    message: 'Welcome Admin',
  };
}
}