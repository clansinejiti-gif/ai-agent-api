import express from 'express';
import 'dotenv/config';
import connectToDB from './src/config/db.js';
import { setupSwagger } from "./src/config/swagger.js";
import sessionConfig from './src/config/sessions.js';

const app = express()

app.use(express.json());
app.use(express.urlencoded({extended: true}))
app.use(sessionConfig)

setupSwagger(app);
await connectToDB();


const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server is running http://localhost:${PORT}`);
})