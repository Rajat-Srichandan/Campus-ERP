/* ============================================================
   seed-06-hub.js : top-up seed for Campus Hub (requests,
   certificates, complaints). Vanilla IIFE, no dependencies.

   Usage: load once AFTER campus-hub.js (e.g. add
   <script src="seed-06-hub.js"></script> temporarily, or paste
   into the devtools console on any hub page), then remove it.
   It never deletes anything: existing records (including the
   hub demos REQ-DEMO1/REQ-DEMO2, CERT-DEMO1, CMP-DEMO1/CMP-DEMO2)
   are kept by id, and only missing rows are appended until each
   collection reaches its target size:
     campusRequests     -> 20
     campusCertificates -> 12
     campusComplaints   -> 18
   Shapes match campus-hub.js exactly. Safe to run repeatedly.
   ============================================================ */
(function () {
  "use strict";

  var LS = {
    requests: "campusRequests",
    certificates: "campusCertificates",
    complaints: "campusComplaints"
  };

  /* Must stay identical to SLA_HOURS in campus-hub.js */
  var SLA_HOURS = { Electrical: 24, Plumbing: 24, Cleaning: 12, WiFi: 48, Food: 12, Other: 72 };

  function load(key) {
    try {
      var v = localStorage.getItem(key);
      var p = v ? JSON.parse(v) : [];
      return Array.isArray(p) ? p : [];
    } catch (e) { return []; }
  }
  function save(key, val) {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) {}
  }

  if (typeof localStorage === "undefined") {
    console.log("[seed-06-hub] localStorage unavailable, nothing seeded.");
    return;
  }

  /* Canonical students: STU001-STU003 match script.js/backend;
     STU004-STU015 are fixed invented names reused everywhere. */
  // STU001 Rahul Kumar, STU002 Priya Sharma, STU003 Aman Das,
  // STU004 Neha Singh, STU005 Arjun Patel, STU006 Kavya Reddy,
  // STU007 Rohit Verma, STU008 Sneha Gupta, STU009 Vikram Mehta,
  // STU010 Anjali Nair, STU011 Karan Joshi, STU012 Pooja Yadav,
  // STU013 Suresh Rao, STU014 Divya Iyer, STU015 Mohit Chauhan

  /* ---------------- REQUESTS (target 20) ----------------
     Shape: {id,type,studentName,studentId,from,to,reason,
             status,createdAt,decidedAt,note} */
  var REQUEST_SEED = [
    /* hub demos (kept verbatim by id; only re-added if missing) */
    { id: "REQ-DEMO1", type: "GatePass", studentName: "Rahul Kumar", studentId: "STU001", from: "2026-10-07", to: "2026-10-07", reason: "Family visit", status: "Pending", createdAt: "2026-10-07T08:00:00.000Z", decidedAt: null, note: "" },
    { id: "REQ-DEMO2", type: "Leave", studentName: "Priya Sharma", studentId: "STU002", from: "2026-10-06", to: "2026-10-06", reason: "Medical", status: "Approved", createdAt: "2026-10-06T09:00:00.000Z", decidedAt: "2026-10-06T21:00:00.000Z", note: "Report to warden on return" },
    /* top-up rows */
    { id: "REQ-1001", type: "Leave", studentName: "Aman Das", studentId: "STU003", from: "2026-10-03", to: "2026-10-05", reason: "Family function at home", status: "Approved", createdAt: "2026-10-01T08:30:00.000Z", decidedAt: "2026-10-02T10:00:00.000Z", note: "Report to warden on return" },
    { id: "REQ-1002", type: "GatePass", studentName: "Neha Singh", studentId: "STU004", from: "2026-10-04", to: "2026-10-04", reason: "Doctor appointment in city", status: "Approved", createdAt: "2026-10-03T09:15:00.000Z", decidedAt: "2026-10-03T17:00:00.000Z", note: "Return before 7 PM" },
    { id: "REQ-1003", type: "Night-Out", studentName: "Arjun Patel", studentId: "STU005", from: "2026-10-04", to: "2026-10-05", reason: "Stay at cousin's place", status: "Pending", createdAt: "2026-10-03T18:20:00.000Z", decidedAt: null, note: "" },
    { id: "REQ-1004", type: "Mess-Off", studentName: "Kavya Reddy", studentId: "STU006", from: "2026-10-05", to: "2026-10-07", reason: "Fasting - home food", status: "Approved", createdAt: "2026-10-02T11:00:00.000Z", decidedAt: "2026-10-03T09:00:00.000Z", note: "Mess bill adjusted" },
    { id: "REQ-1005", type: "Leave", studentName: "Rohit Verma", studentId: "STU007", from: "2026-10-06", to: "2026-10-08", reason: "Sister's wedding", status: "Pending", createdAt: "2026-10-04T10:05:00.000Z", decidedAt: null, note: "" },
    { id: "REQ-1006", type: "GatePass", studentName: "Sneha Gupta", studentId: "STU008", from: "2026-10-02", to: "2026-10-02", reason: "Book purchase in market", status: "Rejected", createdAt: "2026-10-01T14:00:00.000Z", decidedAt: "2026-10-02T08:00:00.000Z", note: "No gate pass during exam hours" },
    { id: "REQ-1007", type: "Night-Out", studentName: "Vikram Mehta", studentId: "STU009", from: "2026-10-03", to: "2026-10-04", reason: "Hackathon overnight at partner college", status: "Approved", createdAt: "2026-10-01T16:40:00.000Z", decidedAt: "2026-10-02T12:00:00.000Z", note: "Carry college ID" },
    { id: "REQ-1008", type: "Leave", studentName: "Anjali Nair", studentId: "STU010", from: "2026-10-01", to: "2026-10-02", reason: "Fever - medical rest", status: "Approved", createdAt: "2026-09-30T09:00:00.000Z", decidedAt: "2026-09-30T18:00:00.000Z", note: "Submit medical certificate" },
    { id: "REQ-1009", type: "Mess-Off", studentName: "Karan Joshi", studentId: "STU011", from: "2026-10-06", to: "2026-10-09", reason: "Out for sports tournament", status: "Pending", createdAt: "2026-10-05T08:00:00.000Z", decidedAt: null, note: "" },
    { id: "REQ-1010", type: "GatePass", studentName: "Pooja Yadav", studentId: "STU012", from: "2026-10-05", to: "2026-10-05", reason: "Bank work in city", status: "Rejected", createdAt: "2026-10-04T12:00:00.000Z", decidedAt: "2026-10-04T19:00:00.000Z", note: "Apply 24h in advance next time" },
    { id: "REQ-1011", type: "Night-Out", studentName: "Suresh Rao", studentId: "STU013", from: "2026-10-06", to: "2026-10-07", reason: "Brother visiting - staying with family", status: "Pending", createdAt: "2026-10-05T19:30:00.000Z", decidedAt: null, note: "" },
    { id: "REQ-1012", type: "Leave", studentName: "Divya Iyer", studentId: "STU014", from: "2026-10-04", to: "2026-10-06", reason: "Dental surgery", status: "Approved", createdAt: "2026-10-02T10:00:00.000Z", decidedAt: "2026-10-03T08:30:00.000Z", note: "Approved on medical grounds" },
    { id: "REQ-1013", type: "GatePass", studentName: "Mohit Chauhan", studentId: "STU015", from: "2026-10-03", to: "2026-10-03", reason: "Interview in city", status: "Approved", createdAt: "2026-10-02T09:00:00.000Z", decidedAt: "2026-10-02T16:00:00.000Z", note: "Return with interview letter copy" },
    { id: "REQ-1014", type: "Mess-Off", studentName: "Rahul Kumar", studentId: "STU001", from: "2026-10-07", to: "2026-10-10", reason: "Trip with project team", status: "Pending", createdAt: "2026-10-06T09:00:00.000Z", decidedAt: null, note: "" },
    { id: "REQ-1015", type: "Leave", studentName: "Priya Sharma", studentId: "STU002", from: "2026-10-07", to: "2026-10-07", reason: "Driving licence test", status: "Rejected", createdAt: "2026-10-06T15:00:00.000Z", decidedAt: "2026-10-06T20:00:00.000Z", note: "Insufficient notice - reapply with slot proof" },
    { id: "REQ-1016", type: "Night-Out", studentName: "Aman Das", studentId: "STU003", from: "2026-10-07", to: "2026-10-08", reason: "Night train home", status: "Pending", createdAt: "2026-10-06T21:00:00.000Z", decidedAt: null, note: "" },
    { id: "REQ-1017", type: "GatePass", studentName: "Rohit Verma", studentId: "STU007", from: "2026-10-01", to: "2026-10-01", reason: "Library book return - city branch", status: "Rejected", createdAt: "2026-09-30T13:00:00.000Z", decidedAt: "2026-10-01T08:00:00.000Z", note: "Use campus library instead" },
    { id: "REQ-1018", type: "Leave", studentName: "Vikram Mehta", studentId: "STU009", from: "2026-10-05", to: "2026-10-06", reason: "Cousin's engagement", status: "Rejected", createdAt: "2026-10-03T11:00:00.000Z", decidedAt: "2026-10-04T10:00:00.000Z", note: "Leave quota exhausted for the month" }
  ];

  /* ---------------- CERTIFICATES (target 12) ----------------
     Shape: {id,kind,purpose,studentName,studentId,status,
             createdAt,issuedAt} */
  var CERT_SEED = [
    /* hub demo (kept verbatim by id; only re-added if missing) */
    { id: "CERT-DEMO1", kind: "Bonafide", purpose: "Scholarship", studentName: "Rahul Kumar", studentId: "STU001", status: "Pending", createdAt: "2026-10-06T10:00:00.000Z", issuedAt: null },
    /* top-up rows */
    { id: "CERT-1001", kind: "Character", purpose: "Internship application", studentName: "Priya Sharma", studentId: "STU002", status: "Issued", createdAt: "2026-09-28T09:00:00.000Z", issuedAt: "2026-09-30T11:00:00.000Z" },
    { id: "CERT-1002", kind: "Transcript", purpose: "Higher studies", studentName: "Aman Das", studentId: "STU003", status: "Pending", createdAt: "2026-10-02T10:00:00.000Z", issuedAt: null },
    { id: "CERT-1003", kind: "No-Dues", purpose: "Library clearance", studentName: "Neha Singh", studentId: "STU004", status: "Issued", createdAt: "2026-10-01T09:00:00.000Z", issuedAt: "2026-10-03T12:00:00.000Z" },
    { id: "CERT-1004", kind: "Bonafide", purpose: "Bus pass", studentName: "Arjun Patel", studentId: "STU005", status: "Issued", createdAt: "2026-09-29T08:30:00.000Z", issuedAt: "2026-10-01T10:00:00.000Z" },
    { id: "CERT-1005", kind: "Migration", purpose: "Transfer to another university", studentName: "Kavya Reddy", studentId: "STU006", status: "Pending", createdAt: "2026-10-04T11:00:00.000Z", issuedAt: null },
    { id: "CERT-1006", kind: "Fee Receipt", purpose: "Education loan", studentName: "Rohit Verma", studentId: "STU007", status: "Issued", createdAt: "2026-10-02T09:00:00.000Z", issuedAt: "2026-10-03T15:00:00.000Z" },
    { id: "CERT-1007", kind: "Character", purpose: "Placement drive", studentName: "Sneha Gupta", studentId: "STU008", status: "Pending", createdAt: "2026-10-05T10:00:00.000Z", issuedAt: null },
    { id: "CERT-1008", kind: "Transcript", purpose: "Semester exchange program", studentName: "Anjali Nair", studentId: "STU010", status: "Issued", createdAt: "2026-09-27T09:00:00.000Z", issuedAt: "2026-09-29T14:00:00.000Z" },
    { id: "CERT-1009", kind: "No-Dues", purpose: "Hostel vacation", studentName: "Pooja Yadav", studentId: "STU012", status: "Pending", createdAt: "2026-10-06T09:00:00.000Z", issuedAt: null },
    { id: "CERT-1010", kind: "Fee Receipt", purpose: "Scholarship renewal", studentName: "Mohit Chauhan", studentId: "STU015", status: "Issued", createdAt: "2026-10-03T08:00:00.000Z", issuedAt: "2026-10-05T11:00:00.000Z" },
    { id: "CERT-1011", kind: "Migration", purpose: "Course transfer", studentName: "Karan Joshi", studentId: "STU011", status: "Pending", createdAt: "2026-10-06T14:00:00.000Z", issuedAt: null }
  ];

  /* ---------------- COMPLAINTS (target 18) ----------------
     Shape: {id,category,hostel,room,desc,studentName,studentId,
             priority,status,createdAt,resolvedAt,slaHours} */
  var COMPLAINT_SEED = [
    /* hub demos (kept verbatim by id; only re-added if missing) */
    { id: "CMP-DEMO1", category: "Electrical", hostel: "BH-2", room: "204", desc: "Fan not working", studentName: "Rahul Kumar", studentId: "STU001", priority: "High", status: "Open", createdAt: "2026-10-07T05:00:00.000Z", resolvedAt: null, slaHours: 24 },
    { id: "CMP-DEMO2", category: "Cleaning", hostel: "BH-1", room: "101", desc: "Washroom cleaning pending", studentName: "Aman Das", studentId: "STU003", priority: "Normal", status: "Resolved", createdAt: "2026-10-05T08:00:00.000Z", resolvedAt: "2026-10-05T18:00:00.000Z", slaHours: 12 },
    /* top-up rows (CMP-1001 + CMP-1002 are intentionally SLA-breached:
       still unresolved and older than their slaHours, for the SLA demo) */
    { id: "CMP-1001", category: "Cleaning", hostel: "BH-1", room: "105", desc: "Garbage not collected for 3 days near staircase", studentName: "Neha Singh", studentId: "STU004", priority: "Normal", status: "Open", createdAt: "2026-10-01T06:00:00.000Z", resolvedAt: null, slaHours: 12 },
    { id: "CMP-1002", category: "WiFi", hostel: "GH-1", room: "312", desc: "No internet in wing B since Monday", studentName: "Kavya Reddy", studentId: "STU006", priority: "Normal", status: "In-Progress", createdAt: "2026-09-29T10:00:00.000Z", resolvedAt: null, slaHours: 48 },
    { id: "CMP-1003", category: "Electrical", hostel: "BH-2", room: "208", desc: "Tube light flickering continuously", studentName: "Arjun Patel", studentId: "STU005", priority: "High", status: "Open", createdAt: "2026-10-07T08:00:00.000Z", resolvedAt: null, slaHours: 24 },
    { id: "CMP-1004", category: "Plumbing", hostel: "GH-1", room: "110", desc: "Tap leaking in washroom", studentName: "Sneha Gupta", studentId: "STU008", priority: "High", status: "In-Progress", createdAt: "2026-10-06T20:00:00.000Z", resolvedAt: null, slaHours: 24 },
    { id: "CMP-1005", category: "Food", hostel: "BH-1", room: "Mess", desc: "Dinner served cold twice this week", studentName: "Rohit Verma", studentId: "STU007", priority: "Normal", status: "Open", createdAt: "2026-10-07T09:30:00.000Z", resolvedAt: null, slaHours: 12 },
    { id: "CMP-1006", category: "Other", hostel: "BH-2", room: "301", desc: "Room lock jammed, door won't latch", studentName: "Vikram Mehta", studentId: "STU009", priority: "Normal", status: "In-Progress", createdAt: "2026-10-06T16:00:00.000Z", resolvedAt: null, slaHours: 72 },
    { id: "CMP-1007", category: "Plumbing", hostel: "BH-1", room: "102", desc: "Flush tank not working", studentName: "Anjali Nair", studentId: "STU010", priority: "High", status: "Resolved", createdAt: "2026-10-02T08:00:00.000Z", resolvedAt: "2026-10-03T09:00:00.000Z", slaHours: 24 },
    { id: "CMP-1008", category: "WiFi", hostel: "BH-2", room: "215", desc: "Weak signal during online classes", studentName: "Karan Joshi", studentId: "STU011", priority: "Normal", status: "Resolved", createdAt: "2026-10-01T09:00:00.000Z", resolvedAt: "2026-10-02T18:00:00.000Z", slaHours: 48 },
    { id: "CMP-1009", category: "Electrical", hostel: "GH-1", room: "205", desc: "Switchboard sparking", studentName: "Pooja Yadav", studentId: "STU012", priority: "High", status: "Resolved", createdAt: "2026-10-03T07:00:00.000Z", resolvedAt: "2026-10-03T20:00:00.000Z", slaHours: 24 },
    { id: "CMP-1010", category: "Cleaning", hostel: "GH-1", room: "118", desc: "Corridor mopping skipped", studentName: "Suresh Rao", studentId: "STU013", priority: "Normal", status: "Open", createdAt: "2026-10-07T10:00:00.000Z", resolvedAt: null, slaHours: 12 },
    { id: "CMP-1011", category: "Food", hostel: "BH-2", room: "Mess", desc: "Found insect in dal yesterday", studentName: "Divya Iyer", studentId: "STU014", priority: "Normal", status: "In-Progress", createdAt: "2026-10-07T08:00:00.000Z", resolvedAt: null, slaHours: 12 },
    { id: "CMP-1012", category: "Other", hostel: "GH-1", room: "220", desc: "Warden permission letter pending for outing", studentName: "Mohit Chauhan", studentId: "STU015", priority: "Normal", status: "Resolved", createdAt: "2026-10-02T10:00:00.000Z", resolvedAt: "2026-10-04T11:00:00.000Z", slaHours: 72 },
    { id: "CMP-1013", category: "Electrical", hostel: "BH-1", room: "109", desc: "Ceiling fan making loud noise", studentName: "Rahul Kumar", studentId: "STU001", priority: "High", status: "In-Progress", createdAt: "2026-10-06T22:00:00.000Z", resolvedAt: null, slaHours: 24 },
    { id: "CMP-1014", category: "Plumbing", hostel: "BH-2", room: "212", desc: "Drainage blocked in bathroom", studentName: "Priya Sharma", studentId: "STU002", priority: "High", status: "Open", createdAt: "2026-10-07T06:30:00.000Z", resolvedAt: null, slaHours: 24 },
    { id: "CMP-1015", category: "WiFi", hostel: "BH-1", room: "115", desc: "Login portal not accepting credentials", studentName: "Aman Das", studentId: "STU003", priority: "Normal", status: "Resolved", createdAt: "2026-09-30T08:00:00.000Z", resolvedAt: "2026-10-01T12:00:00.000Z", slaHours: 48 },
    { id: "CMP-1016", category: "Food", hostel: "GH-1", room: "Mess", desc: "Breakfast timing too short on Sundays", studentName: "Neha Singh", studentId: "STU004", priority: "Normal", status: "Resolved", createdAt: "2026-10-01T07:00:00.000Z", resolvedAt: "2026-10-01T15:00:00.000Z", slaHours: 12 }
  ];

  /* Append missing seed rows until the collection reaches target.
     Never removes or overwrites existing records. */
  function topUp(key, target, seedRows) {
    var list = load(key);
    var have = {};
    list.forEach(function (r) { if (r && r.id) have[r.id] = true; });
    var added = 0;
    for (var i = 0; i < seedRows.length && list.length < target; i++) {
      if (!have[seedRows[i].id]) {
        list.push(seedRows[i]);
        have[seedRows[i].id] = true;
        added++;
      }
    }
    /* Perf: skip rewrite when nothing changed (was unconditional). */
    if (added > 0) save(key, list);
    return { total: list.length, added: added };
  }

  var r = topUp(LS.requests, 20, REQUEST_SEED);
  var c = topUp(LS.certificates, 12, CERT_SEED);
  var m = topUp(LS.complaints, 18, COMPLAINT_SEED);

  console.log("[seed-06-hub] requests: " + r.total + " (+" + r.added + "), " +
    "certificates: " + c.total + " (+" + c.added + "), " +
    "complaints: " + m.total + " (+" + m.added + ")");
})();
