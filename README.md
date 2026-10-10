# Campus Hub — Unified Campus Management (Offline-First PWA)

> One hub for everyday campus ops: leave/gate-pass, certificates, hostel complaints (SLA),
> mess menu + feedback, targeted notices, fee queries, and ops analytics.
> Works on low bandwidth, offline, in English + Hindi.

## Features

**For students**
- Student dashboard: attendance %, today's classes, pending requests, my notices (auto-filtered by dept/semester)
- Leave & gate-pass requests with printable slip (offline proof)
- Certificates (Bonafide, TC, etc.) — apply + track Issued/Pending
- Hostel complaints with category, priority, SLA timer (e.g. Electrical 24h)
- Mess: 7-day menu + star-rating feedback
- Fee queries (tuition mismatch, receipt missing…) — no counter queue
- Notices filtered by audience + department + semester

**For admin / faculty**
- Admin dashboard + Ops Insights (`ops-dashboard.html`): total pending, open complaints,
  avg resolve time, SLA breaches, recurring issues, mess rating, low attendance (<75%)
- Approve/Reject leave, Issue/Reject certificates, Resolve complaints — oldest-first queue
- Publish targeted notices (All/Student/Faculty + Dept + Sem + Priority)
- Update 7-day mess menu via one API call
- Full ERP modules included: attendance, timetable, courses, exams, library, transport, hostel, fees, reports

**Cross-cutting**
- Offline-first: localStorage store + offline queue, auto-sync when back online
- PWA: `manifest.json` + `sw.js` (installable, cached core pages)
- Bilingual EN/HI toggle, Lite mode (low-bandwidth CSS), print slips

## Tech stack

| Layer | Tech |
|---|---|
| Frontend | Vanilla HTML + CSS (`style.css`) + JS (`script.js`, `campus-hub.js`), no build step |
| Backend (optional mirror) | Node.js + Express 4 + CORS + dotenv (in-memory store, no DB needed for demo) |
| PWA | `manifest.json`, `sw.js` (cache-first for 10 core pages) |
| Auth (demo) | localStorage `campusUsers` + `campusSession` (role-based redirect) |

## Folder structure

```
.
├── index.html              # Login (role: Student / Faculty / Admin)
├── student-dashboard.html  # Student home (notices, attendance, quick links)
├── admin-dashboard.html    # Admin home
├── faculty-dashboard.html
├── ops-dashboard.html      # Analytics: pending, SLA, recurring, mess rating
├── requests.html           # Leave & gate-pass
├── certificates.html
├── complaints.html         # Hostel complaints + SLA
├── mess.html               # Menu + feedback
├── announcements.html      # Targeted notices
├── fees.html               # Fees + fee queries
├── attendance.html / timetable.html / courses.html / examinations.html
├── library.html / transport.html / hostel.html / students.html / faculty.html
├── users.html / reports.html / notifications.htm / student-settings.html
├── campus-hub.js           # Unified logic: store, sync queue, i18n, ops calc
├── script.js               # Login, legacy CRUD
├── style.css
├── sw.js / manifest.json   # PWA
└── backend/
    ├── server.js           # Express API (mirrors localStorage shapes)
    ├── package.json
    └── .env.example        # Copy to .env
```

## How to run

**Option A — frontend only (zero install, offline-capable)**
```bash
# any static server; e.g.
npx serve .
# open http://localhost:3000/index.html
```
No login seed needed — first run auto-seeds demo requests/complaints.
If login says "Invalid credentials", open `users.html` once to seed demo users.

**Option B — with backend (sync + API demo)**
```bash
cd backend
cp .env.example .env
npm install
npm start
# API: http://localhost:5000  |  Frontend served too: http://localhost:5000/index.html
```
Frontend auto-detects backend via `#apiBase` (default `http://localhost:5000`).
When online it mirrors writes and pulls `/api/ops/summary` into Ops page.

## Demo credentials

| Role | User ID | Password | Lands on |
|---|---|---|---|
| Admin | `ADMIN001` | `admin123` | `admin-dashboard.html` |
| Student | `STU001` | `student123` | `student-dashboard.html` |
| Faculty | `FAC001` | `faculty123` | `faculty-dashboard.html` |

Seeded students: `STU001` Rahul Kumar (CS), `STU002` Priya Sharma (IT), `STU003` Aman Das (Mech).

## API list (`backend/server.js`)

Base: `http://localhost:5000`

| Method | Path | Body / notes |
|---|---|---|
| GET | `/`, `/api/health` | Status check |
| GET/POST | `/api/students` | `studentId, name, email, department, semester` |
| GET/DELETE | `/api/students/:id` | — |
| GET/POST | `/api/requests` | `type, studentName, studentId, from, to, reason` |
| PATCH | `/api/requests/:id/status` | `{ status: Approved/Rejected/Pending, note }` |
| GET/POST | `/api/certificates` | `kind, purpose, studentName, studentId` |
| PATCH | `/api/certificates/:id/status` | `{ status: Pending/Issued/Rejected }` |
| GET/POST | `/api/complaints` | `category, desc (+hostel, room, priority)` |
| PATCH | `/api/complaints/:id/status` | `{ status: Open/In-Progress/Resolved }` |
| GET/POST | `/api/mess/feedback` | `{ rating, comment, … }` |
| GET/PUT | `/api/mess/menu` | PUT needs 7-day array |
| GET/POST | `/api/fee-queries` | `topic, text` |
| PATCH | `/api/fee-queries/:id/status` | `{ status }` |
| GET/POST | `/api/notices?audience=&department=&semester=` | `title, message, audience` |
| GET | `/api/ops/summary` | pendingReq, openComp, avgResolveHrs, breach, byCat, messAvg |

All write APIs also work offline-first on frontend (queued in `campusOfflineQueue`, synced on `online` event).

## PWA / offline notes

- `sw.js` caches 10 core pages (`CACHE = campushub-v1`, cache-first, fallback to `student-dashboard.html`).
- Test: DevTools → Application → Service Workers → Offline checkbox → reload `requests.html` → form still submits ("saved on this device").
- Writes made offline go to localStorage + `campusOfflineQueue` (max 100) and POST to backend when `navigator.onLine` returns.
- Lite mode (`campusLite=1` in localStorage) strips heavy styling for 2G/low-end devices.
- Language toggle persists in `campusLang` (`en`/`hi`).

## Future scope

- Real DB (MongoDB/Postgres) + JWT auth (deps `jsonwebtoken`, `bcryptjs` already in `package.json`)
- Push notifications for notice + SLA-breach alerts
- Photo upload for complaints, QR gate-pass scan
- Mess billing + UPI receipts, fee payment gateway
- Attendance via QR/biometric, timetable auto-conflict check
