import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  UseGuards,
  Req,
} from '@nestjs/common';
import { CommentsService } from './comments.service';
import { ClerkAuthGuard } from '../auth/guards/clerk-auth.guard';
import { CreateCommentDto } from './dto/comment.dto';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiResponse, ApiParam } from '@nestjs/swagger';
import { Request } from 'express';

@ApiTags('api/comments')
@Controller('api/comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get(':postId')
  @ApiOperation({ summary: 'Get all comments for a post' })
  @ApiParam({ name: 'postId', description: 'Post ID' })
  @ApiResponse({ status: 200, description: 'Returns comments for the post' })
  async getPostComments(@Param('postId') postId: string) {
    return this.commentsService.findByPostId(postId);
  }

  @Post(':postId')
  @UseGuards(ClerkAuthGuard)
  @ApiOperation({ summary: 'Add a comment to a post' })
  @ApiBearerAuth('clerk-token')
  @ApiParam({ name: 'postId', description: 'Post ID' })
  @ApiResponse({ status: 201, description: 'Comment added successfully' })
  @ApiResponse({ status: 401, description: 'Not authenticated' })
  async addComment(
    @Param('postId') postId: string,
    @Body() createCommentDto: CreateCommentDto,
    @Req() req: Request,
  ) {
    return this.commentsService.create(createCommentDto, postId, req['auth'].userId);
  }

  @Delete(':id')
  @UseGuards(ClerkAuthGuard)
  @ApiOperation({ summary: 'Delete a comment' })
  @ApiBearerAuth('clerk-token')
  @ApiParam({ name: 'id', description: 'Comment ID' })
  @ApiResponse({ status: 200, description: 'Comment deleted successfully' })
  @ApiResponse({ status: 401, description: 'Not authenticated' })
  @ApiResponse({ status: 403, description: 'Forbidden - not your comment' })
  async deleteComment(@Param('id') id: string, @Req() req: Request) {
    return this.commentsService.remove(
      id,
      req['auth'].userId,
      req['auth'].sessionClaims?.metadata?.role,
    );
  }
}
