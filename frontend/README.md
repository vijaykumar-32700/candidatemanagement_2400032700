# Candidate Management System - React Frontend

A modern, responsive, and professional Candidate Management System frontend built with **React**, **Vite**, **JavaScript**, **Axios**, and standard modern CSS.

This frontend connects to an existing **Spring Boot REST API** running on port `2026` backed by **MySQL** (`soataskdb`).

---

## 🚀 Features

- **Recruitment KPI Dashboard**: Real-time summary cards displaying Total Candidates, Selected, Shortlisted, and Pipeline stats derived directly from MySQL database records.
- **Candidate Table**: Responsive data table with ID badges, candidate initials avatars, status tags, location markers, and timestamps.
- **Add Candidate Modal**: Clean form with client-side field validation, whitespace trimming, and backend auto-generation of ID and timestamps.
- **View Details Modal**: Full read-only inspection of candidate records including creation and update timestamps from Hibernate.
- **Edit Candidate Modal**: Updates candidate data using `PUT /candidate/update` while keeping the primary key immutable.
- **Delete with Confirmation**: Safeguards against accidental deletions with an explicit warning modal before invoking `DELETE /candidate/delete/{id}`.
- **Derived Query Search**:
  - Exact Name search via `GET /candidate/displaybyname/{name}`
  - Role / Type filter via `GET /candidate/displaybytype/{type}`
  - Instant Filter Reset to view all records
- **Client-side Pagination**: Configurable rows per page (5, 10, 20) with previous/next navigation.
- **Real-Time Health Status**: Live backend indicator showing whether Spring Boot is reachable on port 2026.
- **Toast Notifications**: Non-intrusive feedback for every successful or failed backend action.

---

## 🛠️ Tech Stack

- **React 18** (Functional components, Hooks: `useState`, `useEffect`, `useCallback`)
- **Vite 6** (Fast build tool and dev server)
- **Axios** (Centralized API client with error handling)
- **Lucide React** (Clean, consistent iconography)
- **Pure CSS Design System** (Variables, responsive layout, subtle shadows, accessible focus states)

---

## ⚙️ Configuration

The frontend connects to the backend using the environment variable in `.env`:

```env
VITE_API_BASE_URL=http://localhost:2026
```

---

## 🏃 Quick Start (Windows)

1. Open PowerShell or Command Prompt in the `frontend` directory:
   ```powershell
   cd C:\Users\Dell\eclipse-workspace\CandidateProject\frontend
   ```

2. Install dependencies:
   ```powershell
   npm install
   ```

3. Start development server:
   ```powershell
   npm run dev
   ```

4. Open `http://localhost:5173` in your browser.
