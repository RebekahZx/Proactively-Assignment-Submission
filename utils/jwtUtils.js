const jwt = require('jsonwebtoken');

const SECRET_KEY = process.env.JWT_SECRET ;

exports.generateToken = (payload, expiresIn = '1h') => {
  return jwt.sign(payload, SECRET_KEY, { expiresIn });
};

exports.verifyToken = (token) => {
  try {
    return jwt.verify(token, SECRET_KEY);
  } catch (error) {
    throw new Error('Invalid or expired token.');
  }
};

exports.decodeToken = (token) => {
  return jwt.decode(token);
};
