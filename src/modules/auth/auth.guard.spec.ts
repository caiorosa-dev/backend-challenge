import { Test, TestingModule } from '@nestjs/testing';
import { AuthGuard } from './auth.guard';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let jwtService: JwtService;
  let reflector: Reflector;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthGuard, JwtService, Reflector],
    }).compile();

    guard = module.get<AuthGuard>(AuthGuard);
    jwtService = module.get<JwtService>(JwtService);
    reflector = module.get<Reflector>(Reflector);
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  describe('canActivate', () => {
    it('should return true for a public route', async () => {
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(true);

      const context = createContext();
      const result = await guard.canActivate(context);

      expect(result).toBe(true);
      expect(reflector.getAllAndOverride).toHaveBeenCalledWith('IS_PUBLIC', [
        context.getClass(),
        context.getHandler(),
      ]);
    });

    it('should throw UnauthorizedException for missing token', async () => {
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(false);

      const context = createContext();
      const resultPromise = guard.canActivate(context);

      await expect(resultPromise).rejects.toThrowError(UnauthorizedException);
    });

    it('should throw UnauthorizedException for invalid token', async () => {
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(false);
      jest.spyOn(jwtService, 'verifyAsync').mockRejectedValueOnce(new Error());

      const context = createContext();
      const resultPromise = guard.canActivate(context);

      await expect(resultPromise).rejects.toThrowError(UnauthorizedException);
    });

    it('should set userId in request for a valid token', async () => {
      jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(false);
      jest.spyOn(jwtService, 'verifyAsync').mockResolvedValueOnce({ sub: 1 });

      const context = createContext();
      await guard.canActivate(context);

      expect(context.switchToHttp().getRequest()['userId']).toBe(1);
    });
  });

  function createContext(): ExecutionContext {
    return {
      switchToHttp: () => ({
        getRequest: () => ({
          headers: {
            authorization: 'Bearer valid-token',
          },
          userId: 1,
        }),
      }),
      getClass: jest.fn(),
      getHandler: jest.fn(),
    } as any;
  }
});
