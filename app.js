import express from "express";
import morgan from "morgan";
import cors from "cors";
import dotenv from "dotenv";
import pkg from 'pg';
const { Pool } = pkg;








import contactsRouter from './routes/contactsRouter.js'
import authRouter from "./routes/authRouter.js";


dotenv.config()

const app = express();



app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());
app.use(express.static('public'))

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'snakegame',
  password: 'Igoresha1713',
  port: 5432,
});


app.get('/gamer', async (req, res) => {
  try {
    console.log('Received request for /gamer');
    const result = await pool.query('SELECT * FROM gamer');
    console.log('Database query result:', result.rows);
    res.json(result.rows);
  } catch (err) {
    console.error('Error during database query:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.post('/gamer', async (req, res) => {
  const { first_name, score } = req.body;
  if (!first_name || !score) {
    return res.status(400).json({ error: 'first_name and score are required' });
  }

  try {
    const result = await pool.query(
      'INSERT INTO gamer (first_name, score) VALUES ($1, $2) RETURNING *',
      [first_name, score]
    );
    console.log('Inserted data:', result.rows[0]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error during data insertion:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


const port = process.env.PORT || 3000;


app.listen(port, () => {



});



export default app