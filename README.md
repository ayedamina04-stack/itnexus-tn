# ITNEXUS TN 
### Tunisia's IT News & Events Platform

ITNEXUS TN is a full-stack web application designed to bring Tunisia's technology community together through tech news, articles, events, workshops, and networking opportunities.

The platform aims to provide a central space where technology enthusiasts can discover information, explore upcoming events, and interact with the community.

## ✨ Features

### 📰 Articles & Tech News
- Browse technology articles and news.
- Search articles by keywords.
- Filter articles by category.
- Like and save articles.
- Read and post comments.

### 📅 Events
- Browse upcoming technology events.
- Search and filter events.
- View event details, dates, locations, and capacity.
- Like and save events.
- Register for events and cancel registrations.
- Add comments to events.

### 🔐 Authentication
- User registration and login.
- Password hashing with bcrypt.
- JWT-based authentication.
- HTTP-only authentication cookies.
- Protected routes and role-based authorization.

### 🛡️ Backend Security
- Helmet HTTP security headers.
- CORS configuration.
- Rate limiting.
- Request body size limits.
- Centralized error handling.

## 🛠️ Technologies

| Area | Technologies |
|---|---|
| Frontend | React, JavaScript, Vite |
| Routing | React Router |
| UI & Icons | CSS, Lucide React |
| HTTP Requests | Axios |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Authentication | JWT, bcrypt |
| Security | Helmet, CORS, Express Rate Limit |
| Version Control | Git & GitHub |

## 🏗️ Project Architecture

```text
it-news-events/
│
├── backend/
│   ├── config/
│   ├── controller/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── public/
│   ├── app.js
│   └── package.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   ├── Home.jsx
│   │   └── main.jsx
│   └── package.json
│
└── README.md
```

## 🚀 Getting Started

### Prerequisites

Make sure you have installed:
- Node.js
- npm
- MongoDB Atlas account or a MongoDB instance

### 1. Clone the repository

```bash
git clone https://github.com/ayedamina04-stack/formation-js.git
cd formation-js
```

### 2. Configure the backend

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` directory:

```env
PORT=5000
mongo_uri=YOUR_MONGODB_CONNECTION_STRING
CLIENT_URL=http://localhost:5173
JWT_SECRET=YOUR_SECRET_KEY
```

Replace the placeholder values with your own configuration. Never commit your `.env` file.

Start the backend:

```bash
npm start
```

The API will run at:

`http://localhost:5000`

For development with automatic server restarts:

```bash
npm run dev
```

### 3. Configure the frontend

Open another terminal:

```bash
cd frontend
npm install
```

Start the development server:

```bash
npm run dev
```

The frontend will normally be available at:

`http://localhost:5173`

### 4. Build the frontend

To generate an optimized production build:

```bash
npm run build
```

To check code quality:

```bash
npm run lint
```

## 🔌 API Overview

The Express backend exposes the following main route groups:

| Route | Purpose |
|---|---|
| `/auth` | Authentication |
| `/users` | User management |
| `/articles` | Articles and interactions |
| `/evenements` | Events and registrations |

The backend communicates with MongoDB through Mongoose.

## 🧪 Current Project Status

The current version includes:
- React frontend with Home, Articles, Events, Login, and Registration pages.
- Express REST API.
- MongoDB integration.
- Authentication and authorization middleware.
- Article and event management endpoints.
- Article and event interaction endpoints.
- Local development setup.

Some demonstration content and frontend interactions are temporary and are not persisted in MongoDB. The project is still under development.

## 🔮 Future Improvements

- User dashboard and profile management.
- Admin and author dashboards.
- Complete content management interface.
- Persistent user favorites and personalized content.
- Improved validation and automated testing.
- Production deployment.
- UI/UX improvements and responsive testing.

## 👩‍💻 Author

**Amina Ayed**

Third-Year Bachelor's Student in Management Information Systems (MIS)

Interested in Full-Stack Development, Web Technologies, and Business Intelligence.

📧 **Email:** [ayedamina04@gmail.com](mailto:ayedamina04@gmail.com)

💼 **LinkedIn:** [Connect with me](https://www.linkedin.com/in/amina-ayed-b73aa3280/)

🐙 **GitHub:** [ayedamina04-stack](https://github.com/ayedamina04-stack)
*Built as a learning and development project to explore full-stack web development and create a platform for Tunisia's technology community.*