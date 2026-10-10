# PITCH.md — 90-Second Hackathon Pitch (Fretbox)

> Say the quotes, click the rest. Two tabs open: Tab 1 = Admin (`ADMIN001`/`admin123`), Tab 2 = Student (`STU001`/`student123`). Backend running (`cd backend && node server.js`).

## 0–10s — Hook (hold up phone + laptop)

> "Every day, a student checks a notice board, a WhatsApp group, a paper register, and a counter queue — just to ask: is my leave approved? Campus Hub makes that one tap."

## 10–35s — Student pain → action (Tab 2, `student-dashboard.html`)

> "I'm Rahul, third sem. My attendance, today's classes, and only *my* notices — auto-filtered by department and semester. My gate-pass is pending — one request in `requests.html`, and I get a printable slip that works offline as gate proof."

Click: dashboard → submit gate-pass.

## 35–55s — Campus life loop (same tab)

> "Hostel fan dies — `complaints.html`, Electrical, Room 204. It gets a 24-hour SLA timer, not a forgotten register entry. Mess food bad? One star rating in `mess.html`. Confused? I ask Campus Copilot — it answers from my live data, in Hindi too."

Click: complaint submit → Copilot: "What is my attendance?"

## 55–75s — Admin visibility (Tab 1, `ops-dashboard.html`)

> "Every action lands here. Total pending, open complaints, average resolve time, SLA breaches, mess rating, low attendance. Oldest-first queue, recurring issues — fix Electrical once instead of daily. And notices go out as push alerts, targeted — no WhatsApp noise."

Point to each tile.

## 75–90s — Closer (DevTools → Offline, reload)

> "And it works where campus Wi-Fi doesn't. Offline — reload — the form still saves, Hindi toggle, Lite mode for 2G and low-end phones. One hub, zero paper, nobody left out. Thank you."

## Q&A armor

- "Real-time?" → Shared backend `/api/ops/summary`, instant locally.
- "Scale?" → Express shapes match Postgres/Mongo; JWT deps already in `backend/package.json`.
- "AI?" → Copilot grounded in live campus records, offline-first; LLM pluggable.
- "Push?" → VAPID Web Push (`sw.js`, `push-client.js`); opt-in toggle in `student-settings.html`; offline queue stays the fallback.
- Backend down? → "Fully offline-first — localStorage demo continues, syncs when online."
- Login fails? → Open `users.html` once (seeds demo users), retry.

## Click order

`index.html` → `student-dashboard.html` → `requests.html` → `complaints.html` → `mess.html` → `ops-dashboard.html` → offline reload + Hindi + Lite
