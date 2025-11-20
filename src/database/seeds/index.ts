import { DataSource } from 'typeorm';
import { AppDataSource } from '../../data-source';
import { seedUsers } from './user.seed';

async function runSeeds() {
  console.log('Starting database seeding...\n');

  try {
    await AppDataSource.initialize();
    console.log('Database connection established\n');

    await seedUsers(AppDataSource);

    console.log('\nAll seeds completed successfully!');
  } catch (error) {
    console.error('Error during seeding:', error);
    process.exit(1);
  } finally {
    await AppDataSource.destroy();
    console.log('\nDatabase connection closed');
    process.exit(0);
  }
}

runSeeds();
