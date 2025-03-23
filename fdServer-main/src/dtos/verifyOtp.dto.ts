export class VerifyOtpDto {
  email: string;  // The email address of the user
  otp: string;    // The OTP entered by the user
}

export class ResetPasswordDto {
  email: string;       // The email address of the user
  newPassword: string; // The new password the user wants to set
}

export class LoginDto {
  email: string;  // The user's email address
  password: string; // The user's password
}

export class RegisterDto {
  email: string;  // The user's email address
  password: string; // The user's password
}
