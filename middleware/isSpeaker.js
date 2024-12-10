const isSpeaker = (req, res, next) => {
    if (!req.user || !req.user.isSpeaker) {
      return res.status(403).send('Forbidden: Only speakers can access this route.');
    }
    next();
  };
  
  module.exports = isSpeaker;