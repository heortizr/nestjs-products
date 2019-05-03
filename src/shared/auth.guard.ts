import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();

    if (req) {
      const { authorization } = req.headers;
      if (!authorization) return false;
      req.user = await this.validateToken(authorization);
    }

    return true;
  }

  validateToken(auth: string) {
    if (auth.split(' ')[0] !== 'Bearer') {
      throw new UnauthorizedException('Invalid token');
    }
    const token = auth.split(' ')[1];

    try {
      return jwt.verify(token, process.env.SECRET);
    } catch (err) {
      const message = 'Token error: ' + (err.message || err.name);
      throw new UnauthorizedException(message);
    }
  }
}
