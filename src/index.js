import dotenv from "dotenv"
import express from 'express';
import connectDB from "./db/index.js"
import mongoose from 'mongoose';

import userRouter from "./routes/userRouter.js";
const app = express();
dotenv.config()
const port = 3000;
app.use(express.json());
app.use('/api/users', userRouter);
app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
}); 
connectDB()

// mongoose.connect("mongodb+srv://husnain483271:khan1122@backend.cdtrwii.mongodb.net/NODE-API?retryWrites=true&w=majority&appName=backend")
//   .then(() => console.log('Connected to MongoDB'))
//   .catch(err => console.error('Connection failed', err));