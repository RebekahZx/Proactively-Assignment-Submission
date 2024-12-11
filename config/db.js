const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  database: 'proactive',
  password: process.env.DB_PASS
});

connection.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err.stack);
    return;
  }
  console.log('Connected to MySQL database');
});

connection.query(`
    CREATE TABLE IF NOT EXISTS Users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      firstName VARCHAR(255) NOT NULL,
      lastName VARCHAR(255) NOT NULL,
      email VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      isSpeaker BOOLEAN DEFAULT FALSE,
      otp VARCHAR(10),
      isVerified BOOLEAN DEFAULT FALSE
    )
  `, (err) => {
    if (err) console.log('Error creating table:', err);
    else console.log('Users table ready.');
  });


// Create Speakers table
connection.query(`
    CREATE TABLE IF NOT EXISTS Speakers (
      id INT AUTO_INCREMENT PRIMARY KEY,
      userId INT NOT NULL,
      bio TEXT,
      expertise VARCHAR(255),
      availability BOOLEAN DEFAULT TRUE,
      pricePerSession DECIMAL(10, 2) NOT NULL,
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES Users(id) ON DELETE CASCADE
    )
  `, (err) => {
    if (err) console.log('Error creating Speakers table:', err);
    else console.log('Speakers table ready.');
  });
  
  // Create Bookings table
  connection.query(`
  CREATE TABLE IF NOT EXISTS Bookings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  speakerId INT NOT NULL,
  eventName VARCHAR(255) NOT NULL,
  eventDate DATE NOT NULL,
  timeSlot TIME NOT NULL,
  status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
  FOREIGN KEY (speakerId) REFERENCES Speakers(id) ON DELETE CASCADE
);
  `, (err) => {
    if (err) console.log('Error creating Bookings table:', err);
    else console.log('Bookings table ready.');
  });




  
  module.exports = connection;
