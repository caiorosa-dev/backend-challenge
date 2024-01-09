import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersRepository } from 'src/shared/database/repositories/users.repository';
import { hash } from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepo: UsersRepository) {}

  async create(createUserDto: CreateUserDto) {
    const { name, email, password } = createUserDto;

    const emailTaken = await this.usersRepo.findByEmail(email);

    if (emailTaken) {
      throw new ConflictException('This email is already in use.');
    }

    const hashedPassword = await hash(password, 12);

    return await this.usersRepo.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });
  }

  async findOne(id: number) {
    return await this.usersRepo.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });
  }
}
