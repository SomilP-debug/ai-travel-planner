<div align="center">
  <h1>🌍 AI Travel Planner</h1>
  <p>An intelligent, full-stack web application that takes the hassle out of trip planning.</p>

  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
</div>

<br />

By leveraging Google's Gemini AI and live flight data from RapidAPI, this platform generates highly personalized travel itineraries, complete with estimated budgets, daily activity breakdowns, and real-time flight options.

---

## ✨ Key Features

* **🤖 AI-Powered Itineraries:** Generates complete day-by-day travel plans, activity suggestions, and budget estimates using the Google Gemini 2.5 Flash model based on user preferences.
* **✈️ Real-Time Flight Search:** Integrates with RapidAPI (Sky Scrapper) to fetch live flight availability, prices, and complex nested airport IDs dynamically.
* **🗺️ Interactive Mapping:** Utilizes the official google maps API with Advanced Markers to visualize routes, destinations, and points of interest dynamically.
* **🔐 Secure User Authentication:** Full login and registration system using JWT (JSON Web Tokens), `localStorage` persistence, and secure password hashing.
* **💾 Trip Management:** Users can save, view, and manage their generated trips in a personalized dashboard connected to a MongoDB Atlas database.
* **🔗 Trip Sharing & Invites:** Share itineraries and invite collaborators seamlessly using dynamic routing and automated live-URL generation via NodeMailer.

---

## 🛠️ Tech Stack

### **Frontend**
* React (Vite)
* React Router DOM
* Tailwind CSS
* Axios (API Client with Token Interceptors)
* ☁️ Deployed on **Vercel**

### **Backend**
* Node.js & Express.js
* MongoDB & Mongoose (Atlas)
* JWT Authentication & NodeMailer
* ☁️ Deployed on **Render**

### **Third-Party APIs**
* Google Gemini API (`@google/generative-ai`)
* RapidAPI - Sky Scrapper (Live Flights)
* Google Maps API (Advanced Markers)
* Cloudinary (Image Management)

---

## 📂 Folder Structure

```text
ai-travel-planner/
├── backend/                  # Node.js / Express Server
│   ├── controllers/          # Route logic and API handlers
│   ├── models/               # Mongoose database schemas
│   ├── routes/               # Express API routes
│   ├── middleware/           # JWT auth & validation
│   ├── .env                  # Backend environment variables
│   ├── server.js             # Main entry point
│   └── package.json          # Backend dependencies
│
├── frontend/                 # React / Vite Client
│   ├── public/               # Static assets
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/            # Main application views
│   │   ├── context/          # React context providers
│   │   ├── App.jsx           # Main React component
│   │   └── main.jsx          # React DOM render entry
│   ├── .env                  # Frontend environment variables
│   ├── vercel.json           # Vercel SPA routing config
│   ├── package.json          # Frontend dependencies
│   └── vite.config.js        # Vite configuration
│
└── README.md                 # Project documentation
```

---

## 🚀 Environment Variables

To run this project locally, create `.env` files in both your frontend and backend directories.

**Backend (`backend/.env`):**
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
GEMINI_API_KEY=your_gemini_api_key
SMTP_USER=your_email@gmail.com
SMTP_KEY=your_app_password
RAPIDAPI_KEY=your_rapidapi_key
CLIENT_URL=http://localhost:5173
```

**Frontend (`frontend/.env`):**
```env
VITE_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
VITE_API_URL=http://localhost:5000/api
```
*(Note: When deploying, `CLIENT_URL` must point to your live Vercel frontend, and `VITE_API_URL` must point to your live Render backend).*

---

## 💻 Local Development

**1. Clone the repository:**
```bash
git clone [https://github.com/SomilP-debug/ai-travel-planner.git](https://github.com/SomilP-debug/ai-travel-planner.git)
cd ai-travel-planner
```

**2. Start the Backend:**
```bash
cd backend
npm install
npm run dev
```

**3. Start the Frontend:**
Open a new terminal window:
```bash
cd frontend
npm install
npm run dev
```

---

## ☁️ Deployment Architecture

This application is architected to run with the frontend on Vercel (for fast CDN delivery and React optimization) and the backend on Render (for persistent Node.js/MongoDB connections).

1. **Backend (Render):**
   * Create a new Web Service on Render connected to your `backend` directory.
   * Ensure `0.0.0.0/0` is whitelisted in your MongoDB Atlas Network Access.
   * Add all backend `.env` variables.
2. **Frontend (Vercel):**
   * Import the repository to Vercel, pointing to the `frontend` directory.
   * Add frontend `.env` variables.
   * Ensure you have a `vercel.json` file in your frontend root directory for React Router SPA fallbacks.
   * Set `VITE_API_URL` to your newly generated Render URL (e.g., `https://your-api.onrender.com/api`).
3. **Final Link:**
   * Update the `CLIENT_URL` environment variable on Render to match your live Vercel URL.
