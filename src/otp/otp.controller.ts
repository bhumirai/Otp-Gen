import { Controller, Post, Get, Param, Query } from '@nestjs/common';
import { OtpService, OtpData } from './otp.service';

@Controller('otp')
export class OtpController {
  constructor(private readonly otpService: OtpService) {}

  // Generate OTP using a path parameter (/:userId)
  @Post('generate/:userId')
  generateOtp(@Param('userId') userId: string): OtpData {
    return this.otpService.generateOtp(userId);
  }

  // Verify OTP using query parameters (?userId=xyz&otp=123456)
  @Get('verify')
  verifyOtp(@Query('userId') userId: string, @Query('otp') otp: string): string {
    return this.otpService.verifyOtp(userId, otp);
  }
}
