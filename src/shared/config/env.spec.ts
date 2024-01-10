import 'dotenv/config';
import { Env } from './env'; // Assuming your original file is named env.ts
import { validateSync } from 'class-validator';

describe('Env Configuration', () => {
  it('should validate and load environment variables', () => {
    try {
      const envInstance = new Env();
      envInstance.jwtSecret = 'TEST_TOKEN';

      const errors = validateSync(envInstance);

      expect(errors.length).toBe(0);
    } catch (error) {
      // If any unexpected error occurs, fail the test
      fail(error);
    }
  });
});
