import { Module, Global } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { PlacesRepository } from './repositories/places.repository';
import { UsersRepository } from './repositories/users.repository';

@Global()
@Module({
  providers: [PlacesRepository, UsersRepository, PrismaService],
  exports: [PlacesRepository, UsersRepository],
})
export class DatabaseModule {}
