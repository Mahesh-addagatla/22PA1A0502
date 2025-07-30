# Full Stack URL Shortener (22pa1a0502)

## 📌 Overview

This is a full stack microservice-based URL Shortener application built for the Affordmed Campus Hiring Evaluation. It allows users to generate short URLs with custom shortcodes, ensures uniqueness, supports redirection, and includes a reusable logging middleware integrated across both frontend and backend.

---

## 🧩 Project Structure

22pa1a0502/
├── logging-middleware/ # Reusable logging utility for frontend & backend
│ └── logger.js
├── backend-test-submission/ # Node.js + Express API service
│ └── src/
│ ├── controllers/
│ ├── routes/
│ ├── db/
│ ├── middlewares/
│ └── index.ts
├── frontend-test-submission/ # React frontend using TypeScript
│ └── src/
│ ├── pages/
│ ├── components/
│ └── App.tsx
└── README.md


---

## 🚀 Features

### 🔧 Backend (Node.js + Express)
- Accepts a long URL and custom shortcode via `/api/shorten`
- Checks for shortcode uniqueness
- Redirects via `/:shortcode`
- In-memory URL store (can be extended to a DB)
- Logs all events (info, error, fatal, etc.)

### 🖼️ Frontend (React)
- Simple UI to input a URL and a custom shortcode
- Sends requests to backend and shows shortened link
- Redirect page that auto-resolves shortcode
- Responsive on both desktop and mobile
- Logs all user interactions and errors

### 📒 Logging Middleware
- Common utility `Log(stack, level, package, message)`
- Logs sent to: `http://20.244.56.144/evaluation-service/logs`
- Token is auto-fetched and cached
- Strict validation of stack, level, and package
- Integrated in both backend and frontend

---

## 🔐 Test Server Authentication

This app authenticates with the Affordmed test server using credentials from `.env`. It dynamically fetches and caches the Bearer token using:

POST http://20.244.56.144/evaluation-service/auth


Logs are sent to:

POST http://20.244.56.144/evaluation-service/logs


---

## 💻 Tech Stack

| Layer        | Technology           |
|--------------|----------------------|
| Frontend     | React, TypeScript    |
| Styling      | Vanilla CSS          |
| Backend      | Node.js, Express     |
| Auth/Token   | Axios, dotenv        |
| Logging      | Custom JS Middleware |
| Dev Tools    | Postman, Git         |


## 🏁 Getting Started

### 📦 Backend
```bash
cd backend-test-submission
npm install
npm run dev   # or nodemon src/index.ts
```
### 📦 Backend
```bash
cd frontend-test-submission
npm install
npm start
```

