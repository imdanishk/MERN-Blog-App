import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './entities/user.entity';
import { CreateUserDto } from './dto/user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const newUser = new this.userModel(createUserDto);
    return newUser.save();
  }

  async findByClerkId(clerkUserId: string): Promise<User> {
    const user = await this.userModel.findOne({ clerkUserId }).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async getUserSavedPosts(clerkUserId: string): Promise<string[]> {
    const user = await this.userModel.findOne({ clerkUserId }).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    
    return user.savedPosts;
  }

  async savePost(clerkUserId: string, postId: string): Promise<string> {
    const user = await this.userModel.findOne({ clerkUserId }).exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    
    const isSaved = user.savedPosts.includes(postId);
    
    if (isSaved) {
      await this.userModel.findByIdAndUpdate(
        user._id,
        { $pull: { savedPosts: postId } },
      ).exec();
      return 'Post unsaved';
    } else {
      await this.userModel.findByIdAndUpdate(
        user._id,
        { $push: { savedPosts: postId } },
      ).exec();
      return 'Post saved';
    }
  }

  async deleteUser(clerkUserId: string): Promise<User> {
    const deletedUser = await this.userModel.findOneAndDelete({ clerkUserId }).exec();
    if (!deletedUser) {
      throw new NotFoundException('User not found');
    }
    return deletedUser;
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.userModel.findOne({ username }).exec();
  }
}