# School Equipment Lending Portal

A full-stack web application for managing school equipment lending, built with React, Node.js, and MongoDB.

## Project Overview

The School Equipment Lending Portal is a comprehensive system that enables schools to manage their equipment lending process efficiently. It allows staff to track equipment, manage borrowing requests, and maintain an inventory of school resources.

## Features

- User authentication and authorization
- Equipment management (add, update, delete, search)
- Borrow request management
- Dashboard for monitoring equipment status
- Role-based access control

## Tech Stack

### Frontend
- React
- Vite
- Context API for state management
- Axios for API communication

### Backend
- Node.js
- Express.js
- MongoDB (with Mongoose)
- JWT for authentication
- Swagger for API documentation

## Project Structure

```
├── frontend/               # React frontend application
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/        # Page components
│   │   ├── context/      # React Context providers
│   │   └── api/          # API integration
│
├── backend/               # Node.js backend application
│   ├── src/
│   │   ├── controllers/  # Request handlers
│   │   ├── middleware/   # Custom middleware
│   │   ├── models/      # Database models
│   │   └── routes/      # API routes
│   └── test/            # Backend tests
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/roshanjson/school-equipment-lending-portal.git
cd school-equipment-lending-portal
```

2. Install backend dependencies:
```bash
cd backend
npm install
```

3. Install frontend dependencies:
```bash
cd ../frontend
npm install
```

### Running the Application

1. Start the backend server:
```bash
cd backend
npm start
```

2. Start the frontend development server:
```bash
cd frontend
npm run dev
```

The application will be available at `http://localhost:5173` (frontend) and `http://localhost:5000` (backend API).

## Testing

Run backend tests:
```bash
cd backend
npm test
```

## API Documentation

The API documentation is available through Swagger UI at `http://localhost:5000/api-docs` when running the backend server.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.
