# 🌾 Digital Mandi — AI-Driven Smart Agriculture Marketplace

[![React](https://img.shields.io/badge/Frontend-React%2019%20%7C%20Vite%208-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TailwindCSS](https://img.shields.io/badge/Styling-Tailwind%20CSS%20v4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Node.js](https://img.shields.io/badge/Backend-Node.js%20%7C%20Express%205-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB%20%7C%20Mongoose%209-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Gemini](https://img.shields.io/badge/AI-Google%20Gemini%201.5%20Flash-4285F4?logo=google&logoColor=white)](https://ai.google.dev/)
[![License](https://img.shields.io/badge/License-ISC-blue.svg)](LICENSE)

> A modern full-stack agri-tech marketplace bridging the gap between farmers and traders. Digital Mandi eliminates traditional middlemen, offers AI-powered crop quality grading and dynamic price forecasting, and secures transactions through a controlled, privacy-first bidding workflow.

🌐 **Live Demo:** [digital-mandi-vaibhav.vercel.app](https://digital-mandi-vaibhav.vercel.app/)  
📂 **Repository:** [github.com/vaibhavverma389/digital-mandi](https://github.com/vaibhavverma389/digital-mandi)

---

## 📑 Table of Contents

- [Overview](#-overview)
- [System Architecture](#-system-architecture)
- [Key Features](#-key-features)
  - [🧑‍🌾 Farmer Portal](#-farmer-portal)
  - [💼 Trader Portal](#-trader-portal)
  - [🤖 AI Engine](#-ai-engine)
- [Tech Stack](#-tech-stack)
- [API Reference](#-api-reference)
- [Database Models](#-database-models)
- [Security & Privacy](#-security--privacy)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Backend Setup](#backend-setup)
  - [Frontend Setup](#frontend-setup)
- [Folder Structure](#-folder-structure)
- [Author & Acknowledgments](#-author--acknowledgments)

---

## 🚀 Overview

In conventional agricultural trade, smallholder farmers often face high middleman commissions, asymmetric market information, and subjective quality evaluation. **Digital Mandi** solves these pain points by offering:

1. **Direct Market Access:** Farmers publish harvest listings directly to verified wholesale traders across India.
2. **AI Quality Assessment & Fair Pricing:** Gemini 1.5 Flash models assess crop quality grades and evaluate market fair prices per quintal, reinforced with deterministic heuristic fallback algorithms.
3. **Transparent Bidding & Controlled Privacy:** Real-time offer submissions where contact information is shielded until a deal is officially accepted by the farmer.

---

## 🏛️ System Architecture

```text
       ┌────────────────────────────────────────────────────────┐
       │                   React 19 + Vite                      │
       │         (Tailwind CSS v4 + Framer Motion UI)           │
       └──────────────┬────────────────────────▲────────────────┘
                      │ REST API               │ JWT Bearer Token
                      ▼                        │
       ┌────────────────────────────────────────────────────────┐
       │                Express 5 / Node.js API                 │
       │        (Auth, Role Middleware, Multer, ImageKit)       │
       └──────┬───────────────────┬────────────────────┬────────┘
              │                   │                    │
              ▼                   ▼                    ▼
     ┌─────────────────┐ ┌─────────────────┐ ┌───────────────────┐
     │ MongoDB Atlas   │ │ ImageKit CDN    │ │ Python AI Engine  │
     │ Users, Crops,   │ │ Optimized Cloud │ │ Gemini 1.5 API +  │
     │ Bids Collections│ │ Image Hosting   │ │ Heuristic Fallback│
     └─────────────────┘ └─────────────────┘ └───────────────────┘
```

---

## ✨ Key Features

### 🧑‍🌾 Farmer Portal
* **One-Click Crop Listing:** List crop varieties, harvest quantities (quintals), and target prices with image uploads.
* **Instant AI Verification:** Automatically grades produce (`Grade A (Premium)`, `Grade B (Standard)`, or `Grade C (Low Quality)`) and suggests dynamic market rates.
* **Bid Lifecycle Management:** Monitor incoming bids, view trader offers, and accept or reject bids in one click.
* **Automated Settlement Logic:** Accepting an offer automatically marks the crop status as `sold` and auto-rejects competing pending bids.
* **Direct Trader Contact:** Reveals verified trader contact and phone details only after deal confirmation.

### 💼 Trader Portal
* **Live Marketplace Discovery:** Browse available listings with real-time text query filtering (crop type, location, quality tier).
* **AI Quality Badges:** Inspect crop condition, certified AI grading confidence scores, and seller location before placing bids.
* **Interactive Bidding:** Submit bids per quintal; monitor active bid states (`pending`, `accepted`, `rejected`) in an intuitive dashboard.
* **Deal Completion:** Instantly unlock farmer contact details once a bid is accepted to finalize logistics and payment.

### 🤖 AI Engine
* **Dual-Tier AI Pipeline:** Uses Python micro-processes powered by Google Gemini 1.5 Flash via REST endpoints.
* **Fault-Tolerant Heuristic Fallback:** If API limits or connectivity issues occur, built-in algorithmic pricing (volatility + volume discount calculation) and simulated inspection engines maintain 100% operational uptime.

---

## 🛠️ Tech Stack

### Frontend
* **Core:** React 19, Vite 8, JavaScript (ES Modules)
* **Styling & Motion:** Tailwind CSS v4 (`@tailwindcss/vite`), Framer Motion
* **Routing & HTTP:** React Router DOM v7, Axios (with request/response interceptors for token handling)
* **Icons:** Lucide React

### Backend
* **Runtime:** Node.js, Express.js 5
* **Database:** MongoDB, Mongoose 9 (ODM)
* **Authentication:** JSON Web Tokens (JWT), Bcrypt.js password hashing
* **File Processing & Media:** Multer (Memory Storage), ImageKit SDK
* **AI Subsystem:** Python 3 (`child_process.spawn`), Google Gemini 1.5 Flash API

---

## 📡 API Reference

### Authentication (`/api/auth`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | Public | Register new user (`Farmer`, `Trader`, `Admin`) |
| `POST` | `/api/auth/login` | Public | Authenticate user & return JWT token |

### Crops (`/api/crops`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/crops` | Private (Farmer) | Upload image & create new crop listing |
| `GET` | `/api/crops` | Public | Fetch available crops (supports `search`, `type`, `max_price`) |
| `GET` | `/api/crops/farmer` | Private (Farmer) | Fetch crops belonging to authenticated farmer |
| `PUT` | `/api/crops/:id/status`| Private (Admin) | Update crop availability status |

### Bids (`/api/bids`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/bids` | Private (Trader) | Submit a bid for a specific available crop |
| `GET` | `/api/bids/crop/:crop_id` | Private (Farmer/Admin) | View all bids placed on a crop |
| `GET` | `/api/bids/farmer` | Private (Farmer) | Get all incoming bids across all owned listings |
| `GET` | `/api/bids/trader` | Private (Trader) | Get bidding history and deal states for trader |
| `PUT` | `/api/bids/:id/status` | Private (Farmer) | Accept or reject a bid (auto-closes other bids) |

### AI Services (`/api/ai`)
| Method | Endpoint | Access | Description |
|---|---|---|---|
| `POST` | `/api/ai/quality-check` | Private | Run Gemini vision / text model quality assessment |
| `POST` | `/api/ai/predict-price` | Private | Forecast suggested market price per quintal |

---

## 🗄️ Database Models

* **User:** `name`, `email` (unique), `password` (hashed), `role` (`Farmer` | `Trader` | `Admin`), `location`, `phone`.
* **Crop:** `farmer_id` (ref User), `type`, `quantity`, `expected_price`, `suggested_price`, `photos`, `quality_score`, `status` (`available` | `sold` | `pending_verification`).
* **Bid:** `crop_id` (ref Crop), `trader_id` (ref User), `bid_amount`, `status` (`pending` | `accepted` | `rejected`).

---

## 🔒 Security & Privacy

* **Stateless JWT Authorization:** Protected routes enforce Bearer token verification with automatic logout on token expiration via Axios interceptors.
* **Role-Based Access Control (RBAC):** Restricts crop listing mutations to Farmers and bid submissions to Traders.
* **Double-Blind Contact Privacy:** Phone numbers and email addresses remain obfuscated between parties until a bid is explicitly accepted.
* **Sanitized Inputs & Secure Hashing:** Salted passwords via `bcryptjs` and Mongoose schema validations prevent injection attacks.

---

## ⚙️ Getting Started

### Prerequisites
* [Node.js](https://nodejs.org/) (v18 or higher recommended)
* [MongoDB](https://www.mongodb.com/) (Local instance or MongoDB Atlas URI)
* [Python 3.x](https://www.python.org/) (for AI execution scripts)

---

### Backend Setup

1. **Navigate to the backend folder:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables:**
   Create a `.env` file in the `backend/` directory:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key

   # AI Integration (Optional: fallback simulation runs if omitted)
   GEMINI_API_KEY=your_gemini_api_key

   # Image Storage (Optional)
   IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
   IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
   IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint
   ```

4. **Start the backend server:**
   ```bash
   npm run dev
   # or
   node server.js
   ```
   *Server runs at `http://localhost:5000`.*

---

### Frontend Setup

1. **Navigate to the frontend folder:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure environment variables (optional for local):**
   Create a `.env` file in the `frontend/` directory if connecting to a custom backend URL:
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

4. **Launch development server:**
   ```bash
   npm run dev
   ```
   *Frontend starts at `http://localhost:5173`.*

---

## 📁 Folder Structure

```text
digital-mandi/
├── backend/
│   ├── ai/
│   │   ├── price_predictor.py     # Gemini & heuristic crop pricing logic
│   │   └── quality_checker.py     # Gemini quality grading script
│   ├── controllers/
│   │   ├── aiController.js        # Child process execution bridge
│   │   ├── authController.js      # JWT registration and login
│   │   ├── bidController.js       # Bidding lifecycle & deal closure
│   │   └── cropController.js      # Crop CRUD & ImageKit integration
│   ├── middleware/
│   │   └── auth.js                # JWT verification & RBAC authorization
│   ├── models/
│   │   ├── bid.model.js           # Bid schema
│   │   ├── crop.model.js          # Crop schema
│   │   └── user.model.js          # User schema
│   ├── routes/
│   │   ├── ai.routes.js
│   │   ├── auth.routes.js
│   │   ├── bids.routes.js
│   │   └── crops.routes.js
│   ├── server.js                  # Express application entrypoint
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── Navbar.jsx         # Responsive navigation bar
│   │   ├── lib/
│   │   │   └── api.js             # Axios client with auth interceptors
│   │   ├── pages/
│   │   │   ├── FarmerDashboard.jsx # Crop listing, AI grading & bid manager
│   │   │   ├── Home.jsx           # Landing page with hero & feature showcase
│   │   │   ├── Login.jsx          # User login
│   │   │   ├── Register.jsx       # User registration with role selection
│   │   │   └── TraderDashboard.jsx # Marketplace exploration & live bidding
│   │   ├── App.jsx                # Route definitions
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
└── README.md
```

---

## 👨‍💻 Author

**Vaibhav Verma**  
*Full Stack Developer | Software Engineer*  
- **GitHub:** [@vaibhavverma389](https://github.com/vaibhavverma389)  
- **Live Project:** [Digital Mandi](https://digital-mandi-vaibhav.vercel.app/)
