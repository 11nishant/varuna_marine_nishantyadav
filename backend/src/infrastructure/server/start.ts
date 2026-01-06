 // This file ensures dotenv is loaded before anything else
import dotenv from 'dotenv';
import { resolve } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Load .env file from project root
dotenv.config({ path: resolve(process.cwd(), '.env') });

// Verify DATABASE_URL
if (!process.env.DATABASE_URL) {
  console.error('ERROR: DATABASE_URL is not set in environment variables');
  console.error('Please ensure .env file exists in the backend directory with:');
  console.error('DATABASE_URL="postgresql://postgres:nishant@localhost:5432/fueleu"');
  process.exit(1);
}

// Now import and start the server
import('./index');

