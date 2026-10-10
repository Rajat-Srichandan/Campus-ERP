# DEMO.md — 90-Second Hackathon Script

> Goal: prove **student pain → admin action → ops insight**, all offline-capable.
> Keep two tabs open + DevTools ready. Total: ~90 sec.

## Setup (before timer starts)

1. Backend running: `cd backend && npm start` → `http://localhost:5000/index.html`
2. Tab 1: Admin logged in (`ADMIN001` / `admin123`). Go to `requests.html`.
3. Tab 2: Student logged in (`STU001` / `student123`). Go to `student-dashboard.html`.
4. Open `ops-dashboard.html` in Tab 1 (second window or same-tab navigation at the end).

## Script (say + click)

**0–15s — Hook (Student dashboard)**
> "Students juggle leave, complaints, mess, fees on WhatsApp. Campus Hub puts it in one offline-first PWA."
- Show Tab 2: attendance %, today's classes, my notices auto-filtered.

**15–35s — Act 1: Admin approves (Tab 1, `requests.html`)**
> "A gate-pass is pending from Rahul. One click approves with a note — printable slip is offline proof."
- Click **Approve** on `REQ-DEMO1` → note "Report to warden on return".
- Point to status flip Pending → Approved + `decidedAt`.

**35–60s — Act 2: Student raises complaint + mess feedback (Tab 2)**
> "Now as the student: fan is dead in BH-2, and mess feedback takes 5 seconds."
- `complaints.html`: Category **Electrical**, Room **204**, "Fan not working" → Submit → shows **Open + SLA 24h**.
- `mess.html`: pick today's meal, **4 stars** → Submit.
- Line: "Offline? It says _saved on this device_ and syncs later — watch."

**60–80s — Act 3: Ops analytics (Tab 1, `ops-dashboard.html`)**
> "Every action feeds Ops Insights — no spreadsheet."
- Point to tiles: **Total pending, Complaints open, Avg resolve time, SLA breached, Mess rating**.
- Scroll: **Pending queue (oldest first)** + **Recurring issues** → "fix Electrical once, save daily time."

**80–90s — Closer: offline mode**
> "Cache-first PWA, Hindi/English toggle, Lite mode for 2G — built for real campuses."
- DevTools → Network → **Offline** → reload `requests.html` → submit → still saved.
- Toggle **हिंदी** + **Lite mode**. Close: "One hub, zero paper, works without internet."

## If something breaks (backup lines)

- Login fails → open `users.html` once (seeds demo users), retry.
- Backend down → "Fully offline-first — localStorage demo continues, queue syncs at `/api/ops/summary` when online."
- Empty data → clear `campusHubSeededV2` in localStorage and reload (re-seeds REQ-DEMO1 / CMP-DEMO1).

## Files to click in order

`index.html` → `requests.html` (approve) → `complaints.html` (raise) → `mess.html` (rate) → `ops-dashboard.html` (insight)
