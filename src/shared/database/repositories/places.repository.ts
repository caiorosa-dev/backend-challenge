import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { type Prisma } from '@prisma/client';

@Injectable()
export class PlacesRepository {
  constructor(private readonly prismaService: PrismaService) {}

  create(createDto: Prisma.PlaceCreateArgs) {
    return this.prismaService.place.create(createDto);
  }

  update(id: number, updateDto: Prisma.PlaceUpdateInput) {
    return this.prismaService.place.update({
      data: updateDto,
      where: { id: id },
    });
  }

  findAll() {
    return this.prismaService.place.findMany();
  }

  findByName(name: string) {
    return this.prismaService.place.findMany({
      where: { name: { contains: name, mode: 'insensitive' } },
    });
  }

  findById(id: number) {
    return this.prismaService.place.findUnique({ where: { id } });
  }
}
