# 🌍 AI Travel Planner

An intelligent, full-stack web application that takes the hassle out of trip planning. By leveraging Google's Gemini AI and live flight data from RapidAPI, this platform generates highly personalized travel itineraries, complete with estimated budgets, daily activity breakdowns, and real-time flight options.

## ✨ Key Features
* **🤖 AI-Powered Itineraries:** Generates complete day-by-day travel plans, activity suggestions, and budget estimates using the Google Gemini 2.5 Flash model based on user preferences (destination, days, budget, interests).
* **✈️ Real-Time Flight Search:** Integrates with RapidAPI (Sky Scrapper) to fetch live flight availability, prices, and complex nested airport IDs dynamically.
* **🗺️ Interactive Mapping:** Utilizes the official `@vis.gl/react-google-maps` API with Advanced Markers to visualize routes, destinations, and points of interest dynamically.
* **🔐 Secure User Authentication:** Full login and registration system using JWT (JSON Web Tokens), `localStorage` persistence, and secure password hashing.
* **💾 Trip Management:** Users can save, view, and manage their generated trips in a personalized dashboard connected to a MongoDB Atlas database.
* **🔗 Trip Sharing & Invites:** Share itineraries and invite collaborators seamlessly using dynamic routing and automated live-URL generation via NodeMailer.

## 🛠️ Tech Stack

**Frontend:**
* React (Vite)
* React Router DOM
* Tailwind CSS
* Axios (API Client with Token Interceptors)
* Deployed on **Vercel**

**Backend:**
* Node.js & Express.js
* MongoDB & Mongoose (Atlas)
* JWT Authentication & NodeMailer
* Deployed on **Render**

**Third-Party APIs:**
* Google Gemini API (`@google/generative-ai`)
* RapidAPI - Sky Scrapper (Live Flights)
* Google Maps API (Advanced Markers)
* Cloudinary (Image Management)

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
