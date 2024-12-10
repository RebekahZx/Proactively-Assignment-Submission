const jwt = require('jsonwebtoken');

const isLoggedIn = (req, res, next) => {
    // console.log("hitlog");
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).send('Unauthorized: No token provided.');

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).send('Unauthorized: Invalid token.');

    req.user = decoded; // Attach user info to the request
    next();
  });
};

module.exports = isLoggedIn;



  