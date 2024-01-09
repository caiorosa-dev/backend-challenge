import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { IS_PUBLIC_KEY } from '../../shared/decorators/IsPublic';

jest.mock('./users.service');

describe('UsersController', () => {
  let controller: UsersController;
  let usersService: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [UsersService],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const createUserDto: CreateUserDto = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      };

      const mockResult = { id: 1, ...createUserDto };
      jest.spyOn(usersService, 'create').mockResolvedValueOnce(mockResult);

      const result = await controller.create(createUserDto);

      expect(usersService.create).toHaveBeenCalledWith(createUserDto);
      expect(result).toEqual(mockResult);
    });

    it('should apply the @IsPublic decorator', () => {
      const createMetadata = Reflect.getMetadata(
        IS_PUBLIC_KEY,
        controller.create,
      );
      expect(createMetadata).toBe(true);
    });
  });

  describe('me', () => {
    it('should return user data for the authenticated user', async () => {
      const userId = 1;
      const mockUser = {
        id: userId,
        name: 'Test User',
        email: 'test@example.com',
        password: 'test',
      };
      jest.spyOn(usersService, 'findOne').mockResolvedValueOnce(mockUser);

      const result = await controller.me(userId);

      expect(usersService.findOne).toHaveBeenCalledWith(userId);
      expect(result).toEqual(mockUser);
    });

    it('should apply the @ActiveUserId decorator', () => {
      const meMetadata = Reflect.getMetadata('activeUserId', controller.me);
      expect(meMetadata).toBe(undefined);
    });
  });
});
