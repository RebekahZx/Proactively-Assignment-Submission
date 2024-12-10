


const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  // Check if the Authorization header is present
  const token = req.headers['authorization'];
  console.log(token);

  if (!token) {
    return res.status(403).json({ message: 'No token provided.' });
  }

  // Check if token is in Bearer <token> format
  const tokenParts = token.split(' ');
  if (tokenParts.length !== 2 || tokenParts[0] !== 'Bearer') {
    return res.status(400).json({ message: 'Invalid token format. Expected format: Bearer <token>' });
  }

  try {
    // Verify the JWT token using the secret
    const decoded = jwt.verify(tokenParts[1], process.env.JWT_SECRET || 'secret123');
    req.user = decoded;  // Attach decoded user data to req.user
    
    next();  // Proceed to the next middleware or route handler
  } catch (err) {
    console.error('JWT Verification Error:', err);
    res.status(401).json({ message: 'Invalid or expired token.' });
  }
};

module.exports = authMiddleware;
