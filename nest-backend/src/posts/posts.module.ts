import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { Post, PostSchema } from './entities/post.entity';
import { UsersModule } from '../users/users.module';
import { IncreaseVisitMiddleware } from './middleware/increase-visit.middleware';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
    UsersModule,
  ],
  controllers: [PostsController],
  providers: [PostsService],
  exports: [PostsService],
})
export class PostsModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(IncreaseVisitMiddleware)
      .forRoutes({ path: 'posts/:slug', method: RequestMethod.GET });
  }
}