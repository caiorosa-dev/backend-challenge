import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UsersRepository } from '../../shared/database/repositories/users.repository';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { SignInDto } from './dto/sign-in.dto';

import * as bcrypt from 'bcryptjs';

jest.mock('../../shared/database/repositories/users.repository');
jest.mock('@nestjs/jwt');

jest.mock('bcryptjs', () => ({
  compare: jest.fn(),
}));

describe('AuthService', () => {
  let authService: AuthService;
  let usersRepository: UsersRepository;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService, UsersRepository, JwtService],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    usersRepository = module.get<UsersRepository>(UsersRepository);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('authenticate', () => {
    it('should authenticate and return access token for valid credentials', async () => {
      const signInDto: SignInDto = {
        email: 'user@example.com',
        password: 'password123',
      };

      const mockUser = {
        id: 1,
        name: 'Test User',
        email: 'user@example.com',
        password: 'hashedPassword',
      };
      const mockAccessToken = 'mockAccessToken';

      jest
        .spyOn(usersRepository, 'findByEmail')
        .mockResolvedValueOnce(mockUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(true);
      jest
        .spyOn(authService, 'generateAccessToken')
        .mockResolvedValueOnce(mockAccessToken);

      const result = await authService.authenticate(signInDto);

      expect(usersRepository.findByEmail).toHaveBeenCalledWith(signInDto.email);
      expect(bcrypt.compare).toHaveBeenCalledWith(
        signInDto.password,
        mockUser.password,
      );
      expect(authService.generateAccessToken).toHaveBeenCalledWith(mockUser.id);
      expect(result).toEqual({ accessToken: mockAccessToken });
    });

    it('should throw UnauthorizedException for invalid email', async () => {
      const signInDto: SignInDto = {
        email: 'nonexistent@example.com',
        password: 'password123',
      };

      jest.spyOn(usersRepository, 'findByEmail').mockResolvedValueOnce(null);

      await expect(authService.authenticate(signInDto)).rejects.toThrowError(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException for invalid password', async () => {
      const signInDto: SignInDto = {
        email: 'user@example.com',
        password: 'invalidPassword',
      };

      const mockUser = {
        id: 1,
        email: 'user@example.com',
        password: 'hashedPassword',
        name: 'Test User',
      };

      jest
        .spyOn(usersRepository, 'findByEmail')
        .mockResolvedValueOnce(mockUser);
      jest.spyOn(bcrypt, 'compare').mockResolvedValueOnce(false);

      await expect(authService.authenticate(signInDto)).rejects.toThrowError(
        UnauthorizedException,
      );
    });
  });

  describe('generateAccessToken', () => {
    it('should generate and return an access token', async () => {
      const userId = 1;
      const mockAccessToken = 'mockAccessToken';

      jest
        .spyOn(jwtService, 'signAsync')
        .mockResolvedValueOnce(mockAccessToken);

      const result = await authService.generateAccessToken(userId);

      expect(jwtService.signAsync).toHaveBeenCalledWith({ sub: userId });
      expect(result).toEqual(mockAccessToken);
    });
  });
});
