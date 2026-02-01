const fs = require('fs');
const path = require('path');
const pool = require('../config/database');

async function initDatabase() {
  const client = await pool.connect();
  try {
    console.log('Initializing database...');

    const schemaSQL = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');

    await client.query(schemaSQL);

    console.log('Database initialized successfully');
    console.log('Default users created:');
    console.log('- admin@talentflow.com (Admin) - password: admin123');
    console.log('- recruiter@talentflow.com (Recruiter) - password: admin123');
    console.log('- hm@talentflow.com (Hiring Manager) - password: admin123');
    console.log('- bh@talentflow.com (Business Head) - password: admin123');
    console.log('- hr@talentflow.com (HR Manager) - password: admin123');

  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

initDatabase()
  .then(() => {
    console.log('Done!');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Failed:', err);
    process.exit(1);
  });
