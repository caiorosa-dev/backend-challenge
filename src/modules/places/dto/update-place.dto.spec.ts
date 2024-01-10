import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { UpdatePlaceDto } from './update-place.dto';

describe('UpdatePlaceDto', () => {
  it('should be valid with correct input', async () => {
    const updatePlaceDto = plainToClass(UpdatePlaceDto, {
      name: 'Updated Park',
      city: 'Updated Cityville',
    });

    const errors = await validate(updatePlaceDto);

    expect(errors.length).toBe(0);
  });

  it('should be valid if all fields are empty', async () => {
    const updatePlaceDto = plainToClass(UpdatePlaceDto, {});

    const errors = await validate(updatePlaceDto);

    expect(errors.length).toBe(0);
  });

  it('should fail validation if name is not a string', async () => {
    const updatePlaceDto = plainToClass(UpdatePlaceDto, {
      name: 123, // Invalid type, should be a string
      city: 'Updated Cityville',
    });

    const errors = await validate(updatePlaceDto);

    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isString');
  });

  it('should fail validation if city is not a string', async () => {
    const updatePlaceDto = plainToClass(UpdatePlaceDto, {
      name: 'Updated Park',
      city: 123, // Invalid type, should be a string
    });

    const errors = await validate(updatePlaceDto);

    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].constraints).toHaveProperty('isString');
  });
});
