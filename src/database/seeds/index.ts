import { DataSource } from 'typeorm';
import { AppDataSource } from '../../data-source';
import { seedUsers } from './user.seed';

async function runSeeds() {
  console.log('🌱 Starting database seeding...\n');

  try {
    // Initialize data source
    await AppDataSource.initialize();
    console.log('✓ Database connection established\n');

    // Run seeds
    await seedUsers(AppDataSource);

    console.log('\n🎉 All seeds completed successfully!');
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    process.exit(1);
  } finally {
    // Close connection
    await AppDataSource.destroy();
    console.log('\n✓ Database connection closed');
    process.exit(0);
  }
}

// Run seeds
runSeeds();

