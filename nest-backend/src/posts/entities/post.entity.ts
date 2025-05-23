import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from '../../users/entities/user.entity';
import { ApiProperty } from '@nestjs/swagger';

export type PostDocument = Post & Document;

@Schema({ timestamps: true })
export class Post {
  @ApiProperty({ description: 'User reference' })
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  user: User;

  @ApiProperty({ description: 'Post image URL' })
  @Prop()
  img?: string;

  @ApiProperty({ description: 'Post title' })
  @Prop({ required: true })
  title: string;

  @ApiProperty({ description: 'Post slug' })
  @Prop({ required: true, unique: true })
  slug: string;

  @ApiProperty({ description: 'Short description' })
  @Prop()
  desc?: string;

  @ApiProperty({ description: 'Post category' })
  @Prop({ default: 'general' })
  category: string;

  @ApiProperty({ description: 'Post content' })
  @Prop({ required: true })
  content: string;

  @ApiProperty({ description: 'Featured post flag' })
  @Prop({ default: false })
  isFeatured: boolean;

  @ApiProperty({ description: 'Visit counter' })
  @Prop({ default: 0 })
  visit: number;
}

export const PostSchema = SchemaFactory.createForClass(Post);