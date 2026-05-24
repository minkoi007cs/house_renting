const { Client } = require('pg');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../backend/.env') });

const dbPassword = process.env.DB_PASSWORD || process.env.SUPABASE_DB_PASSWORD || 'minhkhoi190';
const supabaseUrl = process.env.SUPABASE_URL || '';
const projectRef = supabaseUrl.replace('https://', '').replace('.supabase.co', '');
const localDbUrl = process.env.DATABASE_URL || 'postgresql://user:minhkhoi190@localhost:5432/house_rental';

async function main() {
  let client;
  let connected = false;

  const dbUrl = process.env.DATABASE_URL;
  if (dbUrl) {
    console.log(`Attempting connection using DATABASE_URL...`);
    const isSupabase = dbUrl.includes('supabase.co') || dbUrl.includes('supabase.com');
    client = new Client({
      connectionString: dbUrl,
      ssl: isSupabase ? { rejectUnauthorized: false } : false
    });

    try {
      await client.connect();
      console.log('Successfully connected to Database via DATABASE_URL!');
      connected = true;
    } catch (err) {
      console.log('Connection using DATABASE_URL failed:', err.message);
    }
  }

  // Fallback to projectRef cloud connection
  if (!connected && projectRef) {
    const cloudHost = `db.${projectRef}.supabase.co`;
    console.log(`\nAttempting connection to Supabase Cloud Direct: ${cloudHost}...`);
    client = new Client({
      host: cloudHost,
      port: 5432,
      database: 'postgres',
      user: 'postgres',
      password: dbPassword,
      ssl: { rejectUnauthorized: false },
    });

    try {
      await client.connect();
      console.log('Successfully connected to Supabase Cloud Database (Direct)!');
      connected = true;
    } catch (err) {
      console.log('Supabase Cloud Direct connection failed:', err.message);
    }
  }

  // Final fallback to a default local connection if still not connected
  if (!connected) {
    console.log(`\nAttempting connection to Local fallback...`);
    client = new Client({
      connectionString: 'postgresql://postgres:minhkhoi190@localhost:5432/house_rental',
    });

    try {
      await client.connect();
      console.log('Successfully connected to Local fallback Database!');
      connected = true;
    } catch (err) {
      console.error('Local fallback Database connection failed:', err.message);
      console.error('\nERROR: Could not connect to any database.');
      console.error('Please verify your database credentials inside backend/.env.');
      process.exit(1);
    }
  }

  try {
    // 1. Run database-migration.sql
    console.log('\n--- Step 1: Running Database Schema Migration ---');
    const schemaPath = path.join(__dirname, '../docs/database-migration.sql');
    console.log(`Reading: ${schemaPath}`);
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    
    console.log('Executing schema queries...');
    await client.query(schemaSql);
    console.log('✓ Database Schema Migration successfully executed!');

    // 2. Run data-migration.sql
    console.log('\n--- Step 2: Running Data Migration ---');
    const dataMigrationPath = path.join(__dirname, '../docs/data-migration.sql');
    console.log(`Reading: ${dataMigrationPath}`);
    const dataSql = fs.readFileSync(dataMigrationPath, 'utf8');

    console.log('Executing data copy queries...');
    await client.query(dataSql);
    console.log('✓ Data Migration successfully executed!');

    console.log('\n====================================================');
    console.log('SUCCESS: All migrations have been executed successfully!');
    console.log('====================================================');

  } catch (err) {
    console.error('\nMigration execution FAILED:', err);
  } finally {
    await client.end();
    console.log('Database connection closed.');
  }
}

main();
