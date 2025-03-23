import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt'; // Import JwtService
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../schemas/user.schema'; // Import User interface
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto'; // For generating OTP
import * as nodemailer from 'nodemailer'; // For sending OTP emails
import { MailerService } from '@nestjs-modules/mailer';
import * as CryptoJS from 'crypto-js';
@Injectable()
export class AuthService {
  // Inject JwtService and UserModel into the constructor
  constructor(
    private readonly jwtService: JwtService, // Inject JwtService
    private readonly mailerService: MailerService,
    @InjectModel('User') private readonly userModel: Model<User>, // Inject UserModel here
  ) {}

  async generateAccessToken(user: User): Promise<any> {
    const payload = { email: user.email, sub: user._id };
    const token = await this.jwtService.signAsync(payload);

    return token; // Ensure `JwtService` is correctly configured.
  }

  async updateUser(id: string, updateUserDto: any): Promise<User | null> {
    console.log(id);

    // Find the user by ID
    const user = await this.userModel.findById(id);
    if (!user) {
      return null; // Return null if user not found
    }

    // Update the user object with new values
    Object.assign(user, updateUserDto);

    // Save the updated user and return it
    return await user.save();
  }

  async saveAccessToken(userId: string, accessToken: string): Promise<void> {
    console.log('SAVING: ', accessToken);

    // Ensure you update the user's accessToken in the database
    await this.userModel.updateOne(
      { _id: userId },
      { $set: { accessToken } }, // Use $set to update the accessToken field
    );
  }

  async findUserByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }

  async validateUser(email: string, password: string, deviceId: string) {
    const user = await this.userModel.findOne({ email });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    
    const decryptedPassword = password;

    if (!decryptedPassword) {
      throw new UnauthorizedException('Failed to decrypt password');
    }

    const isPasswordValid = await bcrypt.compare(decryptedPassword, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }

    // Check if the device is allowed
    if (!user.macAddresses.includes(deviceId)) {
      throw new UnauthorizedException('Unauthorized device');
    }

    return user;
  }

  async login(user: any) {
    const payload = { email: user.email, sub: user._id };
  
    // Generate JWT access token
    const accessToken = this.jwtService.sign(payload);
  
    // Save the access token in the user model
    await this.userModel.findByIdAndUpdate(
      user._id,
      
      { accessToken },
      { new: true },
    );
  
    // Return the token and user ID
    return {
      access_token: accessToken,
      userId: user._id,
      user: user,
    };
  }
  

  async register(registerDto: {
    name: string;
    email: string;
    
    address: string;
    macAddresses: string[];
    mobileNumber: string;
    password: string;
  }) {
    const { name,  address, macAddresses, mobileNumber, password, email } =
      registerDto;

    try {
      
      const decryptedPassword = password;

      if (!decryptedPassword) {
        throw new Error('Failed to decrypt password');
      }

      const hashedPassword = await bcrypt.hash(decryptedPassword, 10);

      // Check if a user with the same mobile number already exists
      const existingUser = await this.userModel.findOne({ mobileNumber });
      if (existingUser) {
        throw new Error('Mobile number is already in use');
      }

      const newUser = new this.userModel({
        name,
        
        email,
        address,
        macAddresses,
        mobileNumber,
        password: hashedPassword,
        amountAvailable: 2000, // Default balance
        isLoggedIn: false, // Default flag
        isKYCVerified: false, // Default flag
      });

      await newUser.save();

      // Generate JWT access token
      const payload = {
        userId: newUser._id,
        mobileNumber: newUser.mobileNumber,
      };
      const accessToken = this.jwtService.sign(payload);

      // Save the accessToken in the database
      newUser.accessToken = accessToken;
      await newUser.save();

      return {
        message: 'User registered successfully',
        accessToken,
        userId: newUser._id,
      };
    } catch (error) {
      throw new Error(error.message || 'Registration failed');
    }
  }

  // Create OTP session
  async createOtpSession(user: any) {
    const otp = crypto.randomInt(100000, 999999).toString(); // Generate a 6-digit OTP
    user.otp = otp; // Store OTP in the user schema
    user.otpExpiresAt = Date.now() + 10 * 60 * 1000; // OTP expires in 10 minutes
    await user.save();
    return { otp }; // Return OTP for testing purposes (use in real-world app)
  }

  // Send OTP to email
  async sendOtpEmail(email: string, otp: string): Promise<void> {
    await this.mailerService.sendMail({
      to: email, // Recipient's email
      from: 'khelan05@gmail.com', // Sender's email
      subject: 'Password Reset OTP', // Email subject
      text: `Your OTP for password reset is: ${otp}`, // Plain text body
      html: `<p>Your OTP for password reset is: <strong>${otp}</strong></p>`, // HTML body
    });
  }

  // Verify OTP
  async verifyOtp(email: string, otp: string) {
    const user = await this.findUserByEmail(email);

    // Validate OTP and expiration
    if (!user || user.otp !== otp || user.otpExpiresAt < Date.now()) {
      return false;
    }

    // Set `verifiedOtp` flag to true after successful OTP verification
    user.verifiedOtp = true;
    await user.save();

    return true;
  }

  // Reset Password
  async resetPassword(email: string, newPassword: string) {
    const user = await this.findUserByEmail(email);

    // Check if the user exists and if `verifiedOtp` flag is true
    if (!user || !user.verifiedOtp) return false;

    // Hash the new password before saving
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user password and clear OTP-related fields
    user.password = hashedPassword;
    user.verifiedOtp = false; // Reset the flag
    user.otp = undefined;
    user.otpExpiresAt = undefined;

    await user.save();
    return true;
  }

  // Link Google account
  async linkGoogleAccount(user: any, googleUser: any) {
    user.googleId = googleUser.id;
    user.googleToken = googleUser.token;
    user.isGoogleUser = true;
    await user.save();
  }

  // Create a new user with Google login info
  async createUserWithGoogle(googleUser: any): Promise<User> {
    const newUser = new this.userModel({
      email: googleUser.email,
      googleId: googleUser.id,
      googleToken: googleUser.token,
      isGoogleUser: true,
    });
    return await newUser.save();
  }
}
