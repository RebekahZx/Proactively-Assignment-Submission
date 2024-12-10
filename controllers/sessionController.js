const { error } = require('console');
const db = require('../config/db');
const nodemailer = require('nodemailer');
const { console } = require('inspector');

const { google } = require('googleapis');

exports.bookSession = (req, res) => {
  // Ensure the user is authenticated
  if (!req.session.user || !req.session.user.id) {
    return res.status(401).send('User not authenticated.');
  }

  const { speakerId, eventName, eventDate, timeSlot } = req.body;
  const userId = req.session.user.id;

  // Ensure timeSlot is within the valid range (9 AM to 4 PM)
  const startHour = 9;
  const endHour = 16; // 4 PM
  const bookingHour = parseInt(timeSlot.split(':')[0]);

  if (bookingHour < startHour || bookingHour >= endHour) {
    return res.status(400).send('Invalid time slot. Bookings are only allowed between 9 AM and 4 PM.');
  }

  
  const insertQuery = `
    INSERT INTO Bookings (speakerId, eventName, eventDate, timeSlot, status) 
    VALUES (?, ?, ?, ?, 'approved')
  `;
  db.query(insertQuery, [speakerId, eventName, eventDate, timeSlot], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).send('Error booking session.');
    }

    // Fetch the user's email and speaker's email
    const emailQuery = `
      SELECT 
        (SELECT email FROM Users WHERE id = ?) AS userEmail,
        (SELECT u.email FROM Speakers sp JOIN Users u ON sp.userId = u.id WHERE sp.id = ?) AS speakerEmail
    `;

    db.query(emailQuery, [userId, speakerId], async (emailErr, emailResults) => {
      if (emailErr) {
        console.error('Error fetching emails:', emailErr);
        return res.status(500).send('Error sending confirmation emails.');
      }

      const userEmail = emailResults[0]?.userEmail;
      const speakerEmail = emailResults[0]?.speakerEmail;

      if (!userEmail || !speakerEmail) {
        console.error('User or speaker email is missing:', { userEmail, speakerEmail });
        return res.status(500).send('Error retrieving email addresses.');
      }

      // Nodemailer transporter setup
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.TEST_MAIL,
          pass: process.env.APP_PASS,
        },
      });

      // Email content for the user
      const mailOptionsUser = {
        from: 'DO-NOT-REPLY@gmail.com',
        to: userEmail,
        subject: 'Booking Confirmation',
        text: `Your booking for "${eventName}" on ${eventDate} at ${timeSlot} has been confirmed.Please arrive 5 mins before the session commenment for ease.Thank you`,
      };

      // Email content for the speaker
      const mailOptionsSpeaker = {
        from: 'DO-NOT-REPLY@gmail.com',
        to: speakerEmail,
        subject: 'New session Notification',
        text: `You have a new booking for "${eventName}" on ${eventDate} at ${timeSlot}.Please collect the amount dueable after the session.Thank you`,
      };

      // Send emails
      transporter.sendMail(mailOptionsUser, (mailErr) => {
        if (mailErr) {
          console.error('Error sending email to user:', mailErr);
        }
      });

      transporter.sendMail(mailOptionsSpeaker, (mailErr) => {
        if (mailErr) {
          console.error('Error sending email to speaker:', mailErr);
        }
      });

      // Google Calendar Integration
      const auth = new google.auth.JWT(
        process.env.SERVICE_ACCOUNT,
        null,  // private key file should be passed here if using JWT authentication
        'process.env.API_SECRET',
        ['https://www.googleapis.com/auth/calendar']
      );
        console.log(auth);

      const calendar = google.calendar({ version: 'v3', auth });

      const event = {
        summary: eventName,
        description: `A session for ${eventName} with ${speakerEmail}`,
        start: {
          dateTime: `${eventDate}T${timeSlot}:00`, 
          timeZone: 'Asia/Kolkata', 
        },
        end: {
          dateTime: `${eventDate}T${String(parseInt(timeSlot.slice(0, 2)) + 1).padStart(2, '0')}:00:00`,
          timeZone: 'Asia/Kolkata', 
        },
        attendees: [
          { email: userEmail },
          { email: speakerEmail },
        ],
      };

      try {
        const calendarEvent = await calendar.events.insert({
          calendarId: 'primary', // Use your calendar ID
          resource: event,
          sendUpdates: 'all', // Notify attendees
        });
        console.log('Google Calendar event created:', calendarEvent.data.htmlLink);

        res.send('Session booked successfully, and confirmation emails with calendar invites sent.');
      } catch (calendarErr) {
        console.error('Error creating Google Calendar event:', calendarErr);
        res.status(500).send('Error creating Google Calendar event.');
      }

    });
  });
};

  


  








exports.listSessions = (req, res) => {
    const { speakerId, date } = req.query;
  
    // Base query
    let query = 'SELECT * FROM Sessions';
    const params = [];
  
    if (speakerId || date) {
      query += ' WHERE';
      if (speakerId) {
        query += ' speakerId = ?';
        params.push(speakerId);
      }
      if (date) {
        query += params.length ? ' AND date = ?' : ' date = ?';
        params.push(date);
      }
    }
  
    db.query(query, params, (err, results) => {
      if (err) return res.status(500).send('Error fetching sessions.');
      res.json(results);
    });
  };
  
