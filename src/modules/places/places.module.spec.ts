import { Test, TestingModule } from '@nestjs/testing';
import { PlacesModule } from './places.module';
import { PlacesService } from './places.service';
import { PlacesController } from './places.controller';
import { DatabaseModule } from '../../shared/database/database.module';

describe('PlacesModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [PlacesModule, DatabaseModule],
    }).compile();
  });

  it('should be defined', () => {
    expect(module).toBeDefined();
  });

  it('should provide PlacesService', () => {
    const service = module.get<PlacesService>(PlacesService);
    expect(service).toBeDefined();
    expect(service).toBeInstanceOf(PlacesService);
  });

  it('should provide PlacesController', () => {
    const controller = module.get<PlacesController>(PlacesController);
    expect(controller).toBeDefined();
    expect(controller).toBeInstanceOf(PlacesController);
  });

  afterAll(async () => {
    await module.close();
  });
});
