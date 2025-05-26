import {
  Controller,
  Get,
  Post,
  Delete,
  Patch,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { ClerkAuthGuard, AdminGuard } from '../auth/guards/clerk-auth.guard';
import { CreatePostDto, QueryPostDto, FeaturePostDto } from './dto/post.dto';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { Request } from 'express';

@ApiTags('api/posts')
@Controller('api/posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all posts with pagination and filters' })
  @ApiResponse({ status: 200, description: 'Returns posts and pagination info' })
  async getPosts(@Query() queryPostDto: QueryPostDto) {
    return this.postsService.findAll(queryPostDto);
  }

  @Get(':slug')
  @ApiOperation({ summary: 'Get post by slug' })
  @ApiParam({ name: 'slug', description: 'Post slug' })
  @ApiResponse({ status: 200, description: 'Returns post data' })
  @ApiResponse({ status: 404, description: 'Post not found' })
  async getPost(@Param('slug') slug: string) {
    return this.postsService.findBySlug(slug);
  }

  @Post('create')
  @UseGuards(ClerkAuthGuard)
  @ApiOperation({ summary: 'Create a new post' })
  @ApiBearerAuth('clerk-token')
  @ApiResponse({ status: 201, description: 'Post created successfully' })
  @ApiResponse({ status: 401, description: 'Not authenticated' })
  async createPost(@Body() createPostDto: CreatePostDto, @Req() req: Request) {
    return this.postsService.create(createPostDto, req['auth'].userId);
  }

  @Delete(':id')
  @UseGuards(ClerkAuthGuard)
  @ApiOperation({ summary: 'Delete a post' })
  @ApiBearerAuth('clerk-token')
  @ApiParam({ name: 'id', description: 'Post ID' })
  @ApiResponse({ status: 200, description: 'Post deleted successfully' })
  @ApiResponse({ status: 401, description: 'Not authenticated' })
  @ApiResponse({ status: 403, description: 'Forbidden - not your post' })
  async deletePost(@Param('id') id: string, @Req() req: Request) {
    return this.postsService.remove(id, req['auth'].userId, req['auth'].sessionClaims?.metadata?.role);
  }

  @Patch('feature')
  @UseGuards(ClerkAuthGuard, AdminGuard)
  @ApiOperation({ summary: 'Feature or unfeature a post (admin only)' })
  @ApiBearerAuth('clerk-token')
  @ApiResponse({ status: 200, description: 'Post featured/unfeatured status updated' })
  @ApiResponse({ status: 401, description: 'Not authenticated' })
  @ApiResponse({ status: 403, description: 'Forbidden - admin only' })
  async featurePost(@Body() featurePostDto: FeaturePostDto) {
    return this.postsService.featurePost(featurePostDto.postId);
  }

  @Get('upload-auth')
  @UseGuards(ClerkAuthGuard)
  @ApiOperation({ summary: 'Get ImageKit authentication parameters' })
  @ApiBearerAuth('clerk-token')
  @ApiResponse({ status: 200, description: 'Authentication parameters returned' })
  @ApiResponse({ status: 401, description: 'Not authenticated' })
  async getUploadAuth() {
    return this.postsService.getImageKitAuthParams();
  }
}