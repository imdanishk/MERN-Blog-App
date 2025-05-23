import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import * as clerk from '@clerk/clerk-sdk-node';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  private readonly clerkSecretKey: string;
  private readonly clerkIssuer: string;
  constructor(private readonly configService: ConfigService) {
    const clerkSecretKey = this.configService.get<string>('clerk.clerkSecretKey');
    const clerkIssuer = this.configService.get<string>('clerk.clerkFrontendUrl');

    if (!clerkSecretKey || !clerkIssuer) {
      throw new Error('Clerk secret key or issuer not configured!');
    }
    
  }

  async use(req: Request, res: Response, next: NextFunction) {
    try {
      const authHeader = req.headers.authorization;
      
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        req['auth'] = null;
        return next();
      }
      
      const token = authHeader.split(' ')[1];
      const sessionClaims = await clerk.verifyToken(token, {
        secretKey: this.clerkSecretKey,
        issuer: this.clerkIssuer,
      });
      
      req['auth'] = {
        userId: sessionClaims.sub,
        sessionClaims,
      };
      
      next();
    } catch (error) {
      req['auth'] = null;
      next();
    }
  }
}
