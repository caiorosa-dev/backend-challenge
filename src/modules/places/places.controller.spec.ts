import { Test, TestingModule } from '@nestjs/testing';
import { prismaMock } from '../../shared/database/mocks/prisma-mock';
import { PlacesRepository } from '../../shared/database/repositories/places.repository';
import { CreatePlaceDto } from './dto/create-place.dto';
import { UpdatePlaceDto } from './dto/update-place.dto';
import { NotFoundException } from '@nestjs/common';
import { PlacesService } from './places.service';
import { PlacesController } from './places.controller';
import { PrismaService } from '../../shared/database/prisma.service';

describe('PlacesController', () => {
  let placesController: PlacesController;
  let placesService: PlacesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlacesController,
        PlacesService,
        PlacesRepository,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    placesService = module.get<PlacesService>(PlacesService);
    placesController = module.get<PlacesController>(PlacesController);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should be defined', () => {
    expect(placesController).toBeDefined();
  });

  describe('create', () => {
    it('should create a new place', async () => {
      const createPlaceDto: CreatePlaceDto = {
        name: 'Park',
        city: 'Cityville',
        state: 'Stateland',
      };

      const now = new Date();

      jest.spyOn(placesService, 'create').mockResolvedValueOnce({
        ...createPlaceDto,
        id: 1,
        createdAt: now,
        updatedAt: now,
      });

      const result = await placesController.create(createPlaceDto);

      expect(placesService.create).toHaveBeenCalledWith(createPlaceDto);
      expect(result).toEqual({
        ...createPlaceDto,
        id: 1,
        createdAt: now,
        updatedAt: now,
      });
    });
  });

  describe('findAll', () => {
    it('should return all places', async () => {
      jest.spyOn(placesService, 'findAll').mockResolvedValueOnce([]);

      const result = await placesController.findAll();

      expect(placesService.findAll).toHaveBeenCalled();
      expect(result).toEqual([]);
    });

    it('should return places by name when name is provided in query', async () => {
      const name = 'Park';
      jest.spyOn(placesService, 'findAllByName').mockResolvedValueOnce([]);

      const result = await placesController.findAll(name);

      expect(placesService.findAllByName).toHaveBeenCalledWith(name);
      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return a place by ID', async () => {
      const placeId = 1;
      const mockPlace = {
        id: placeId,
        name: 'Park',
        city: 'Cityville',
        state: 'Stateland',
      };

      const now = new Date();

      jest.spyOn(placesService, 'findOne').mockResolvedValueOnce({
        ...mockPlace,
        createdAt: now,
        updatedAt: now,
      });

      const result = await placesController.findOne(placeId);

      expect(placesService.findOne).toHaveBeenCalledWith(placeId);
      expect(result).toEqual({ ...mockPlace, createdAt: now, updatedAt: now });
    });
  });

  describe('update', () => {
    it('should update a place', async () => {
      const placeId = 1;
      const updatePlaceDto: UpdatePlaceDto = {
        name: 'Updated Park',
        city: 'Updated Cityville',
      };

      const now = new Date();

      const mockUpdatedPlace: any = {
        id: placeId,
        ...updatePlaceDto,
        createdAt: now,
        updatedAt: now,
      };
      jest
        .spyOn(placesService, 'update')
        .mockResolvedValueOnce(mockUpdatedPlace);

      const result = await placesController.update(placeId, updatePlaceDto);

      expect(placesService.update).toHaveBeenCalledWith(
        placeId,
        updatePlaceDto,
      );
      expect(result).toEqual(mockUpdatedPlace);
    });
  });

  describe('remove', () => {
    it('should remove a place', async () => {
      const placeId = 1;

      jest.spyOn(placesService, 'remove').mockResolvedValueOnce(undefined);

      const result = await placesController.remove(placeId);

      expect(placesService.remove).toHaveBeenCalledWith(placeId);
      expect(result).toBeUndefined();
    });

    it('should throw NotFoundException if place does not exist', async () => {
      const placeId = 1;
      jest
        .spyOn(placesService, 'remove')
        .mockRejectedValueOnce(new NotFoundException());

      await expect(placesController.remove(placeId)).rejects.toThrowError(
        NotFoundException,
      );
    });
  });
});
