import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post, PostDocument } from '../entities/post.entity';

@Injectable()
export class IncreaseVisitMiddleware implements NestMiddleware {
  constructor(
    @InjectModel(Post.name) private postModel: Model<PostDocument>,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const slug = req.params.slug;
    
    if (slug) {
      await this.postModel.findOneAndUpdate(
        { slug },
        { $inc: { visit: 1 } },
      ).exec();
    }
    
    next();
  }
}