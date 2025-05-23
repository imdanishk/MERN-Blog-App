import { Module } from '@nestjs/common';
import { WebhookController } from './webhook.controller';
import { WebhookService } from './webhook.service';
import { UsersModule } from '../users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../users/entities/user.entity';
import { Post, PostSchema } from '../posts/entities/post.entity';
import { Comment, CommentSchema } from '../comments/entities/comment.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Post.name, schema: PostSchema },
      { name: Comment.name, schema: CommentSchema },
    ]),
    UsersModule,
  ],
  controllers: [WebhookController],
  providers: [WebhookService],
})
export class WebhookModule {}