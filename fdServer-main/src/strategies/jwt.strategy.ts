import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
// Make sure you have UserService that interacts with your user model
// Define the JwtPayload interface
import { AuthService } from 'src/services/auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly userService: AuthService, // Inject UserService to get user details
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Extract JWT from Authorization header
      ignoreExpiration: false, // Ensure expiration is checked
      secretOrKey: process.env.JWT_SECRET || 'secretKey', // Use environment variable for the secret key
    });
  }

  // Validate the JWT and fetch user from the database
  async validate(payload: any) {
    // You can replace the next line with your logic to fetch the user from your database
    const user = await this.userService.findUserByEmail(payload.sub);

    if (!user) {
      throw new Error('User not found'); // Handle user not found (you can also throw a custom exception)
    }

    return { userId: user._id, email: user.email }; // Return the user details that will be added to the request object
  }
}
