import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Get,
  UnauthorizedException,
  HttpException,
  HttpStatus,
  Res,
  Param,
  Put,
  NotFoundException,
} from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { GoogleAuthGuard } from '../guards/google-auth.guard';
import { SendOtpDto } from 'src/dtos/sendOtps.dto';
import { ResetPasswordDto, VerifyOtpDto } from 'src/dtos/verifyOtp.dto';
import { log } from 'node:console';
import { Response } from 'express';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/services/user.service';
import { Transaction } from 'src/schemas/transaction.schema';
import { BlockchainService, chain } from 'src/services/blockchain.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
    private readonly blockchain: BlockchainService
  ) {}

  @Post('login')
  async login(@Body() loginDto: { email: string; password: string; token: string }) {
  const user = await this.authService.validateUser(
    loginDto.email,
    loginDto.password,
    loginDto.token,
  );

  if (!user) {
    throw new UnauthorizedException('Invalid credentials or unauthorized device');
  }

  return this.authService.login(user);
  }

  @Post('register')
  async register(
    @Body()
    registerDto: {
      name: string;
      email:string;
      address: string;
      macAddresses: string[]; // Allow multiple device logins
      mobileNumber: string;
      password: string;
    },
  ) {
    try {
      const response = await this.authService.register(registerDto);
      return response; // Returning accessToken and userId
    } catch (error) {
      console.log(error.message);
      
      return { message: error.message };
    }
  }

  

  @Get('protected')
  @UseGuards(JwtAuthGuard)
  getProtectedResource() {
    return { message: 'This is a protected route' };
  }

  @Get(':id')
  async getUserInfo(@Param('id') userId: string, @Res() res: Response) {
    // The controller logic for fetching user info
    try {
      const user = await this.userService.getUserById(userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // If needed, you can perform additional logic here before sending the response
      // Send the user data and the new access token in the response
      return res.status(200).json({
        message: 'User info retrieved successfully.',
        user,
        newAccessToken: user.accessToken, // Retrieve from response locals
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

  @Put(':id')
  async updateUser(@Param('id') id: string, @Body() updateUserDto: any) {
    const updatedUser = await this.authService.updateUser(id, updateUserDto);
    if (!updatedUser) {
      throw new NotFoundException('User not found');
    }
    return { message: 'User updated successfully', user: updatedUser };
  }

  @Post('forgot-password')
  async forgotPassword(@Body() sendOtpDto: SendOtpDto) {
    const user = await this.authService.findUserByEmail(sendOtpDto.email);
    if (!user) {
      throw new HttpException('Email not found', HttpStatus.NOT_FOUND);
    }

    const otpSession = await this.authService.createOtpSession(user);
    // Send OTP to user's email
    await this.authService.sendOtpEmail(user.email, otpSession.otp);

    return { message: 'OTP sent to email' };
  }

  // Endpoint to verify OTP
  @Post('verify-otp')
  async verifyOtp(@Body() verifyOtpDto: VerifyOtpDto) {
    const valid = await this.authService.verifyOtp(
      verifyOtpDto.email,
      verifyOtpDto.otp,
    );
    if (!valid) {
      throw new HttpException('Invalid OTP', HttpStatus.FORBIDDEN);
    }

    return { message: 'OTP verified successfully' };
  }

  @Get('users/:id')
async getAllUsersExceptCurrent(@Param('id') userId: string, @Res() res: Response) {
  try {
    // Fetch all users except the one with the provided userId
    const users = await this.userService.getAllUsersExcept(userId);
    
    if (!users || users.length === 0) {
      return res.status(404).json({ message: 'No users found' });
    }

    return res.status(200).json({ message: 'Users retrieved successfully', users });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}


  // Endpoint for password reset
  @Post('reset-password')
  async resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    const resetSuccess = await this.authService.resetPassword(
      resetPasswordDto.email,
      resetPasswordDto.newPassword,
    );

    if (!resetSuccess) {
      throw new HttpException('Password reset failed', HttpStatus.BAD_REQUEST);
    }

    return { message: 'Password reset successful' };
  }

  @Post('user/transaction')
  async createTransaction(@Body('transaction') txn: Transaction) {
    this.blockchain.processTransaction(txn);
  }

  @Post('user/update-fraud')
  async updateFraud(@Body('transaction') txn: Transaction) {
    this.blockchain.updateFraud(txn);
  }

  @Post('user/get-transactions')
  async getUserTransactions(@Body('userId') uid: string) {
    return chain;
  }
}
