# AI-Powered Knowledge Assistant

---

A full-stack web application that allows users to upload documents and ask AI-powered questions based only on their uploaded content. The system supports document management, semantic search, source-based AI answers, conversation history, authentication, and analytics.

## Features

- User registration and login
- JWT-based authentication
- Profile view and update
- Upload PDF, DOCX, and TXT documents
- View, search and delete uploaded documents
- AI question answering based on uploaded documents
- Source references for AI answers
- Conversation history
- Analytics dashboard

## Tech Stack

### Backend

- Python
- FastAPI
- SQLAlchemy
- MySQL
- JWT Authentication
- Gemini API
- FAISS
- PyPDF
- python-docx

### Frontend

- React with Vite
- React Router DOM
- Axios
- Bootstrap 5
- React Toastify
- Font Awesome Icons
- JWT Decode

## Database Tables

- Integrated with MySQL Workbench

### users

```text
id
username
email
password
created_at
is_active
```

Stores registered user details, hashed passwords, account status, and creation timestamp.

### documents

```text
id
user_id
filename
original_filename
file_type
file_size
file_path
uploaded_at
```

Stores uploaded document metadata and links each document to the user who uploaded it.

### chat_history

```text
id
user_id
question
answer
sources
created_at
```

Stores user questions, AI-generated answers, source references, and timestamps for conversation history.

---

## Project Setup Instructions

### Prerequisites

Make sure the following are installed:

```text
Python 3.11
Node.js
MySQL
Git
```

### 1. Clone the Repository

```bash
git clone <repository-url>
cd <project-folder>
```

### 2. Backend Setup

Go to the backend folder:

```bash
cd backend
```

Create a virtual environment from the project root or backend parent folder:

```bash
py -3.11 -m venv venv
```

Install backend dependencies:

```bash
..\venv\Scripts\python.exe -m pip install -r requirements.txt
```

Create a `.env` file and add the required environment variables:

```env
DATABASE_URL=mysql+pymysql://root:password@localhost:3306/knowledge_assistant
GEMINI_API_KEY=your_gemini_api_key
VECTOR_DB_PATH=./vector_index
```

Start the backend server:

```bash
..\venv\Scripts\python.exe -m uvicorn app.main:app
```

Backend URL:

```text
http://127.0.0.1:8000
```

Swagger API Docs:

```text
http://127.0.0.1:8000/docs
```

### 3. Frontend Setup

Open a new terminal and go to the frontend folder:

```bash
cd frontend
```

Install frontend dependencies:

```bash
npm install
```

Start the frontend development server:

```bash
npm run dev
```

Frontend URL:

```text
http://localhost:5173
```

### 4. Run the Application

1. Start the MySQL server.
2. Start the FastAPI backend.
3. Start the React frontend.
4. Open the frontend URL in the browser.
5. Register or login.
6. Upload documents and ask questions.

---

## API Documentation

All protected endpoints require a JWT token in the request header.

```http
Authorization: Bearer <token>
```

All successful responses follow this general format:

```json
{
  "data": {}
}
```

### Authentication APIs

| Method | Endpoint           | Description                     | Auth Required |
| ------ | ------------------ | ------------------------------- | ------------- |
| POST   | `/auth/register` | Register a new user             | No            |
| POST   | `/auth/login`    | Login user and return JWT token | No            |
| GET    | `/auth/profile`  | View logged-in user profile     | Yes           |
| PUT    | `/auth/profile`  | Update logged-in user profile   | Yes           |

### Document APIs

| Method | Endpoint                     | Description                        | Auth Required |
| ------ | ---------------------------- | ---------------------------------- | ------------- |
| POST   | `/documents/upload`        | Upload PDF, DOCX, or TXT document  | Yes           |
| GET    | `/documents`               | List uploaded documents            | Yes           |
| GET    | `/documents/{document_id}` | View a single document             | Yes           |
| PUT    | `/documents/{document_id}` | Rename or update document metadata | Yes           |
| DELETE | `/documents/{document_id}` | Delete a document                  | Yes           |

### AI Chat APIs

| Method | Endpoint          | Description                                | Auth Required |
| ------ | ----------------- | ------------------------------------------ | ------------- |
| POST   | `/chat/ask`     | Ask a question based on uploaded documents | Yes           |
| GET    | `/chat/history` | View previous conversations                | Yes           |

