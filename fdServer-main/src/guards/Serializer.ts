import { Inject, Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { User } from '../schemas/user.schema'; // Import the MongoDB User entity
import { AuthService } from '../services/auth.service';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authService: AuthService,
  ) {
    super();
  }

  serializeUser(user: User, done: Function) {

    // You can choose to serialize only the _id or any other necessary fields
    done(null, { id: user._id }); // Make sure to serialize the user with a unique identifier
  }

  async deserializeUser(payload: any, done: Function) {
    // Find the user by _id, which is the identifier for MongoDB
    const user = await this.authService.findUserByEmail(payload.id); // Find by _id in MongoDB


    // If user is found, pass the user object to done, otherwise pass null
    return user ? done(null, user) : done(null, null);
  }
}
