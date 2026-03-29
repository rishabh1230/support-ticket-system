# 🎫 AI-Powered Support Ticket System

An AI-driven full-stack support ticket management system built with:

- **Django + Django REST Backend Framework**
- **PostgreSQL**
- **Google Gemini API**
- **React + Vite + TailwindCSS**
- **Docker & Docker Compose**

The system automatically classifies support tickets using AI and assigns:

- 📂 Category  
- ⚡ Priority  
- 📌 Status  of tickets 

---

## 🚀 Features of the app

### 🤖 AI Classification
- Uses **Google Gemini API**
- Automatically predicts:
  - `category`
  - `priority`
  - `tickets`

### 🧾 Ticket Management
- Create tickets
- View all tickets
- Auto-set default status (`open`)
- Stores tickets in PostgreSQL

### 🎨 Modern UI
- Built with React + Vite
- Styled using TailwindCSS
- Responsive layout
- Colored priority/status badges

### 🐳 Fully Containerized
- Backend container
- Frontend container
- PostgreSQL container
- One-command startup

---

## 🏗️ Project Architecture

support-ticket-system/
│
├── backend/ # Django backend
│ ├── config/
│ ├── tickets/
│ └── Dockerfile
│
├── frontend/ # React frontend
│ └── Dockerfile
│
├── docker-compose.yml
└── README.md


---

## ⚙️ Tech Stack

| Layer       | Technology |
|------------|------------|
| Backend     | Django 4.2 |
| API         | Django REST Framework |
| Database    | PostgreSQL 15 |
| AI          | Google Gemini |
| Frontend    | React + Vite |
| Styling     | TailwindCSS |
| DevOps      | Docker |

---

## 🧠 How AI Classification Works

1. User submits ticket description  
2. Backend sends description to Gemini API  
3. Gemini responds with:
   - Suggested category  
   - Suggested priority  
4. Backend creates ticket with:
   - AI category  
   - AI priority  
   - Default status: `"open"`

---

## 🔐 Environment Variables

Create a `.env` file in the root directory:

LLM_API_KEY=your_google_gemini_api_key

2️⃣ Start Application
docker-compose up

3️⃣ Access Application

Frontend:

http://localhost:5173


Backend API:

http://localhost:8000/api/tickets/

📡 API Endpoints

Get All Tickets
GET /api/tickets/

Create Ticket
POST /api/tickets/

AI Classification
POST /api/tickets/classify/


🛠 Development (Without Docker)
Backend
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver

Frontend
cd frontend
npm install
npm run dev
