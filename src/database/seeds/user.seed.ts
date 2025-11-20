import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../../user/user.entity';

export async function seedUsers(dataSource: DataSource) {
  const userRepository = dataSource.getRepository(User);

  const existingUsers = await userRepository.count();
  if (existingUsers > 0) {
    console.log('Users already exist, skipping seed...');
    return;
  }

  const users = [
    {
      email: 'admin@example.com',
      password: await bcrypt.hash('admin123', 10),
      name: 'Admin User',
    },
    {
      email: 'user@example.com',
      password: await bcrypt.hash('user123', 10),
      name: 'Test User',
    },
    {
      email: 'demo@example.com',
      password: await bcrypt.hash('demo123', 10),
      name: 'Demo User',
    },
  ];

  for (const userData of users) {
    const user = userRepository.create(userData);
    await userRepository.save(user);
    console.log(`Created user: ${userData.email}`);
  }

  console.log('\nUser seeding completed!');
}
