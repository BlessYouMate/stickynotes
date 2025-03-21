import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();


const { Pool } = pkg

//data about database and db user (stored in .env for safety)
const pool = new Pool({
  user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

//function which creates the tables
const createTables = async () => {
  try {
    await pool.connect();
    console.log('Connected to the database.');

    const createTagsTable = `
      CREATE TABLE IF NOT EXISTS tags (
        id SERIAL PRIMARY KEY,
        tag VARCHAR(32) NOT NULL,
        isChecked boolean,
        color VARCHAR(32)
      );
    `;

    const createNotesTable = `
      CREATE TABLE IF NOT EXISTS notes (
        id SERIAL PRIMARY KEY,
        tag_id INT REFERENCES tags(id) ON DELETE CASCADE,
        title VARCHAR(32) NOT NULL,
        description TEXT NOT NULL
      );
    `;

    // Tworzenie tabel w odpowiedniej kolejności
    await pool.query(createTagsTable);
    console.log('Tags table created or already existed.');

    await pool.query(createNotesTable);
    console.log('Notes table created or already existed.');

  } catch (err) {
    console.error('Error creating tables:', err);
  }
};
  
createTables();

export default pool;