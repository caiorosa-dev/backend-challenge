import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma.service';
import { PlacesRepository } from './places.repository';
import { prismaMock } from '../mocks/prisma-mock';

describe('PlacesRepository', () => {
  let placesRepository: PlacesRepository;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlacesRepository,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    placesRepository = module.get<PlacesRepository>(PlacesRepository);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create a new place', async () => {
      const createDto = {
        name: 'Test Place',
        city: 'Test City',
        state: 'Test State',
      };

      await placesRepository.create(createDto);

      expect(prismaService.place.create).toHaveBeenCalledWith({
        data: createDto,
      });
    });
  });

  describe('update', () => {
    it('should update a place by ID', async () => {
      const id = 1;
      const updateDto = { name: 'Updated Place' };

      await placesRepository.update(id, updateDto);

      expect(prismaService.place.update).toHaveBeenCalledWith({
        data: updateDto,
        where: { id },
      });
    });
  });

  describe('findAll', () => {
    it('should return an array of places', async () => {
      await placesRepository.findAll();

      expect(prismaService.place.findMany).toHaveBeenCalled();
    });
  });

  describe('findByName', () => {
    it('should find places by name', async () => {
      const name = 'Test';

      await placesRepository.findByName(name);

      expect(prismaService.place.findMany).toHaveBeenCalledWith({
        where: { name: { contains: name, mode: 'insensitive' } },
      });
    });
  });

  describe('findById', () => {
    it('should find a place by ID', async () => {
      const id = 1;

      await placesRepository.findById(id);

      expect(prismaService.place.findUnique).toHaveBeenCalledWith({
        where: { id },
      });
    });
  });

  describe('delete', () => {
    it('should delete a place by ID', async () => {
      const id = 1;

      await placesRepository.delete(id);

      expect(prismaService.place.delete).toHaveBeenCalledWith({
        where: { id },
      });
    });
  });
});
