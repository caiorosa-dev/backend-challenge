import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { DatabaseModule } from 'src/shared/database/database.module';
import { JwtModule } from '@nestjs/jwt';
import { env } from 'src/shared/config/env';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        DatabaseModule,
        JwtModule.register({
          global: true,
          secret: env.jwtSecret,
          signOptions: { expiresIn: '14d' },
        }),
        DatabaseModule,
      ],
      providers: [AuthService, UsersService],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
