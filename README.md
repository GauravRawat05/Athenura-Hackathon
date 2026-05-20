# HackForge (Hackathon-Athenura) 🚀

HackForge is a comprehensive, full-stack Hackathon Management Platform designed to streamline and automate every aspect of organizing a hackathon. From participant registration and team formation to live judging, real-time analytics, automated certificate generation, and seamless payment processing.

Built by hackers, for hackers, it empowers top-tier institutions and independent organizers to host fair, scalable, and seamless events.

## ✨ Key Features

- **End-to-End Lifecycle:** Unified platform for hackathon creation, submissions, scoring, and certificate generation.
- **Solo & Team Modes:** Flexible registration supporting individual participants and collaborative team-based entries.
- **University Dashboards:** Dedicated institution portals for tracking performance and exporting analytics (perfect for university partners).
- **Advanced Judging Engine:** Configurable rubrics, weighted scores, and automated tie-breaking for fair outcomes.
- **Auto Certificates:** Participation and rank certificates generated as signed PDFs with unique QR-code public verification.
- **Payment Integration:** Razorpay-powered registration fees with real-time webhook confirmation and refund tracking.
- **Live Chat & Support:** Real-time query routing and support chat powered by Socket.IO.
- **Role-based Access:** Distinct panels and tailored workflows for Participants, Judges, Universities, and Admins.

---

## 🛠️ Technology Stack

HackForge is built on the robust **MERN** stack, supercharged with modern tooling.

### Frontend
- **React.js 19** (Vite powered)
- **Redux Toolkit** (State Management)
- **React Router v7**
- **Tailwind CSS + PostCSS** (Styling)
- **Socket.IO Client** (Real-time features)
- **Lucide React** (Icons)

### Backend
- **Node.js & Express.js 5**
- **MongoDB & Mongoose** (Database)
- **Socket.IO** (Real-time communication)
- **Puppeteer** (Dynamic PDF Certificate Generation)
- **Cloudinary** (File & Image Storage)
- **Razorpay** (Payment Gateway)
- **Nodemailer** (Email notifications)
- **Passport.js & JWT** (Authentication)

---

## 📂 Folder Structure

```text
Hackathon-Athenura/
│
├── frontend/             # React (Vite) Frontend Application
│   ├── src/
│   │   ├── components/   # Reusable UI components & layouts
│   │   ├── pages/        # Route pages (Admin, Participant, Judge, Public)
│   │   ├── routes/       # Application routing (AppRoutes.jsx)
│   │   ├── store/        # Redux store & slices
│   │   └── ...
│   ├── package.json
│   └── vite.config.js
│
├── backend/              # Express Node.js Backend API
│   ├── src/
│   │   ├── modules/      # Domain-driven feature modules (Auth, Admin, Hackathon, etc.)
│   │   ├── middleware/   # Custom Express middlewares (Role Auth, Error Handling)
│   │   ├── seedAdmin.js  # Script to initialize admin user
│   │   └── server.js     # Entry point
│   └── package.json
│
└── README.md
```

---

## 🚀 Getting Started

Follow these instructions to set up the project locally.

### Prerequisites
- Node.js (v18 or higher recommended)
- MongoDB instance (local or Atlas)
- Cloudinary Account (for image uploads)
- Razorpay Account (for payments setup - test mode)

### 1. Clone the repository
```bash
git clone https://github.com/bimalgautam1/Hackathon-Athenura.git
cd Hackathon-Athenura
```

### 2. Backend Setup
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` directory with the following necessary keys:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Email / SMTP
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password

# Razorpay
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
```
Start the backend server:
```bash
npm run dev
```
*(Optional) Seed the admin user if starting fresh:*
```bash
npm run seed:admin
```

### 3. Frontend Setup
Open a new terminal window:
```bash
cd frontend
npm install
```
Create a `.env` file in the `frontend` directory:
```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```
Start the development server:
```bash
npm run dev
```

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.
