import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { PlacesService } from './places.service';
import { CreatePlaceDto } from './dto/create-place.dto';
import { UpdatePlaceDto } from './dto/update-place.dto';

@Controller('places')
export class PlacesController {
  constructor(private readonly placesService: PlacesService) {}

  @Post()
  async create(@Body() createPlaceDto: CreatePlaceDto) {
    return await this.placesService.create(createPlaceDto);
  }

  @Get()
  async findAll(@Query('name') name?: string) {
    if (name) {
      return await this.placesService.findAllByName(name);
    }

    return await this.placesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    return await this.placesService.findOne(id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() updatePlaceDto: UpdatePlaceDto,
  ) {
    return await this.placesService.update(id, updatePlaceDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return await this.placesService.remove(id);
  }
}
