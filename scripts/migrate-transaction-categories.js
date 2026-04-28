const { Client } = require('pg');
require('dotenv').config({ path: '../backend/.env' });

const NEW_CATEGORIES = [
  'electricity',
  'water_sewage',
  'gas',
  'lawn_care',
  'snow_removal',
  'hoa_fee',
  'pest_control',
  'hvac_maintenance',
  'painting',
  'appliance_repair',
];

async function migrate() {
  // Extract project ref from SUPABASE_URL
  const supabaseUrl = process.env.SUPABASE_URL || '';
  const projectRef = supabaseUrl.replace('https://', '').replace('.supabase.co', '');

  const client = new Client({
    host: `db.${projectRef}.supabase.co`,
    port: 5432,
    database: 'postgres',
    user: 'postgres',
    password: process.env.DB_PASSWORD || process.env.SUPABASE_DB_PASSWORD,
    ssl: { rejectUnauthorized: false },
  });

  try {
    await client.connect();
    console.log('Connected to database.');

    for (const cat of NEW_CATEGORIES) {
      const sql = `ALTER TYPE transaction_category ADD VALUE IF NOT EXISTS '${cat}'`;
      await client.query(sql);
      console.log(`  ✓ Added: ${cat}`);
    }

    console.log('\nMigration complete!');
  } catch (err) {
    console.error('Migration failed:', err.message);
    console.log('\n--- Run this SQL manually in Supabase SQL Editor ---');
    for (const cat of NEW_CATEGORIES) {
      console.log(`ALTER TYPE transaction_category ADD VALUE IF NOT EXISTS '${cat}';`);
    }
  } finally {
    await client.end();
  }
}

migrate();
