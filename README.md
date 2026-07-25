<div align="center">

# 🧠 Mini Mindmap
<strong>Turn raw text into an interactive mindmap using AI.</strong>

</div>

<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white" />
  <img src="https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Vite-Latest-646CFF?logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/Node.js-Express-339933?logo=node.js&logoColor=white" />
  <img src="https://img.shields.io/badge/TailwindCSS-v4-06B6D4?logo=tailwindcss&logoColor=white" />
  <img src="https://img.shields.io/badge/Google-Gemini%203.1%20Flash%20Lite-4285F4?logo=google&logoColor=white" />
  <img src="https://img.shields.io/badge/Status-Completed-success" />
</p>

---

## 📖 Overview

Mini Mindmap is a full-stack AI application that transforms any block of text into an interactive visual mindmap.

Users can paste an article, blog post, meeting notes, research content, or any paragraph of text. The backend sends this content to **Google Gemini 3.1 Flash Lite**, validates the generated response, stores the generated mindmap locally, and returns it to the frontend where it is rendered as an interactive node-link diagram.

Clicking any node reveals its summary, allowing users to quickly understand the structure of the content.

---

# ✨ Features

* 🧠 AI-powered mindmap generation
* 🌳 Interactive node-link visualization
* 📌 Click any node to view its summary
* 📜 Previous generated mindmaps history
* 🌙 Light / Dark mode
* 🧪 Mock Mode (works without an API key)
* ✅ Backend validation of AI responses
* 💾 Local JSON persistence
* 📱 Responsive interface

---

# 🛠 Tech Stack

### Frontend

* React
* TypeScript
* Vite
* Tailwind CSS
* Axios
* Lucide React

### Backend

* Node.js
* Express
* Google Gemini API
* Local JSON Storage

### AI Model

* **Google Gemini 3.1 Flash Lite**

---

# 🧩 Assignment Flow

The application follows the complete workflow required by the assignment:

1. User enters a block of text.
2. Frontend sends the text to the Express backend.
3. Backend calls the Gemini API using structured JSON output.
4. The AI response is validated before being accepted.
5. A unique ID and timestamp are assigned.
6. The generated mindmap is stored locally.
7. The complete mindmap is returned to the frontend.
8. The frontend renders the result as an interactive diagram.
9. Clicking any node displays its summary.
10. Previously generated mindmaps are available in the history panel.

---

# 📂 Project Structure

```text
Mini_MindMap/
│
├── mini_mindmap/            # React Frontend
│
└── mini_mindmap_backend/    # Express Backend
```

---

# 🚀 Setup

## 1. Clone the repository

```bash
git clone <repository-url>
cd Mini_MindMap
```

---

## 2. Install Frontend Dependencies

```bash
cd mini_mindmap
npm install
```

---

## 3. Install Backend Dependencies

```bash
cd ../mini_mindmap_backend
npm install
```

---

## 4. Configure Environment Variables

Inside:

```text
mini_mindmap_backend/
```

Create a file named:

```text
.env
```

Add your Gemini API key:

```env
GEMINI_API_KEY=YOUR_GEMINI_API_KEY
```

---

## 5. Start the Backend

```bash
cd mini_mindmap_backend
npm run dev
```

---

## 6. Start the Frontend

Open another terminal.

```bash
cd mini_mindmap
npm run dev
```

---

# 🧪 Mock Mode

No API key?

No problem.

Simply enable **Mock Mode** using the toggle available in the application header.

When Mock Mode is enabled:

* No Gemini API requests are made.
* A predefined sample mindmap is returned.
* The entire application works without requiring an API key.

---

# 🌙 Dark Mode

The application includes built-in Dark Mode.

Simply use the **Dark Mode toggle** in the header to switch between light and dark themes.

---

# 💾 Persistence

Generated mindmaps are stored locally inside a JSON file on the backend.

This keeps the project self-contained without requiring an external database while satisfying the persistence requirement of the assignment.

---

# ⚠ Edge Cases Handled

The backend validates and handles:

* Empty input
* Very short input
* Excessively large input
* Invalid AI responses
* Invalid JSON
* Missing node references
* Duplicate node IDs
* Invalid root node
* Invalid connection references

---

# 📌 API Endpoints

### Create Mindmap

```http
POST /api/mindmaps
```

Request

```json
{
  "textInput": "Your text here",
  "mock_mode": false
}
```

---

### Get Mindmap History

```http
GET /api/mindmaps
```

Returns:

* id
* title
* createdAt

---

### Get Mindmap

```http
GET /api/mindmaps/:id
```

Returns the complete stored mindmap.

---

# ⏱ Time Spent

Approximately **5 hours**.

---

# 🔮 Future Improvements

Given additional time, I would implement:

* Zod schema validation
* Automated Jest tests
* Streaming AI responses
* Better automatic graph layout
* Search within generated mindmaps
* Database-backed persistence (MongoDB/PostgreSQL)
* User authentication
* Mindmap export (PNG/PDF)

---

# 🙏 Thank You

Thank you for reviewing my submission. I enjoyed building this project and appreciated the opportunity to demonstrate full-stack development, AI integration, backend validation, and interactive frontend design in a compact application.
