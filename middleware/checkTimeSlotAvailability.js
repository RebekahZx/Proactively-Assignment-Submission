const db = require('../config/db.js'); // Adjust path if needed

const checkTimeSlotAvailability = (req, res, next) => {
    console.log("hittime");
    const { speakerId, eventDate, timeSlot } = req.body;

    if (!speakerId || !eventDate || !timeSlot) {
        return res.status(400).send('Missing required fields: speakerId, eventDate, or timeSlot.');
    }

    const bookingHour = parseInt(timeSlot.split(':')[0], 10);
    const startHour = 9;
    const endHour = 16;

    let adjacentSlot = bookingHour + 1 < endHour ? `${String(bookingHour + 1).padStart(2, '0')}:00` : null;

    const query = `
        SELECT * FROM Bookings
        WHERE speakerId = ? AND eventDate = ?
        AND (timeSlot = ? ${adjacentSlot ? `OR timeSlot = ?` : ''})
    `;

    const queryParams = adjacentSlot
        ? [speakerId, eventDate, timeSlot, adjacentSlot]
        : [speakerId, eventDate, timeSlot];

    db.query(query, queryParams, (err, results) => {
        if (err) {
            console.error('Database error:', err);
            return res.status(500).send('Error checking time slot availability.');
        }

        if (results.length > 0) {
            return res.status(400).send('The selected time slot or an adjacent time slot is already booked.');
        }

        next();
    });
};

module.exports = checkTimeSlotAvailability;
