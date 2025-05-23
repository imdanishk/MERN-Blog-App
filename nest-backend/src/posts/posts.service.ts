import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post, PostDocument } from './entities/post.entity';
import { UsersService } from '../users/users.service';
import { CreatePostDto, QueryPostDto } from './dto/post.dto';
import { ConfigService } from '@nestjs/config';
import ImageKit from 'imagekit';

@Injectable()
export class PostsService {
  private imagekit: ImageKit;

  constructor(
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
    private usersService: UsersService,
    private configService: ConfigService,
  ) {
    this.imagekit = new ImageKit({
      urlEndpoint: this.configService.get<string>('imageKit.urlEndpoint') || '',
      publicKey: this.configService.get<string>('imageKit.publicKey') || '',
      privateKey: this.configService.get<string>('imageKit.privateKey') || '',
    });

    if (!this.configService.get<string>('imageKit.urlEndpoint') || !this.configService.get<string>('imageKit.publicKey') || !this.configService.get<string>('imageKit.privateKey')) {
      throw new Error('ImageKit configuration not found!');
    }
  }

  async findAll(queryParams: QueryPostDto): Promise<{ posts: Post[]; hasMore: boolean }> {
    const { page = 1, limit = 10, cat, author, search, sort, featured } = queryParams;
    
    const query: any = {};
    
    if (cat) {
      query.category = cat;
    }
    
    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }
    
    if (author) {
      const user = await this.usersService.findByUsername(author);
      if (user) {
        query.user = user.clerkUserId;
      } else {
        return { posts: [], hasMore: false };
      }
    }
    
    let sortObj: any = { createdAt: -1 };
    
    if (sort) {
      switch (sort) {
        case 'newest':
          sortObj = { createdAt: -1 };
          break;
        case 'oldest':
          sortObj = { createdAt: 1 };
          break;
        case 'popular':
          sortObj = { visit: -1 };
          break;
        case 'trending':
          sortObj = { visit: -1 };
          query.createdAt = {
            $gte: new Date(new Date().getTime() - 7 * 24 * 60 * 60 * 1000),
          };
          break;
      }
    }
    
    if (featured) {
      query.isFeatured = true;
    }
    
    const posts = await this.postModel.find(query)
      .populate('user', 'username')
      .sort(sortObj)
      .limit(limit)
      .skip((page - 1) * limit)
      .exec();
    
    const totalPosts = await this.postModel.countDocuments(query).exec();
    const hasMore = page * limit < totalPosts;
    
    return { posts, hasMore };
  }

  async findBySlug(slug: string): Promise<Post> {
    const post = await this.postModel.findOne({ slug })
      .populate('user', 'username')
      .exec();
    
    if (!post) {
      throw new NotFoundException('Post not found');
    }
    
    return post;
  }

  async create(createPostDto: CreatePostDto, clerkUserId: string): Promise<Post> {
    const user = await this.usersService.findByClerkId(clerkUserId);
    
    let slug = this.createSlug(createPostDto.title);
    
    // Check if slug exists and make it unique
    let existingPost = await this.postModel.findOne({ slug }).exec();
    let counter = 2;
    
    while (existingPost) {
      slug = `${slug}-${counter}`;
      existingPost = await this.postModel.findOne({ slug }).exec();
      counter++;
    }
    
    const newPost = new this.postModel({
      user: user.clerkUserId,
      slug,
      ...createPostDto,
    });
    
    return newPost.save();
  }

  async remove(id: string, clerkUserId: string, role?: string): Promise<string> {
    if (role === 'admin') {
      const result = await this.postModel.findByIdAndDelete(id).exec();
      
      if (!result) {
        throw new NotFoundException('Post not found');
      }
      
      return 'Post has been deleted';
    }
    
    const user = await this.usersService.findByClerkId(clerkUserId);
    
    const post = await this.postModel.findOne({
      _id: id,
      user: user.clerkUserId,
    }).exec();
    
    if (!post) {
      throw new ForbiddenException('You can delete only your posts!');
    }
    
    await this.postModel.findByIdAndDelete(id).exec();
    
    return 'Post has been deleted';
  }

  async featurePost(postId: string): Promise<Post> {
    const post = await this.postModel.findById(postId).exec();
    
    if (!post) {
      throw new NotFoundException('Post not found!');
    }
    
    const updatedPost = await this.postModel.findByIdAndUpdate(
      postId,
      { isFeatured: !post.isFeatured },
      { new: true },
    ).exec();
    
    if (!updatedPost) {
      throw new NotFoundException('Post not found!');
    }
    
    return updatedPost;
  }

  getImageKitAuthParams() {
    return this.imagekit.getAuthenticationParameters();
  }

  private createSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-')     // Replace spaces with hyphens
      .replace(/-+/g, '-');     // Remove consecutive hyphens
  }
}
