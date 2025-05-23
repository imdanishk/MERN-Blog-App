import { Injectable, BadRequestException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from '../users/entities/user.entity';
import { Post, PostDocument } from '../posts/entities/post.entity';
import { Comment, CommentDocument } from '../comments/entities/comment.entity';
import { Webhook } from 'svix';

@Injectable()
export class WebhookService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
    private configService: ConfigService,
  ) {}

  async handleClerkWebhook(payload: Buffer, headers: any): Promise<{ message: string }> {
    const webhookSecret = this.configService.get<string>('clerk.webhookSecret');

    if (!webhookSecret) {
      throw new BadRequestException('Webhook secret not configured!');
    }

    const wh = new Webhook(webhookSecret);
    let evt: any;

    try {
      evt = wh.verify(payload, headers);
    } catch (err) {
      throw new BadRequestException('Webhook verification failed!');
    }

    switch (evt.type) {
      case 'user.created':
        await this.handleUserCreated(evt.data);
        break;

      case 'user.deleted':
        await this.handleUserDeleted(evt.data);
        break;

      default:
        // Ignore other event types
        break;
    }

    return { message: 'Webhook received' };
  }

  private async handleUserCreated(data: any): Promise<void> {
    const newUser = new this.userModel({
      clerkUserId: data.id,
      username: data.username || data.email_addresses[0].email_address,
      email: data.email_addresses[0].email_address,
      img: data.profile_img_url,
    });

    await newUser.save();
  }

  private async handleUserDeleted(data: any): Promise<void> {
    const deletedUser = await this.userModel.findOneAndDelete({
      clerkUserId: data.id,
    }).exec();

    if (deletedUser) {
      // Delete all posts by this user
      const deletedPosts = await this.postModel.find({ user: deletedUser._id }).exec();
      await this.postModel.deleteMany({ user: deletedUser._id }).exec();

      // Delete all comments by this user
      await this.commentModel.deleteMany({ user: deletedUser._id }).exec();

      // Delete all comments on the user's posts
      for (const post of deletedPosts) {
        await this.commentModel.deleteMany({ post: post._id }).exec();
      }
    }
  }
}