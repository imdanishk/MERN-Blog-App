import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, IsOptional, IsArray } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ description: 'Clerk user ID' })
  @IsString()
  clerkUserId: string;

  @ApiProperty({ description: 'Username' })
  @IsString()
  username: string;

  @ApiProperty({ description: 'Email address' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Profile image URL', required: false })
  @IsString()
  @IsOptional()
  img?: string;
}

export class SavePostDto {
  @ApiProperty({ description: 'Post ID to save/unsave' })
  @IsString()
  postId: string;
}