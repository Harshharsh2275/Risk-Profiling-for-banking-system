import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
  CanActivate,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/services/user.service';
import { Response } from 'express';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    const tokenFromRequest = request.headers.authorization?.split(' ')[1];
    
    const userIdFromRequest = request.params.id;
    console.log(request.params);
    console.log("Line 1 : ", tokenFromRequest);
    
    if (!tokenFromRequest) {
      console.log("Line 2 : No token"); 
      throw new UnauthorizedException('Token is required');
    }
    
    try {
      // Decode and validate the token
      const decoded = this.jwtService.verify(tokenFromRequest);
      const userIdFromToken = decoded?.sub;
      console.log("line 2.5 : ", userIdFromToken);
      console.log("line 2.6 : ", userIdFromRequest);
      
      
      // Ensure the user ID from the token matches the one in the URL parameter
      if (userIdFromToken !== userIdFromRequest) {
        console.log("Line 3 : Not equal");
        throw new UnauthorizedException('Unauthorized');
      }

      // Fetch user from the database
      const user = await this.userService.findById(userIdFromToken);
      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      if (user.accessToken !== tokenFromRequest) {
        throw new UnauthorizedException('Token mismatch');
      }

      // Generate a new token
      const newToken = await this.jwtService.signAsync({
        sub: userIdFromToken,
      });

      // Optionally, save the new token to the user's record
      await this.userService.updateAccessToken(userIdFromToken, newToken);

      // Attach the new token to the request object (not sending yet)
      request.newAccessToken = newToken;
      console.log('log:', request.newAccessToken);

      // Proceed to the controller method
      return true;
    } catch (error) {
      console.error('Error verifying token or processing request:', error);
      throw new UnauthorizedException('Token verification failed');
    }
  }
}
