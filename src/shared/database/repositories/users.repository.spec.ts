import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma.service';
import { UsersRepository } from './users.repository';
import { prismaMock } from '../mocks/prisma-mock';

describe('UsersRepository', () => {
  let usersRepository: UsersRepository;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersRepository,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    usersRepository = module.get<UsersRepository>(UsersRepository);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const createDto = {
        data: {
          email: 'test@example.com',
          name: 'Test User',
          password: 'Test Password',
        },
      };

      await usersRepository.create(createDto);

      expect(prismaService.user.create).toHaveBeenCalledWith(createDto);
    });
  });

  describe('findByEmail', () => {
    it('should find a user by email', async () => {
      const email = 'test@example.com';

      await usersRepository.findByEmail(email);

      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email },
      });
    });
  });

  describe('findUnique', () => {
    it('should find a user using custom arguments', async () => {
      const customArgs = { where: { id: 1 } };

      await usersRepository.findUnique(customArgs);

      expect(prismaService.user.findUnique).toHaveBeenCalledWith(customArgs);
    });
  });
});
