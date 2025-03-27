import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

const OTP_FILE_PATH = path.join(__dirname, 'otp.json');
console.log(OTP_FILE_PATH);

export interface OtpData {
  userId: string;
  otp: string;
  generatedAt: Date;
}

@Injectable()
export class OtpService {
  // Read OTP store from JSON file
  private readOtpStore(): Record<string, OtpData> {
    if (!fs.existsSync(OTP_FILE_PATH)) {
      return {};
    }
    try {
      const data = fs.readFileSync(OTP_FILE_PATH, 'utf-8');
      return data ? JSON.parse(data) : {};
    } catch (error) {
      console.error('Error reading OTP store:', error);
      return {};
    }
  }

  // Write OTP store to JSON file
  private writeOtpStore(data: Record<string, OtpData>): void {
    try {
      fs.writeFileSync(OTP_FILE_PATH, JSON.stringify(data, null, 2), { flag: 'w' });
    } catch (error) {
      console.error('Error writing OTP store:', error);
    }
  }

  // Generate OTP for a user using a path parameter
  generateOtp(userId: string): OtpData {
    const otp = (Math.floor(100000 + Math.random() * 900000)).toString(); // Generate a 6-digit OTP
    const generatedAt = new Date();

    const otpStore = this.readOtpStore();
    otpStore[userId] = { userId, otp, generatedAt }; // Store OTP in JSON file

    console.log(`Generated OTP for ${userId}:`, otp); 
    
    this.writeOtpStore(otpStore);

    return { userId, otp, generatedAt };
  }

  // Verify OTP using query parameters
  verifyOtp(userId: string, otp: string): string {
    const otpStore = this.readOtpStore();
    const storedOtpData = otpStore[userId];

    if (!storedOtpData) {
      return 'Invalid OTP'; // No OTP found for this user
    }

    const now = new Date();
    const diff = (now.getTime() - new Date(storedOtpData.generatedAt).getTime()) / 1000;

    if (diff > 600) {
      return 'OTP expired'; 
    }

    return storedOtpData.otp === otp ? 'OTP verified' : 'Incorrect OTP';
  }
}
