const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

// Routes
const companyRoutes = require('./routes/companyRoutes');
const userRoutes = require('./routes/userRoutes');
const searchRoutes = require('./routes/searchRoutes');

const app = express();
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect( process.env.DB_URI,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }).then(() => {
  console.log('Connected to MongoDB!');
}).catch((err) => {
  console.error('Error connecting to MongoDB:', err);
});

// Register routes
app.use('/companies', companyRoutes);
app.use('/users', userRoutes);
app.use('/search', searchRoutes);

// Basic health check route
app.get('/', (req, res) => {
  res.send('Node Assignment API is running!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
