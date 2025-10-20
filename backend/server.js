import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import serviceRequestRoutes from './routes/serviceRequestRoutes.js';
import cors from 'cors';


dotenv.config();
connectDB();

const app = express();

app.use(cors());
// 2. This is a crucial middleware that allows our server
// to accept and parse JSON data in the request body.
app.use(express.json());

app.get('/', (req, res) => {
  res.send('API is running...');
});

// 3. This tells the app to use our userRoutes file
// for any URL that starts with '/api/users'.
// So, our register route will be accessible at '/api/users/register'.
app.use('/api/users', userRoutes);
app.use('/api/requests', serviceRequestRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});