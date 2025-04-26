# FreelanceHub - Freelancing Platform

FreelanceHub is a modern, full-stack freelancing platform that connects talented freelancers with clients seeking professional services. Built with React for the frontend and Node.js/Express for the backend, it provides a seamless experience for both freelancers and clients.

## 🌟 Features

### For Freelancers
- **Professional Profile Creation**
  - Customizable portfolio showcase
  - Skill highlighting
  - Professional background details
  - Hourly rate setting
  - Profile picture upload

- **Project Management**
  - Browse available projects
  - Submit proposals
  - Track ongoing projects
  - Manage orders through dashboard
  - Secure payment reception

### For Clients
- **Project Posting**
  - Detailed project description
  - Budget setting
  - Required skills specification
  - Project timeline definition

- **Freelancer Selection**
  - Browse freelancer profiles
  - Review portfolios and ratings
  - Direct messaging system
  - Proposal review system

### General Features
- **User Authentication**
  - Secure login/registration
  - Role-based access control
  - Password recovery system
  - Email verification

- **Search and Discovery**
  - Advanced freelancer search
  - Project category filtering
  - Skill-based matching
  - Portfolio browsing

- **Payment System**
  - Secure payment processing
  - Multiple payment methods
  - Payment milestone tracking
  - Escrow system for security

- **Communication**
  - Real-time messaging
  - Project discussion board
  - File sharing capabilities
  - Notification system

## 🚀 Technology Stack

### Frontend
- React.js
- React Router for navigation
- Context API for state management
- CSS3 for styling
- Responsive design for all devices

### Backend
- Node.js
- Express.js
- MongoDB for database
- JWT for authentication
- Bcrypt for password hashing

### Security Features
- Password encryption
- JWT token authentication
- Secure payment processing
- Input validation
- XSS protection

## 📦 Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/HunainMulla/Freelancing_Website_v2.git
   ```

2. Install frontend dependencies:
   ```bash
   cd frontend
   npm install
   ```

3. Install backend dependencies:
   ```bash
   cd backend
   npm install
   ```

4. Set up environment variables:
   Create `.env` files in both frontend and backend directories with necessary configurations.

5. Start the development servers:
   ```bash
   # Start backend server
   cd backend
   npm start

   # Start frontend server
   cd frontend
   npm start
   ```

## 🔧 Configuration

### Backend Environment Variables
```env
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=your_stripe_secret
```

### Frontend Environment Variables
```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_STRIPE_PUBLIC_KEY=your_stripe_public_key
```

## 🌐 API Endpoints

### Authentication
- POST `/api/auth/register` - User registration
- POST `/api/auth/login` - User login
- POST `/api/auth/forgot-password` - Password recovery

### Users
- GET `/api/users/profile` - Get user profile
- PUT `/api/users/profile` - Update user profile
- POST `/api/users/portfolio` - Add portfolio item

### Projects
- GET `/api/projects` - List all projects
- POST `/api/projects` - Create new project
- GET `/api/projects/:id` - Get project details
- PUT `/api/projects/:id` - Update project
- DELETE `/api/projects/:id` - Delete project

### Proposals
- POST `/api/proposals` - Submit proposal
- GET `/api/proposals/user` - Get user's proposals
- PUT `/api/proposals/:id` - Update proposal

## 👥 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Support

For support, email hunainmulla786@gmail.com or open an issue in the repository.

## 🙏 Acknowledgments

- Thanks to all contributors who have helped shape FreelanceHub
- Special thanks to the open-source community for the amazing tools and libraries 