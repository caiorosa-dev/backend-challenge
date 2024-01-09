import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ConflictException } from '@nestjs/common';
import { PrismaService } from '../../shared/database/prisma.service';
import { UsersRepository } from '../../shared/database/repositories/users.repository';
import { prismaMock } from '../../shared/database/mocks/prisma-mock';
import * as bcrypt from 'bcryptjs';

jest.mock('bcryptjs', () => ({
  hash: jest.fn(),
}));

describe('UsersService', () => {
  let usersService: UsersService;
  let usersRepository: UsersRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        UsersRepository,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    usersService = module.get<UsersService>(UsersService);
    usersRepository = module.get<UsersRepository>(UsersRepository);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should be defined', () => {
    expect(usersService).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const createUserDto: CreateUserDto = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      };

      jest.spyOn(usersRepository, 'findByEmail').mockResolvedValueOnce(null);
      jest.spyOn(bcrypt, 'hash').mockResolvedValueOnce('hashedPassword123');
      jest
        .spyOn(usersRepository, 'create')
        .mockResolvedValueOnce({ id: 1, ...createUserDto });

      const result = await usersService.create(createUserDto);

      expect(usersRepository.findByEmail).toHaveBeenCalledWith(
        createUserDto.email,
      );
      expect(bcrypt.hash).toHaveBeenCalledWith(createUserDto.password, 12);
      expect(usersRepository.create).toHaveBeenCalledWith({
        data: {
          name: createUserDto.name,
          email: createUserDto.email,
          password: 'hashedPassword123',
        },
      });
      expect(result).toEqual({ id: 1, ...createUserDto });
    });

    it('should throw a ConflictException if the email is already taken', async () => {
      const createUserDto: CreateUserDto = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      };

      jest
        .spyOn(usersRepository, 'findByEmail')
        .mockResolvedValueOnce({ id: 2, ...createUserDto });

      await expect(usersService.create(createUserDto)).rejects.toThrowError(
        ConflictException,
      );
    });
  });

  describe('findOne', () => {
    it('should find a user by ID', async () => {
      const userId = 1;
      const userData = {
        id: userId,
        name: 'Test User',
        email: 'test@example.com',
        password: 'test',
      };

      jest.spyOn(usersRepository, 'findUnique').mockResolvedValueOnce(userData);

      const result = await usersService.findOne(userId);

      expect(usersRepository.findUnique).toHaveBeenCalledWith({
        where: { id: userId },
        select: { id: true, email: true, name: true },
      });
      expect(result).toEqual(userData);
    });
  });
});
