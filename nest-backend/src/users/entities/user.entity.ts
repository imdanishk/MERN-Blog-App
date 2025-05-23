import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';

export type UserDocument = User & Document;

@Schema({ timestamps: true })
export class User {
  @ApiProperty({ description: 'Clerk user ID' })
  @Prop({ required: true, unique: true })
  clerkUserId: string;

  @ApiProperty({ description: 'Username' })
  @Prop({ required: true, unique: true })
  username: string;

  @ApiProperty({ description: 'Email address' })
  @Prop({ required: true, unique: true })
  email: string;

  @ApiProperty({ description: 'Profile image URL' })
  @Prop()
  img?: string;

  @ApiProperty({ description: 'List of saved post IDs' })
  @Prop({ type: [String], default: [] })
  savedPosts: string[];
}

export const UserSchema = SchemaFactory.createForClass(User);
