# 🏙️ Urban IQ

**Urban IQ** is an advanced intelligence dashboard and platform designed to revolutionize how urban infrastructure issues are reported, mapped, and resolved. Built as an MVP for **Compassion-A-Thon 3.0**, Urban IQ empowers citizens, urban planners, and municipal authorities by transforming raw reports into structured, AI-analyzed, and actionable intelligence.

## 🚀 The Idea

In rapidly growing cities, critical infrastructure issues like potholes, broken streetlights, and waste mismanagement often go unnoticed or unaddressed due to fragmented reporting systems and lack of data prioritization. 

Urban IQ solves this by providing a centralized intelligence platform that focuses on:
1. **Crowdsourced Data Collection:** Allowing users to submit location-specific issues with photographic evidence and context.
2. **AI-Powered Analysis:** Leveraging Large Language Models (LLMs) to automatically assess the severity, root cause, and recommend corrective actions based on the report.
3. **Geospatial Intelligence:** Visualizing problem clusters and live incidents across the city using an interactive tactical map.
4. **Actionable Outputs:** Generating official, standardized PDF reports (aligned with government schemes like the Smart City Mission) to bridge the gap between problem identification and contractor resolution.

## 🏗️ Architecture

Urban IQ is built on a modern, robust **MERN** stack (MongoDB, Express, React, Node.js), ensuring scalability, fast rendering, and seamless API integration.

### Frontend (Client-Side)
- **Framework:** React.js powered by Vite for lightning-fast HMR and building.
- **Styling & UI:** Tailwind CSS providing a sleek, dark-themed, "Classified Intelligence" dashboard aesthetic.
- **Mapping:** Leaflet/React-Leaflet for interactive geospatial visualization of community pins.
- **Data Export:** jsPDF for client-side generation of structured intelligence reports.
- **Network:** Axios for seamless communication with the backend API.

### Backend (Server-Side)
- **Runtime:** Node.js with Express.js framework.
- **Database:** MongoDB (via Mongoose ODM) for persistent storage of geospatial report data, images, and AI analysis.
- **AI Integration:** Google Gemini & Groq APIs for intelligent context processing and infrastructure analysis.
- **Architecture Pattern:** RESTful API design with modular routing (`routes/api.js`) and controllers (`controllers/reportController.js`).

## 🛠️ Tech Stack Snapshot

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React, Vite, Tailwind CSS, Leaflet |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB, Mongoose |
| **AI / NLP** | Google Gemini API, Groq API |
| **Deployment**| Render (Web Service & Static Site) |

## ⚙️ Setup & Installation

### Prerequisites
- Node.js (v16+)
- MongoDB Cluster (e.g., MongoDB Atlas)

### 1. Backend Setup
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` directory:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
GROQ_API_KEY=your_groq_api_key
GEMINI_API_KEY=your_gemini_api_key
```
Run the server:
```bash
npm start # or node server.js
```

### 2. Frontend Setup
```bash
cd urbaniq-frontend
npm install
```
Create a `.env` file in the `urbaniq-frontend` directory:
```env
VITE_API_URL=http://localhost:5000/api
```
Run the development server:
```bash
npm run dev
```

## 🏆 Compassion-A-Thon 3.0
This venture was developed as part of **Compassion-A-Thon 3.0**, guided by the vision of moving from raw ideas to viable minimum viable products (MVPs). Urban IQ is a testament to venture-oriented problem solving, providing a structured, scalable solution for urban infrastructure management.
