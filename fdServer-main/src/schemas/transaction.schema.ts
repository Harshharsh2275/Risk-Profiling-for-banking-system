import { Schema, Document } from 'mongoose';

export interface TransactionBlock extends Document {
    timestamp: Date;
    transactions: Array<any>;
    previousHash: string;
    hash: string;
    validator: string;
    signature: string;
    nonce: number;
}

export interface Transaction {
    userId: string,
    recieverId: string,
    amount: number,
    userMacAdd: string,
    userLocation: any,
    recieverLocation: any,
}

export const TransactionSchema = new Schema<TransactionBlock>({
    timestamp: {type: Date, default: new Date()},
    transactions: {type: [], required: true},
    previousHash: {type: String, required: true},
    hash: {type: String, required: true},
    validator: {type: String, required: true},
    signature: {type: String, default: null},
    nonce: {type: Number, required: true},
});
