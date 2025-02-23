// server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Basic middleware
app.use(express.json());
app.use(cors());

// Debug middleware - log all requests
app.use((req, res, next) => {
  console.log('Request:', req.method, req.url);
  next();
});

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Root route
app.get('/', (req, res) => {
  res.send('API Running');
});

// Load routes
const spotifyUsers = require('./routes/api/spotifyUsers');
app.use('/api/spotify-users', spotifyUsers);

const playlists = require('./routes/api/playlists');
app.use('/api/playlists', playlists);

// Error handling
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({ error: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});