import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePostDto {
  @ApiProperty({ description: 'Post title' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'Post image URL', required: false })
  @IsString()
  @IsOptional()
  img?: string;

  @ApiProperty({ description: 'Short description', required: false })
  @IsString()
  @IsOptional()
  desc?: string;

  @ApiProperty({ description: 'Post category', default: 'general' })
  @IsString()
  @IsOptional()
  category?: string;

  @ApiProperty({ description: 'Post content' })
  @IsString()
  content: string;
}

export class UpdatePostDto {
  @ApiProperty({ description: 'Post title', required: false })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiProperty({ description: 'Post image URL', required: false })
  @IsString()
  @IsOptional()
  img?: string;

  @ApiProperty({ description: 'Short description', required: false })
  @IsString()
  @IsOptional()
  desc?: string;

  @ApiProperty({ description: 'Post category', required: false })
  @IsString()
  @IsOptional()
  category?: string;

  @ApiProperty({ description: 'Post content', required: false })
  @IsString()
  @IsOptional()
  content?: string;
}

export class QueryPostDto {
  @ApiProperty({ description: 'Page number', required: false, default: 1 })
  @Type(() => Number)
  @IsOptional()
  page?: number = 1;

  @ApiProperty({ description: 'Items per page', required: false, default: 10 })
  @Type(() => Number)
  @IsOptional()
  limit?: number = 10;

  @ApiProperty({ description: 'Category filter', required: false })
  @IsString()
  @IsOptional()
  cat?: string;

  @ApiProperty({ description: 'Author username filter', required: false })
  @IsString()
  @IsOptional()
  author?: string;

  @ApiProperty({ description: 'Search query', required: false })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiProperty({ description: 'Sort order', required: false, enum: ['newest', 'oldest', 'popular', 'trending'] })
  @IsString()
  @IsOptional()
  sort?: 'newest' | 'oldest' | 'popular' | 'trending';

  @ApiProperty({ description: 'Filter by featured posts', required: false })
  @IsBoolean()
  @IsOptional()
  featured?: boolean;
}

export class FeaturePostDto {
  @ApiProperty({ description: 'Post ID to feature/unfeature' })
  @IsString()
  postId: string;
}
