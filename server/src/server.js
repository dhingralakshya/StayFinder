'use strict';

const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4000;

// Import Sequelize instance (to sync DB)
const db = require('./models');

const userRoutes = require('./routes/user');
const listingRoutes = require('./routes/listing');

app.use(cors());
app.use(express.json());

// Routes
app.use('/users', userRoutes);
app.use('/listing', listingRoutes);

app.get('/', (req, res) => {
res.send('StayFinder API is running!');
});

// Global error handler
app.use((err, req, res, next) => {
console.error(err.stack);
res.status(500).json({ message: 'Something went wrong!' });
});

// Start server and sync DB
db.sequelize.sync().then(() => {
app.listen(PORT, () => {
console.log(`Server is running on port ${PORT}`);
});
}).catch((err) => {
console.error('Failed to sync database:', err);
});