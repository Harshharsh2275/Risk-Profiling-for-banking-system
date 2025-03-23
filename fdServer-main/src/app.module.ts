import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { User, UserSchema } from './schemas/user.schema';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';
import { GoogleStrategy } from './strategies/google.strategy';
import { MailerModule } from '@nestjs-modules/mailer';
import { SessionSerializer } from './guards/Serializer';
import { UserService } from './services/user.service';
import { ConfigModule } from '@nestjs/config';
import { BlockchainService } from './services/blockchain.service';
import { TransactionSchema } from './schemas/transaction.schema';



@Module({
  imports: [ 
    MongooseModule.forRoot(
      'mongodb+srv://Khelan05:KrxRwjRwkhgYUdwh@cluster0.c6y9phd.mongodb.net/fd1?retryWrites=true&w=majority',
    ),
    ConfigModule.forRoot({ isGlobal: true }),
    MailerModule.forRoot({
      transport: {
        service: 'gmail', // Gmail SMTP server address
        auth: {
          user: 'bountyhunter20xx@gmail.com', // Sender's Gmail email address
          pass: 'lwwo kkeu tmft womi', // Sender's Gmail app password
        },
        tls: {
          rejectUnauthorized: false, // Bypass SSL verification
        },
      },
    }),
    MongooseModule.forFeature([{ name: 'User', schema: UserSchema }, {name: 'TransactionBlock', schema: TransactionSchema}]),
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'your_jwt_secret', // Use environment variables for production
      signOptions: { expiresIn: '30d' },
    }),
    
    
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    UserService,
    JwtStrategy,
    BlockchainService,
    SessionSerializer,
    {
      provide: 'AUTH_SERVICE',
      useClass: AuthService,
    },
  ],
})
export class AppModule {}
