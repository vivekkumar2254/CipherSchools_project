import mongoose from 'mongoose';
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

export const connectMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
};

export const pgPool = new Pool({
  host: process.env.POSTGRES_HOST,
  port: process.env.POSTGRES_PORT,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

export const testPostgresConnection = async () => {
  try {
    const client = await pgPool.connect();
    const result = await client.query('SELECT NOW()');
    console.log('PostgreSQL connected successfully at:', result.rows[0].now);
    client.release();
  } catch (error) {
    console.error('PostgreSQL connection error:', error.message);
    console.log('Make sure PostgreSQL is running and credentials are correct');
  }
};

process.on('SIGINT', async () => {
  console.log('Shutting down gracefully...');
  await mongoose.connection.close();
  await pgPool.end();
  console.log('Database connections closed');
  process.exit(0);
});
