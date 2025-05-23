import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { User } from '../../users/entities/user.entity';
import { Post } from '../../posts/entities/post.entity';
import { ApiProperty } from '@nestjs/swagger';

export type CommentDocument = Comment & Document;

@Schema({ timestamps: true })
export class Comment {
  @ApiProperty({ description: 'User reference' })
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  user: User;

  @ApiProperty({ description: 'Post reference' })
  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Post', required: true })
  post: Post;

  @ApiProperty({ description: 'Comment content' })
  @Prop({ required: true })
  desc: string;
}

export const CommentSchema = SchemaFactory.createForClass(Comment);
