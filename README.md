# FreelancePro - MERN Stack Freelancing Platform

A full-stack freelancing platform built with the MERN stack (MongoDB, Express.js, React.js, Node.js) that allows freelancers and clients to connect, post jobs, and collaborate on projects.

## Features

- User authentication (Register/Login)
- Role-based access (Client/Freelancer)
- Job posting and management
- Job search and filtering
- User profiles
- Job application system
- Real-time status updates

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- npm or yarn package manager

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd freelance-platform
```

2. Install dependencies for the entire project:
```bash
npm run install-all
```

3. Create a `.env` file in the backend directory with the following variables:
```
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
```

## Running the Application

1. Start both frontend and backend servers:
```bash
npm start
```

This will start:
- Backend server on http://localhost:5000
- Frontend development server on http://localhost:3000

## Project Structure

```
freelance-platform/
├── backend/             # Backend server
│   ├── models/         # Database models
│   ├── routes/         # API routes
│   ├── middleware/     # Custom middleware
│   └── server.js       # Server entry point
├── frontend/           # React frontend
│   ├── public/
│   └── src/
│       ├── components/ # React components
│       ├── context/    # Context providers
│       └── App.js      # Main app component
└── package.json        # Project configuration
```

## API Endpoints

### Authentication
- POST /api/auth/register - Register a new user
- POST /api/auth/login - Login user

### Jobs
- GET /api/jobs - Get all jobs
- GET /api/jobs/:id - Get specific job
- POST /api/jobs - Create new job
- PATCH /api/jobs/:id/status - Update job status
- POST /api/jobs/:id/apply - Apply for a job

### Users
- GET /api/users/profile - Get user profile
- PATCH /api/users/profile - Update user profile

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is licensed under the ISC License. 