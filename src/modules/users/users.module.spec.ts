import { Test, TestingModule } from '@nestjs/testing';
import { UsersModule } from './users.module';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { DatabaseModule } from '../../shared/database/database.module';

describe('UsersModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [UsersModule, DatabaseModule],
    }).compile();
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });

  it('should provide UsersController', () => {
    const controller = module.get<UsersController>(UsersController);
    expect(controller).toBeDefined();
    expect(controller).toBeInstanceOf(UsersController);
  });

  it('should provide UsersService', () => {
    const service = module.get<UsersService>(UsersService);
    expect(service).toBeDefined();
    expect(service).toBeInstanceOf(UsersService);
  });

  afterAll(async () => {
    await module.close();
  });
});
