const db = require('../config/db');
const bcrypt = require('bcrypt');
const { generateOtp, sendOtpEmail } = require('../utils/otp');
const jwt = require('jsonwebtoken');

exports.registerUser = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateOtp();

    db.query(
      'INSERT INTO Users (firstName, lastName, email, password, otp) VALUES (?, ?, ?, ?, ?)',
      [firstName, lastName, email, hashedPassword, otp],
      async (err, result) => {
        if (err) return res.status(500).send(err);

        await sendOtpEmail(email, otp);
        res.status(201).send('User registered. Please verify your email.');
      }
    );
  } catch (error) {
    res.status(500).send('Error registering user.');
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    db.query('SELECT * FROM Users WHERE email = ?', [email], async (err, results) => {
      if (err || results.length === 0) return res.status(400).send('User not found.');

      const user = results[0];
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) return res.status(401).send('Invalid credentials.');
      if (!user.isVerified) return res.status(403).send('Email not verified.');

      req.session.user = user;
      const token = jwt.sign({ id: user.id, isSpeaker: user.isSpeaker,userEmail:user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    console.log(token);
    
    
    res.status(200).json({ token });
    //   res.send('Login successful.');
    });
  } catch (error) {
    res.status(500).send('Error logging in.');
  }
};



exports.verifyOtp = (req, res) => {
  const { email, otp } = req.body;
  db.query(
    'SELECT * FROM Users WHERE email = ? AND otp = ?',
    [email, otp],
    (err, results) => {
      if (err || results.length === 0) return res.status(400).send('Invalid OTP.');

      db.query(
        'UPDATE Users SET isVerified = true WHERE email = ?',
        [email],
        (updateErr) => {
          if (updateErr) return res.status(500).send('Verification failed.');

          res.send('Email verified successfully.');
        }
      );
    }
  );
};
