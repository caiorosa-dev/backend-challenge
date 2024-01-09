import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { CreateUserDto } from './create-user.dto';

describe('CreateUserDto', () => {
  it('should be valid with correct input', async () => {
    const createUserDto = plainToClass(CreateUserDto, {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    });

    const errors = await validate(createUserDto);

    expect(errors.length).toBe(0);
  });

  it('should fail validation if name is empty', async () => {
    const createUserDto = plainToClass(CreateUserDto, {
      name: '',
      email: 'test@example.com',
      password: 'password123',
    });

    const errors = await validate(createUserDto);

    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isNotEmpty');
  });

  it('should fail validation if email is not valid', async () => {
    const createUserDto = plainToClass(CreateUserDto, {
      name: 'Test User',
      email: 'invalid-email',
      password: 'password123',
    });

    const errors = await validate(createUserDto);

    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isEmail');
  });

  it('should transform email to lowercase during validation', async () => {
    const createUserDto = plainToClass(CreateUserDto, {
      name: 'Test User',
      email: 'tesT@example.com',
      password: 'password123',
    });

    await validate(createUserDto);

    expect(createUserDto.email).toBe('test@example.com');
  });

  it('should fail validation if password is too short', async () => {
    const createUserDto = plainToClass(CreateUserDto, {
      name: 'Test User',
      email: 'test@example.com',
      password: '12', // Too short, should be at least 3 characters
    });

    const errors = await validate(createUserDto);

    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('minLength');
  });
});
