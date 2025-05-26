import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { PostsModule } from './posts/posts.module';
import { CommentsModule } from './comments/comments.module';
import { WebhookModule } from './webhook/webhook.module';
import { AuthMiddleware } from './auth/middlewares/auth.middleware';
import appConfig from './config/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',     // ← optional, defaults to '.env'
      load: [appConfig], 
    }),
    MongooseModule.forRoot(process.env.MONGO_CONNECTION_URL || ''),
    UsersModule,
    PostsModule,
    CommentsModule,
    WebhookModule,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude(
        { path: 'webhooks/(.*)', method: RequestMethod.ALL },
        { path: 'api/posts', method: RequestMethod.GET },
        { path: 'api/posts/:slug', method: RequestMethod.GET },
      )
      .forRoutes('*');
  }
}