### Analytics APIs

| Method | Endpoint       | Description                   | Auth Required |
| ------ | -------------- | ----------------------------- | ------------- |
| GET    | `/analytics` | View analytics dashboard data | Yes           |

## Architecture Overview

```text
React Frontend
    |
    | Axios + JWT Bearer Token
    v
FastAPI Backend
    |
    |-- routes/       API endpoints
    |-- services/     Business logic
    |-- models/       SQLAlchemy database models
    |-- schemas/      Pydantic validation schemas
    |-- core/         Security, password hashing, JWT logic
    |-- db/           MySQL database connection
    |-- ai/           Text extraction, chunking, embeddings, FAISS, RAG
    |
    v
MySQL Database + FAISS Vector Index + Gemini API
```

## Backend Folder Structure

```text
backend/
|
|-- app/
|   |
|   |-- core/
|   |   |-- security.py
|   |
|   |-- db/
|   |   |-- database.py
|   |
|   |-- ai/
|   |   |-- chunking.py
|   |   |-- gemini_client.py
|   |   |-- rag.py
|   |   |-- text_extraction.py
|   |   |-- vector_store.py
|   |
|   |-- models/
|   |   |-- user.py
|   |   |-- document.py
|   |   |-- chat_history.py
|   |
|   |-- routes/
|   |   |-- auth.py
|   |   |-- document.py
|   |   |-- chat.py
|   |   |-- analytics.py
|   |
|   |-- schemas/
|   |   |-- user.py
|   |   |-- document.py
|   |   |-- chat.py
|   |   |-- analytics.py
|   |
|   |-- services/
|   |   |-- auth_service.py
|   |   |-- document_service.py
|   |   |-- chat_service.py
|   |   |-- analytics_service.py
|   |
|   |-- main.py
|
|-- requirements.txt
|-- .env.example
```

## Frontend Folder Structure

```text
frontend/
|
|-- public/
|
|-- src/
|   |
|   |-- assets/
|   |   |-- images/
|   |   |-- icons/
|   |
|   |-- components/
|   |   |-- Footer.jsx
|   |   |-- Header.jsx
|   |   |-- ProtectedRoute.jsx
|   |   |-- Sidebar.jsx
|   |
|   |-- layouts/
|   |   |-- DashboardLayout.jsx
|   |
|   |-- pages/
|   |   |-- Login.jsx
|   |   |-- Register.jsx
|   |   |-- Dashboard.jsx
|   |   |-- Documents.jsx
|   |   |-- ChatAsk.jsx
|   |   |-- ChatHistory.jsx
|   |   |-- Profile.jsx
|   |
|   |-- services/
|   |   |-- api.js
|   |   |-- authService.js
|   |   |-- profileService.js
|   |   |-- documentService.js
|   |   |-- aiService.js
|   |   |-- analyticsService.js
|   |
|   |-- styles/
|   |   |-- global.css
|   |   |-- dashboardLayout.css
|   |   |-- header.css
|   |   |-- sidebar.css
|   |   |-- footer.css
|   |   |-- auth.css
|   |   |-- dashboard.css
|   |   |-- documents.css
|   |   |-- chatask.css
|   |   |-- chathistory.css
|   |   |-- profile.css
|   |
|   |-- App.jsx
|   |-- main.jsx
|   |-- index.css
|
|-- .gitignore
|-- package.json
|-- package-lock.json
|-- vite.config.js
|-- eslint.config.js
|-- README.md
```

---

## AI Workflow Explanation

```text
1. User uploads a PDF, DOCX, or TXT document
        |
        v
2. Backend saves document metadata in MySQL
        |
        v
3. Text is extracted from the uploaded file
        |
        v
4. Extracted text is split into smaller chunks
        |
        v
5. Gemini creates embeddings for each chunk
        |
        v
6. FAISS stores chunk vectors with metadata
        |
        v
7. User asks a question
        |
        v
8. Question is converted into an embedding
        |
        v
9. FAISS retrieves the most relevant chunks
        |
        v
10. Retrieved chunks are sent to Gemini as context
        |
        v
11. Gemini generates an answer from the provided context
        |
        v
12. Backend returns the answer with source references
```

## Author

**Developed by:** Avinaash K P

**Project:** AI-Powered Knowledge Assistant

**Tech Stack:** FastAPI, React, MySQL, Gemini, FAISS
