const { Client } = require('pg');

const combos = [
  { user: 'postgres', password: 'minhkhoi190', database: 'house_rental' },
  { user: 'postgres', password: 'minhkhoi190', database: 'postgres' },
  { user: 'user', password: 'minhkhoi190', database: 'house_rental' },
  { user: 'postgres', password: 'password', database: 'house_rental' },
  { user: 'postgres', password: 'admin', database: 'house_rental' },
  { user: 'postgres', password: '', database: 'postgres' },
];

async function detect() {
  console.log('Testing local PostgreSQL connection options at localhost:5432...');
  
  for (const combo of combos) {
    console.log(`Trying - User: ${combo.user}, Password: ${combo.password ? '****' : '(none)'}, Database: ${combo.database}`);
    const client = new Client({
      host: 'localhost',
      port: 5432,
      user: combo.user,
      password: combo.password,
      database: combo.database,
    });

    try {
      await client.connect();
      console.log('\n>>> SUCCESS! CONNECTED WITH COMBO:');
      console.log(combo);
      await client.end();
      process.exit(0);
    } catch (err) {
      console.log('  Failed:', err.message);
    }
  }

  console.error('\nERROR: Could not connect to local PostgreSQL with any known combo.');
  process.exit(1);
}

detect();
