// const express = require('express');
// const dotenv = require('dotenv');
// const authRoutes = require('./routes/authRoutes');

// dotenv.config();

// const app = express();
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// app.use('/auth', authRoutes);

// const PORT = process.env.PORT || 3000;

// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const db = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const speakerRoutes = require('./routes/speakerRoutes');
const sessionRoutes = require('./routes/sessionRoutes');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Session configuration
app.use(
  session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

// Routes
app.use('/api/users', userRoutes);
app.use('/api/speakers', speakerRoutes);
app.use('/api/sessions', sessionRoutes);

// Server setup
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});