import { Test, TestingModule } from '@nestjs/testing';
import { PlacesService } from './places.service';
import { PlacesRepository } from '../../shared/database/repositories/places.repository';
import { PrismaService } from '../../shared/database/prisma.service';
import {
  mockedValues,
  prismaMock,
} from '../../shared/database/mocks/prisma-mock';
import { CreatePlaceDto } from './dto/create-place.dto';
import { NotFoundException } from '@nestjs/common';

describe('PlacesService', () => {
  let placesService: PlacesService;
  let placesRepository: PlacesRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PlacesService,
        PlacesRepository,
        { provide: PrismaService, useValue: prismaMock },
      ],
    }).compile();

    placesService = module.get<PlacesService>(PlacesService);
    placesRepository = module.get<PlacesRepository>(PlacesRepository);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should be defined', () => {
    expect(placesService).toBeDefined();
  });

  describe('create', () => {
    it('should create a new place', async () => {
      const createPlaceDto: CreatePlaceDto = {
        name: 'Park',
        city: 'Cityville',
        state: 'Stateland',
      };

      const now = new Date();

      jest.spyOn(placesRepository, 'create').mockResolvedValueOnce({
        id: 1,
        ...createPlaceDto,
        createdAt: now,
        updatedAt: now,
      });

      const result = await placesService.create(createPlaceDto);

      expect(placesRepository.create).toHaveBeenCalledWith(createPlaceDto);
      expect(result).toEqual({
        id: 1,
        ...createPlaceDto,
        createdAt: now,
        updatedAt: now,
      });
    });
  });

  describe('findAll', () => {
    it('should return all places', async () => {
      jest
        .spyOn(placesRepository, 'findAll')
        .mockResolvedValueOnce(mockedValues.places);

      const result = await placesService.findAll();

      expect(placesRepository.findAll).toHaveBeenCalled();
      expect(result).toEqual(mockedValues.places);
    });
  });

  describe('findAllByName', () => {
    it('should return places by name', async () => {
      const name = 'Park';

      jest
        .spyOn(placesRepository, 'findByName')
        .mockResolvedValueOnce(mockedValues.places);

      const result = await placesService.findAllByName(name);

      expect(placesRepository.findByName).toHaveBeenCalledWith(name);
      expect(result).toEqual(mockedValues.places);
    });
  });

  describe('findOne', () => {
    it('should return a place by ID', async () => {
      const placeId = 1;

      jest
        .spyOn(placesRepository, 'findById')
        .mockResolvedValueOnce(mockedValues.places[0]);

      const result = await placesService.findOne(placeId);

      expect(placesRepository.findById).toHaveBeenCalledWith(placeId);
      expect(result).toEqual(mockedValues.places[0]);
    });
  });

  describe('update', () => {
    it('should update a place', async () => {
      const placeId = 1;
      const updatePlaceDto: any = {
        name: 'Updated Park',
        city: 'Updated Cityville',
      };

      const now = new Date();

      const mockExistPlace = {
        id: placeId,
        name: 'Park',
        city: 'Cityville',
        state: 'Stateland',
        createdAt: now,
        updatedAt: now,
      };
      jest
        .spyOn(placesRepository, 'findById')
        .mockResolvedValueOnce(mockExistPlace);
      jest.spyOn(placesRepository, 'update').mockResolvedValueOnce({
        id: placeId,
        ...updatePlaceDto,
      });

      const result = await placesService.update(placeId, updatePlaceDto);

      expect(placesRepository.findById).toHaveBeenCalledWith(placeId);
      expect(placesRepository.update).toHaveBeenCalledWith(
        placeId,
        updatePlaceDto,
      );
      expect(result).toEqual({ id: placeId, ...updatePlaceDto });
    });

    it('should throw NotFoundException if place does not exist', async () => {
      const placeId = 1;
      const updatePlaceDto = {
        name: 'Updated Park',
        city: 'Updated Cityville',
      };

      jest.spyOn(placesRepository, 'findById').mockResolvedValueOnce(null);

      await expect(
        placesService.update(placeId, updatePlaceDto),
      ).rejects.toThrowError(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a place', async () => {
      const placeId = 1;
      const now = new Date();

      const mockExistPlace = {
        id: placeId,
        name: 'Park',
        city: 'Cityville',
        state: 'Stateland',
        createdAt: now,
        updatedAt: now,
      };
      jest
        .spyOn(placesRepository, 'findById')
        .mockResolvedValueOnce(mockExistPlace);
      jest.spyOn(placesRepository, 'delete').mockResolvedValueOnce(undefined);

      await placesService.remove(placeId);

      expect(placesRepository.findById).toHaveBeenCalledWith(placeId);
      expect(placesRepository.delete).toHaveBeenCalledWith(placeId);
    });

    it('should throw NotFoundException if place does not exist', async () => {
      const placeId = 1;
      jest.spyOn(placesRepository, 'findById').mockResolvedValueOnce(null);

      await expect(placesService.remove(placeId)).rejects.toThrowError(
        NotFoundException,
      );
    });
  });
});
