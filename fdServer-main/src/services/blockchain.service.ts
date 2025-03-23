import { Body, Injectable, InternalServerErrorException, Post } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../schemas/user.schema'; // Assuming you have a User schema
import { Transaction, TransactionBlock } from 'src/schemas/transaction.schema';

import Blockchain from 'src/Blockchain';

export const chain = new Blockchain();

@Injectable()
export class BlockchainService {
  jwtService: any;
  constructor(@InjectModel('User') private readonly userModel: Model<User>, @InjectModel('TransactionBlock') private readonly transactionModel: Model<TransactionBlock>) {}


  async processTransaction(txn: Transaction) {
    try {
        const txnBlock = chain.addBlock(txn);
        console.log(chain);
        const result = this.transactionModel.create(txnBlock);
        if(result) {
            const user = await this.userModel.findById(txn.userId);
            console.log(user);
            
            
            user.amountAvailable -= txn.amount;
            user.save();
            
            // reciever update 
            const reciever = await this.userModel.findById(txn.recieverId);
            reciever.amountAvailable += txn.amount;
            console.log(reciever);
            reciever.save();
            return result;
        }
        return "Unable to fullfill the transaction at the moment";
    } catch (error) {
        return new InternalServerErrorException(error.msg);
    }
  }

  async updateFraud(txn: Transaction) {
    try {
        const txnBlock = chain.addBlock(txn);
        console.log(chain);
        const result = this.transactionModel.create(txnBlock);
        if(result) {
            const user = await this.userModel.findById(txn.userId);
            user.amountAvailable -= txn.amount;
            user.fraudCount += 1;
            user.save();
            return result;
        }
        return "Unable to fullfill the transaction at the moment";
    } catch (error) {
        return new InternalServerErrorException(error.msg);
    }
  }

  

  // Method to verify the token and return the user if valid
  async verifyAndGetUser(token: string): Promise<User | null> {
    // If you need to verify the token or perform custom validation logic
    // You can implement it here, like decoding the token or using a JWT service
    // If the token is valid, you can return the user
    // Assuming token contains the user ID in the 'sub' field

    const decoded = this.decodeJwt(token);
    if (!decoded?.sub) {
      return null;
    }

    return this.userModel.findById(decoded.sub);
  }

  // Helper method to decode the JWT token
  private decodeJwt(token: string): any {
    try {
      return this.jwtService.decode(token); // Decode the JWT token (Ensure JwtService is injected)
    } catch (error) {
      return null;
    }
  }
}
