import express from 'express';
import 'dotenv/config';
import connectToDB from './src/config/db.js';

const app = express()

app.use(express.json());

connectToDB();
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server is running http://localhost:${PORT}`);
})