# Giphy Explorer

A full-stack application for exploring and interacting with GIFs from Giphy. Built with React, TypeScript, Node.js, and Express.

## Features

- Search and browse GIFs from Giphy
- User authentication and authorization
- Rate and comment on GIFs
- Responsive design with Tailwind CSS
- Real-time updates for ratings and comments

## Tech Stack

### Frontend
- React 18
- TypeScript
- Tailwind CSS
- React Router
- Axios
- Heroicons

### Backend
- Node.js
- Express
- TypeScript
- MongoDB with Mongoose
- JWT Authentication
- Joi Validation
- Rate Limiting

## Prerequisites

- Node.js (v16 or higher)
- MongoDB
- Giphy API Key

## Setup

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd giphy-explorer
   ```

2. Install dependencies:
   ```bash
   # Frontend
   cd frontend
   npm install

   # Backend
   cd ../backend
   npm install
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env` in both frontend and backend directories
   - Update the values in `.env` files with your configuration

4. Start the development servers:
   ```bash
   # Backend
   cd backend
   npm run dev

   # Frontend
   cd frontend
   npm run dev
   ```

## API Documentation

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### GIFs
- `GET /api/gifs/search` - Search GIFs
- `GET /api/gifs/:id` - Get GIF by ID
- `GET /api/gifs/trending` - Get trending GIFs

### Ratings
- `POST /api/ratings` - Create/update rating
- `GET /api/ratings/:gifId` - Get ratings for a GIF
- `DELETE /api/ratings/:gifId` - Delete rating

### Comments
- `POST /api/comments` - Create comment
- `GET /api/comments/gif/:gifId` - Get comments for a GIF
- `PUT /api/comments/:id` - Update comment
- `DELETE /api/comments/:id` - Delete comment

## Development

### Code Style
- Follow TypeScript best practices
- Use ESLint and Prettier for code formatting
- Write meaningful commit messages

## Security

- JWT-based authentication
- Rate limiting
- Input validation
- CORS configuration
- Helmet security headers  
