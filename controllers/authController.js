const connection = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sendOtpEmail, generateOtp } = require('../utils/otp');


// Signup logic
exports.signup = async (req, res) => {
  const { firstName, lastName, email, password, isSpeaker } = req.body;
  const otp = generateOtp();

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    connection.query(
      "INSERT INTO Users (firstName, lastName, email, password, isSpeaker, otp) VALUES (?, ?, ?, ?, ?, ?)",
      [firstName, lastName, email, hashedPassword, isSpeaker, otp],
      async (err) => {
        if (err) return res.status(500).json({ error: err.message });

        await sendOtpEmail(email, otp);
        res.status(201).json({ message: 'User registered. OTP sent to email.' });
      }
    );
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// OTP Verification
exports.verifyOtp = (req, res) => {
  const { email, otp } = req.body;

  connection.query(
    "SELECT * FROM Users WHERE email = ? AND otp = ?",
    [email, otp],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });

      if (results.length === 0) return res.status(400).json({ message: 'Invalid OTP.' });

      connection.query(
        "UPDATE Users SET isVerified = TRUE, otp = NULL WHERE email = ?",
        [email],
        (err) => {
          if (err) return res.status(500).json({ error: err.message });

          res.status(200).json({ message: 'Account verified successfully.' });
        }
      );
    }
  );
};

// Login logic
exports.login = (req, res) => {
  const { email, password } = req.body;

  connection.query("SELECT * FROM Users WHERE email = ?", [email], async (err, results) => {
    if (err) return res.status(500).json({ error: err.message });

    if (results.length === 0 || !results[0].isVerified) {
      return res.status(401).json({ message: 'Invalid email or account not verified.' });
    }

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) return res.status(401).json({ message: 'Invalid password.' });

    const token = jwt.sign({ id: user.id, isSpeaker: user.isSpeaker }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ token });
  });
};