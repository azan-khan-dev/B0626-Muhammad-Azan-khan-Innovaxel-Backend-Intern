# 🎟️ Event Registration System API

**B0626 - Muhammad Azan Khan - Innovaxel - Backend Intern**

A RESTful API for managing event registrations with seat tracking, validation, and race condition prevention.

---

## 🛠️ Technologies Used

| Technology | Purpose |
|---|---|
| **Node.js** | Runtime environment |
| **Express.js** | Web framework |
| **SQLite (better-sqlite3)** | Local database |
| **Postman** | API testing |

---

## 📋 Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- [Git](https://git-scm.com/)
- [Postman](https://www.postman.com/downloads/)

---

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/azan-khan-dev/B0626-Muhammad-Azan-khan-Innovaxel-Backend-Intern.git
```

### 2. Navigate to Project Folder
```bash
cd B0626-Muhammad-Azan-khan-Innovaxel-Backend-Intern
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Start the Server
```bash
npm start
```
Server will run at: `http://localhost:3000/api`

---

## 🗄️ Database

- **SQLite** used — no setup required
- `database.db` file auto-created on first run
- Tables auto-migrated when server starts

---

## 📡 API Endpoints

### Base URL: `http://localhost:3000/api`

> ⚠️ In Postman: Headers tab → `Content-Type: application/json`

---

### 1. Create Event
**POST** `/api/events`
```json
{
  "event_name": "Tech Conference",
  "total_seats": 50,
  "event_date": "2026-12-01"
}
```

---

### 2. Get All Events
**GET** `/api/`

| Query Param | Value | Description |
|---|---|---|
| `upcoming_only` | `true` | Show only future events |
| `sort_by_date` | `true` | Sort by date |
