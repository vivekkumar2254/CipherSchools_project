import { connectMongoDB } from './src/config/database.js';
import { seedDatabase } from './src/utils/seedDatabase.js';

console.log('Starting reseed...');

connectMongoDB().then(async () => {
  console.log('Connected to MongoDB');
  await seedDatabase();
  console.log('Seeding complete!');
  process.exit(0);
}).catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
