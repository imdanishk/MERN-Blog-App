import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class ClerkAuthGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    if (!request.auth || !request.auth.userId) {
      throw new UnauthorizedException('Not authenticated!');
    }
    return true;
  }
}

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    
    if (!request.auth || !request.auth.userId) {
      throw new UnauthorizedException('Not authenticated!');
    }
    
    const role = request.auth.sessionClaims?.metadata?.role || 'user';
    
    if (role !== 'admin') {
      throw new UnauthorizedException('Admin access required!');
    }
    
    return true;
  }
}