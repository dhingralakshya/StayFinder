# StayFinder

StayFinder is a full-stack web application inspired by Airbnb, designed to allow users to list and book properties for short-term or long-term stays. This project demonstrates a functional prototype with a modern React frontend, a Node.js/Express backend, and a PostgreSQL database.

---

## Project Details

- Frontend: React.js with React Router, CSS Modules for styling, and JWT-based authentication.
- Backend: Node.js with Express framework, RESTful API endpoints for user authentication, listings, and bookings.
- Database: PostgreSQL with Sequelize ORM, including models for Users, Listings, and Bookings.
- Authentication: JWT-based secure login and role-based access control (guest, host).
- Features:
    - Property listing and search with filters (location, price).
    - Detailed listing pages with image galleries and descriptions.
    - User registration and login with role management.
    - Host dashboard for managing listings.
    - Booking system with reservation creation.
- Deployment: Dockerized setup with separate containers for frontend, backend, and database, orchestrated via Docker Compose.

---

## Tech Stack

- React.js
- Node.js
- Express.js
- PostgreSQL
- Sequelize ORM
- JWT for authentication
- Docker & Docker Compose
- Nginx (for serving React frontend in production)

---

## Installation and Setup

### Clone the Repository

```bash
git clone https://github.com/dhingralakshya/StayFinder.git
cd StayFinder
```

### Environment Variables
Create a .env file in the server directory with the following variables:

```
jwtPrivateKey=your_jwt_secret
DB_PORT=5432
DB_NAME=stayfinderDB
DB_USER=your_db_user
DB_PASSWORD=your_db_pass
DB_HOST=localhost
IMAGEKIT_PUBLIC_KEY=public_key_imageKit
IMAGEKIT_PRIVATE_KEY=private_key_imageKit
IMAGEKIT_URL_ENDPOINT=url_endpoint
```

Create a .env file in the client directory with the following variables:

```
REACT_APP_API_URL=http://localhost:4000
```


### Running with Docker Compose
From the root directory, run:
```bash
docker-compose up --build
```

### Running Locally Without Docker
Backend
1. Navigate to the server directory and install dependencies:
```bash
cd server
npm install
```

2. Run migrations and seeders:
```bash
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all
```

3. Start the backend server:
```bash
nodemon server.js or node src/server.js
```

Frontend
1. Navigate to the client directory and install dependencies:
```bash
cd client
npm install
```

2. Start the React development server:
```bash
npm start
```

### Additional Notes
- Ensure your backend server is running before starting the frontend to avoid API errors.
- For production deployment, the React app is served via Nginx in the Docker setup.
- Passwords in seed data are bcrypt hashed for security.
- To enable image uploads, you must add your own ImageKit API keys to the `.env` file in the server directory. Without these, you cannot use image upload feature, but you can still view seeded images.