import { Test, TestingModule } from '@nestjs/testing';
import { DatabaseModule } from './database.module';
import { PlacesRepository } from './repositories/places.repository';
import { UsersRepository } from './repositories/users.repository';
import { PrismaService } from './prisma.service';

describe('DatabaseModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [DatabaseModule],
    }).compile();
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });

  it('should provide PlacesRepository', () => {
    const placesRepository = module.get<PlacesRepository>(PlacesRepository);
    expect(placesRepository).toBeDefined();
    expect(placesRepository).toBeInstanceOf(PlacesRepository);
  });

  it('should provide UsersRepository', () => {
    const usersRepository = module.get<UsersRepository>(UsersRepository);
    expect(usersRepository).toBeDefined();
    expect(usersRepository).toBeInstanceOf(UsersRepository);
  });

  it('should provide PrismaService', () => {
    const prismaService = module.get<PrismaService>(PrismaService);
    expect(prismaService).toBeDefined();
    expect(prismaService).toBeInstanceOf(PrismaService);
  });

  afterAll(async () => {
    await module.close();
  });
});
