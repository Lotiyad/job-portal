# Job Portal Web Application

A full-stack Job Portal System where job seekers can apply for jobs, employers can post and manage jobs, and an admin oversees the platform.

Built using the MERN Stack (MongoDB, Express, React, Node.js).

 ## Features
### Job Seeker

Register and log in

Browse available jobs

View detailed job descriptions

Apply for jobs

Track application status

### Employer

Register and log in

Post new job listings

Edit or delete job posts

View applicants for each job

Update applicant status (Pending, accepted, Rejected)

### Admin

Manage all users (job seekers & employers)

View all job postings and users

Remove inappropriate or expired jobs

Monitor platform activity

## 🛠 Tech Stack
### Frontend (job-portal-frontend)

React.js

React Router DOM

Axios

Context API (Authentication & Role Management)

### Backend (job-portal-api)

Node.js

Express.js

MongoDB + Mongoose

JWT Authentication

Bcrypt (Password Hashing)

Role-Based Access Control (Admin, Employer, Job Seeker)

## ⚙️ Installation & Setup
1️⃣ Clone the Repository
```bash
git clone https://github.com/Lotiyad/job-portal.git
cd job-portal
```
2️⃣ Setup Backend
```bash
cd job-portal-api
npm install
```


Create a .env file inside job-portal-api:
```bash

MONGO_URI=mongodb://localhost:27017/jobportal
JWT_SECRET=your_super_secret_key
PORT=5000
```


Run the backend server:
```bash
npm run dev
```

Backend runs on:
 http://localhost:5000

3️⃣ Setup Frontend

Open a new terminal:
```bash
cd job-portal-frontend
npm install
npm start
```

Frontend runs on:
 http://localhost:3000
