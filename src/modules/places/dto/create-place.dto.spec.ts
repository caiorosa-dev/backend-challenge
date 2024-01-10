import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { CreatePlaceDto } from './create-place.dto';

describe('CreatePlaceDto', () => {
  it('should be valid with correct input', async () => {
    const createPlaceDto = plainToClass(CreatePlaceDto, {
      name: 'Park',
      city: 'Cityville',
      state: 'Stateland',
    });

    const errors = await validate(createPlaceDto);

    expect(errors.length).toBe(0);
  });

  it('should fail validation if name is empty', async () => {
    const createPlaceDto = plainToClass(CreatePlaceDto, {
      name: '',
      city: 'Cityville',
      state: 'Stateland',
    });

    const errors = await validate(createPlaceDto);

    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isNotEmpty');
  });

  it('should fail validation if city is empty', async () => {
    const createPlaceDto = plainToClass(CreatePlaceDto, {
      name: 'Park',
      city: '',
      state: 'Stateland',
    });

    const errors = await validate(createPlaceDto);

    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isNotEmpty');
  });

  it('should fail validation if state is empty', async () => {
    const createPlaceDto = plainToClass(CreatePlaceDto, {
      name: 'Park',
      city: 'Cityville',
      state: '',
    });

    const errors = await validate(createPlaceDto);

    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isNotEmpty');
  });

  it('should fail validation if name is not a string', async () => {
    const createPlaceDto = plainToClass(CreatePlaceDto, {
      name: 123, // Invalid type, should be a string
      city: 'Cityville',
      state: 'Stateland',
    });

    const errors = await validate(createPlaceDto);

    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isString');
  });

  it('should fail validation if city is not a string', async () => {
    const createPlaceDto = plainToClass(CreatePlaceDto, {
      name: 'Park',
      city: 123, // Invalid type, should be a string
      state: 'Stateland',
    });

    const errors = await validate(createPlaceDto);

    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isString');
  });

  it('should fail validation if state is not a string', async () => {
    const createPlaceDto = plainToClass(CreatePlaceDto, {
      name: 'Park',
      city: 'Cityville',
      state: 123, // Invalid type, should be a string
    });

    const errors = await validate(createPlaceDto);

    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isString');
  });
});
