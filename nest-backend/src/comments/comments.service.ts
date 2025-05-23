import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Comment, CommentDocument } from './entities/comment.entity';
import { UsersService } from '../users/users.service';
import { CreateCommentDto } from './dto/comment.dto';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment.name) private commentModel: Model<CommentDocument>,
    private usersService: UsersService,
  ) {}

  async findByPostId(postId: string): Promise<Comment[]> {
    return this.commentModel.find({ post: postId })
      .populate('user', 'username img')
      .sort({ createdAt: -1 })
      .exec();
  }

  async create(
    createCommentDto: CreateCommentDto,
    postId: string,
    clerkUserId: string,
  ): Promise<Comment> {
    const user = await this.usersService.findByClerkId(clerkUserId);
    
    const newComment = new this.commentModel({
      ...createCommentDto,
      user: user.clerkUserId,
      post: postId,
    });
    
    return newComment.save();
  }

  async remove(id: string, clerkUserId: string, role?: string): Promise<string> {
    if (role === 'admin') {
      const result = await this.commentModel.findByIdAndDelete(id).exec();
      
      if (!result) {
        throw new NotFoundException('Comment not found');
      }
      
      return 'Comment has been deleted';
    }
    
    const user = await this.usersService.findByClerkId(clerkUserId);
    
    const deletedComment = await this.commentModel.findOneAndDelete({
      _id: id,
      user: user.clerkUserId,
    }).exec();
    
    if (!deletedComment) {
      throw new ForbiddenException('You can delete only your comment!');
    }
    
    return 'Comment deleted';
  }

  async deleteCommentsByUserId(userId: string): Promise<void> {
    await this.commentModel.deleteMany({ user: userId }).exec();
  }

  async deleteCommentsByPostId(postId: string): Promise<void> {
    await this.commentModel.deleteMany({ post: postId }).exec();
  }
}