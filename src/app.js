import express from 'express'

import cors from "cors";
import {router} from './Routes/routes.js'
import dotenv from 'dotenv'
dotenv.config()




const app = express();


// Habilita CORS
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Configura CORS Headers


// Configura uploads para a pasta 'uploads'
app.use('/uploads', express.static('uploads'));
app.use(router);


const port = process.env.PORT || 8000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});