import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type BaseDocument = BaseModel & Document;

@Schema()
export class BaseModel {
  @Prop()
  _id: Types.ObjectId;
}

// export BaseModel;
