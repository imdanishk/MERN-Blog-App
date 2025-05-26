import { Controller, Get, Patch, Body, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { ClerkAuthGuard } from '../auth/guards/clerk-auth.guard';
import { SavePostDto } from './dto/user.dto';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { User } from './entities/user.entity';
import { Req } from '@nestjs/common';
import { Request } from 'express';

@ApiTags('api/users')
@Controller('api/users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('saved')
  @UseGuards(ClerkAuthGuard)
  @ApiOperation({ summary: 'Get saved posts for authenticated user' })
  @ApiBearerAuth('clerk-token')
  @ApiResponse({ status: 200, description: 'Returns list of saved post IDs' })
  @ApiResponse({ status: 401, description: 'Not authenticated' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getUserSavedPosts(@Req() req: Request) {
    return this.usersService.getUserSavedPosts(req['auth'].userId);
  }

  @Patch('save')
  @UseGuards(ClerkAuthGuard)
  @ApiOperation({ summary: 'Save or unsave a post' })
  @ApiBearerAuth('clerk-token')
  @ApiResponse({ status: 200, description: 'Post saved or unsaved' })
  @ApiResponse({ status: 401, description: 'Not authenticated' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async savePost(@Body() savePostDto: SavePostDto, @Req() req: Request) {
    return this.usersService.savePost(req['auth'].userId, savePostDto.postId);
  }
}