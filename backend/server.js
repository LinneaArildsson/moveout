require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const labelRoutes = require('./routes/labelsRoute');
const userRoutes = require('./routes/usersRoute');

const app = express();

//Middleware
app.use(cors());
app.use(express.json());

app.use('/uploads', express.static('uploads')); // Serve static files

app.use((req, res, next) => {
  console.log(req.path, req.method)
  next()
})

//Routes
app.use('/labels', labelRoutes)
app.use('/user', userRoutes)

// Serve static files from the React app
app.use(express.static(path.join(__dirname, '../frontend/build')));

// The "catchall" handler: for any request that doesn't match one above, send back index.html.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build', 'index.html'));
});

//Connect to database
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
  })
  .catch(err => {
    console.error('MongoDB connection error:', err.message);
    process.exit(1); // Exit the process with failure
  });

// Starta servern
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
