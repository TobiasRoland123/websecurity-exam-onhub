// database.ts
import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : undefined,
};

////////////////////////////////////////////////////////////////////////////////////////
// Connect to the MySQL database
async function connectToDatabase(): Promise<mysql.Connection> {
  try {
    const conn = await mysql.createConnection(dbConfig);
    return conn;
  } catch (error) {
    console.error('Error connecting to database:', error);
    throw error;
  }
}

export default connectToDatabase;
