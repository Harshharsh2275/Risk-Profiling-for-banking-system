import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Application extends Document {
  @Prop({ required: true })
  bountyId: string;

  @Prop({ required: true })
  creatorId: string;

  @Prop({ required: true })
  requestId: string;

  @Prop()
  proposedMoney?: string;

  @Prop()
  message?: string;
}

export const ApplicationSchema = SchemaFactory.createForClass(Application);
