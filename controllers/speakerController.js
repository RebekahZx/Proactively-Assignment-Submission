const db = require('../config/db');


exports.createSpeakerProfile = (req, res) => {
  const { userId, expertise, pricePerSession } = req.body;

  // Validate input fields
  if (!userId || !expertise || !pricePerSession) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    // Insert speaker profile
    db.query(
      'INSERT INTO Speakers (userId, expertise, pricePerSession) VALUES (?, ?, ?)',
      [userId, expertise, pricePerSession],
      (err, results) => {
        if (err) {
          console.error('Database error:', err);
          return res
            .status(500)
            .json({ message: 'Error creating speaker profile.', error: err.message });
        }

        // Update the isSpeaker field in Users table
        db.query(
          'UPDATE Users SET isSpeaker = true WHERE id = ?',
          [userId],
          (updateErr) => {
            if (updateErr) {
              console.error('Error updating user isSpeaker field:', updateErr);
              return res
                .status(500)
                .json({ message: 'Speaker profile created, but failed to update user status.', error: updateErr.message });
            }

            res.status(201).json({
              message: 'Speaker profile created successfully.',
              profileId: results.insertId,
            });
          }
        );
      }
    );
  } catch (error) {
    console.error('Error in createSpeakerProfile:', error);
    res.status(500).json({ message: 'Server error. Could not create profile.', error: error.message });
  }
};


exports.listSpeakers = (req, res) => {
  db.query('SELECT * FROM Speakers', (err, results) => {
    if (err) return res.status(500).send('Error fetching speakers.');
    res.json(results);
  });
};
