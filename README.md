# Proactively-Assignment-Submission



Welcome to the **Proactively Assignment Submission** project! This guide will help you set up and run the project on your local machine.

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/RebekahZx/Proactively-Assignment-Submission.git
   cd <where-you-have-cloned>
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## Environment Variables

Create a `.env` file in the root directory and include the following configuration:

```plaintext
# Database Configuration
DB_PASSWORD=<your-database-password>

# Google Calendar API
GOOGLE_CALENDAR_API_KEY=<your-google-calendar-api-key>

# Application Settings
PORT=<port-number>
JWT_SECRET=<your-jwt-secret>

# Email Configuration
EMAIL_USER=<your-email-address>
EMAIL_PASSWORD=<your-email-password>
TEST_MAIL=<test-email-address>
APP_PASS=<your-app-password>

# Note: For simplicity, the last four fields (EMAIL_USER, EMAIL_PASSWORD, TEST_MAIL, APP_PASS) can use the same email credentials.
```

## Running the Project

Start the server with the following command:
```bash
npm start
```

The application will run on the port specified in the `.env` file.

## API Documentation

Explore and test the APIs using Postman:
https://documenter.getpostman.com/view/40246910/2sAYBd98w1

## Key Features

- **Dependency Management:** Easily install all required dependencies with `npm install`.
- **Environment Configuration:** Flexible `.env` setup to handle sensitive data securely.
- **Postman Collection:** Prebuilt API tests for validation and debugging.

## Additional Notes

- Ensure that you have a working database connection before running the project.
- Test the Google Calendar integration using the provided API key.
- For email functionalities, ensure that your email provider supports app-specific passwords.

