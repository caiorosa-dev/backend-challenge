import { Injectable, NotFoundException } from '@nestjs/common';
import { CreatePlaceDto } from './dto/create-place.dto';
import { UpdatePlaceDto } from './dto/update-place.dto';
import { PlacesRepository } from '../../shared/database/repositories/places.repository';

@Injectable()
export class PlacesService {
  constructor(private readonly placesRepository: PlacesRepository) {}

  async create(createPlaceDto: CreatePlaceDto) {
    return await this.placesRepository.create(createPlaceDto);
  }

  async findAll() {
    return await this.placesRepository.findAll();
  }

  async findAllByName(name: string) {
    return await this.placesRepository.findByName(name);
  }

  async findOne(id: number) {
    return await this.placesRepository.findById(id);
  }

  async update(id: number, updatePlaceDto: UpdatePlaceDto) {
    const exist = await this.placesRepository.findById(id);

    if (!exist) {
      throw new NotFoundException();
    }

    return await this.placesRepository.update(id, updatePlaceDto);
  }

  async remove(id: number) {
    const exist = await this.placesRepository.findById(id);

    if (!exist) {
      throw new NotFoundException();
    }

    return await this.placesRepository.delete(id);
  }
}
