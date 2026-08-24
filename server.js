import express from 'express';
import 'dotenv/config';
import connectToDB from './src/config/db.js';
import { setupSwagger } from "./src/config/swagger.js";

const app = express()

app.use(express.json());

setupSwagger(app);
connectToDB();
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server is running http://localhost:${PORT}`);
})