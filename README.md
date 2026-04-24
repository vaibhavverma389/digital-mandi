# 🌾 AI-Driven Smart Agriculture Marketplace (Digital Mandi)

A scalable full-stack web application that connects farmers and traders directly, eliminating middlemen and improving price transparency using AI-powered insights.

---

## 🚀 Overview

Digital Mandi is an intelligent agriculture marketplace that enables farmers to sell crops directly while allowing traders to bid in real-time. The platform integrates AI for crop quality grading and price prediction, ensuring fair and data-driven trade decisions.

---

## ✨ Key Features

### 🧑‍🌾 Farmer Features

* Direct crop listing to marketplace
* AI-based crop quality grading (image analysis)
* Smart price prediction based on crop & quality
* Real-time bid management (accept/reject)
* Secure deal closure with controlled data sharing

### 💼 Trader Features

* Browse AI-verified crop listings
* Place bids in real-time
* Track bids (pending, accepted, rejected)
* Access seller details only after bid acceptance

---

## 🛠️ Tech Stack

### Frontend

* React.js (Vite)
* Tailwind CSS
* Framer Motion
* Axios

### Backend

* Node.js
* Express.js
* MongoDB (Mongoose)
* JWT Authentication & Bcrypt
* MVC Architecture

### AI Integration

* Google Gemini API (for crop grading & pricing logic)
* ImageKit (cloud image storage)

---

## 🧠 Key Highlights

* Implemented **role-based authentication (RBAC)** for secure access
* Designed **RESTful APIs** for scalable backend architecture
* Integrated **AI-driven decision-making** for crop grading and pricing
* Ensured **data privacy** by restricting sensitive information access
* Optimized database queries for better performance

---

## ⚙️ Installation & Setup

### Prerequisites

* Node.js
* MongoDB (Local / Atlas)
* Python (for AI services)

---

### Clone Repository

```bash
git clone https://github.com/vaibhavverma389/digital-mandi
cd digital-mandi
```

---

### Backend Setup

```bash
cd backend
npm install
```

Create `.env` file:

```env
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_secret
GEMINI_API_KEY=your_api_key
IMAGEKIT_PUBLIC_KEY=your_key
IMAGEKIT_PRIVATE_KEY=your_key
IMAGEKIT_URL_ENDPOINT=your_url
```

Run backend:

```bash
npm run dev
```

---

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

## 📁 Project Structure

```bash
backend/
 ├── controllers/
 ├── models/
 ├── routes/
 ├── middleware/
 ├── ai/
 └── server.js

frontend/
 ├── components/
 ├── pages/
 ├── lib/
 └── App.jsx
```

---

## 🔒 Security

* Role-Based Access Control (RBAC)
* JWT-based authentication
* Sensitive data protection (shown only after deal confirmation)

---

## 🌐 Live Demo

👉 https://digital-mandi-vaibhav.vercel.app/

---

## 🤝 Contribution

Contributions are welcome! Feel free to open issues or submit pull requests.

---

## 📌 Author

**Vaibhav Verma**
Aspiring Software Engineer | Full Stack Developer

