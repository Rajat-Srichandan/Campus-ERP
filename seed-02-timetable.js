/* seed-02-timetable.js
 * Seeds TIMETABLE + ATTENDANCE so timetable/attendance pages are full.
 * Vanilla IIFE. Keeps existing entries (dedupe by id) and tops up to:
 *   - 30 timetable slots (Mon-Sat, 09:00-17:00, rooms 101-305 / Lab 1-3,
 *     sems 1st-6th across CSE/IT/ME/EE/Civil/BBA)
 *   - 240 attendance records (16 days x 15 students, Oct 2026 dates),
 *     ~80% Present overall, 4 students below 75%, STU001 ~82%.
 * Shapes mirror script.js defaults:
 *   - campusTimetable: {id,course,faculty,day,start,end,room,semester}
 *     (script.js campusTimetable default, ids 1-3)
 *   - campusAttendance: {id,studentName,studentId,subject,faculty,date,status}
 *     (script.js campusAttendance default, ATT001-ATT006)
 * Canonical student IDs STU001-STU015 so cross-module filtering works.
 * Safe to run multiple times: re-runs add 0 records.
 */
(function () {
    "use strict";

    function load(key) {
        try {
            var raw = localStorage.getItem(key);
            if (!raw) return [];
            var v = JSON.parse(raw);
            return Array.isArray(v) ? v : [];
        } catch (e) {
            return [];
        }
    }

    function save(key, val) {
        try {
            localStorage.setItem(key, JSON.stringify(val));
        } catch (e) { /* storage unavailable */ }
    }

    /* ================= TIMETABLE ================= */
    var TT_KEY = "campusTimetable";
    var TT_TARGET = 30;
    var tt = load(TT_KEY);
    var ttKept = tt.length;
    var ttIds = {};
    tt.forEach(function (r) {
        if (r) ttIds[String(r.id)] = true;
    });

    /* Canonical defaults, verbatim shape from script.js (ids 1-3). */
    var TT_BASE = [
        { id: 1, course: "Data Structures", faculty: "Dr. Priya Sharma", day: "Monday", start: "09:00", end: "10:00", room: "Room 204", semester: "3rd Semester" },
        { id: 2, course: "Database Systems", faculty: "Prof. Raj Kumar", day: "Tuesday", start: "11:00", end: "12:00", room: "Lab 1", semester: "4th Semester" },
        { id: 3, course: "Engineering Mechanics", faculty: "Dr. Amit Das", day: "Wednesday", start: "14:00", end: "15:00", room: "Room 105", semester: "2nd Semester" }
    ];

    /* 27 top-up slots (ids 4-30): Mon-Sat, 09:00-17:00, rooms 101-305/Lab 1-3,
       sems 1st-6th. Core course+faculty pairs match the faculty roster. */
    var TT_SEED = [
        { id: 4, course: "Operating Systems", faculty: "Dr. Suresh Menon", day: "Monday", start: "10:00", end: "11:00", room: "Room 205", semester: "4th Semester" },
        { id: 5, course: "Thermodynamics", faculty: "Dr. Amit Das", day: "Monday", start: "11:00", end: "12:00", room: "Room 101", semester: "3rd Semester" },
        { id: 6, course: "Structural Analysis", faculty: "Dr. Meena Iyer", day: "Monday", start: "14:00", end: "15:00", room: "Room 301", semester: "5th Semester" },
        { id: 7, course: "Financial Accounting", faculty: "Prof. Neha Singh", day: "Monday", start: "15:00", end: "16:00", room: "Room 302", semester: "1st Semester" },
        { id: 8, course: "Data Structures Lab", faculty: "Dr. Priya Sharma", day: "Tuesday", start: "09:00", end: "10:00", room: "Lab 2", semester: "3rd Semester" },
        { id: 9, course: "Power Systems", faculty: "Prof. Sanjay Gupta", day: "Tuesday", start: "10:00", end: "11:00", room: "Room 201", semester: "5th Semester" },
        { id: 10, course: "Marketing Management", faculty: "Dr. Vikram Rao", day: "Tuesday", start: "14:00", end: "15:00", room: "Room 303", semester: "2nd Semester" },
        { id: 11, course: "Computer Networks", faculty: "Prof. Kavita Rao", day: "Tuesday", start: "15:00", end: "16:00", room: "Lab 1", semester: "4th Semester" },
        { id: 12, course: "Engineering Mathematics", faculty: "Dr. Suresh Menon", day: "Tuesday", start: "16:00", end: "17:00", room: "Room 102", semester: "1st Semester" },
        { id: 13, course: "Database Systems Lab", faculty: "Prof. Raj Kumar", day: "Wednesday", start: "09:00", end: "10:00", room: "Lab 1", semester: "4th Semester" },
        { id: 14, course: "Digital Electronics", faculty: "Prof. Sanjay Gupta", day: "Wednesday", start: "10:00", end: "11:00", room: "Lab 3", semester: "3rd Semester" },
        { id: 15, course: "Web Technologies", faculty: "Dr. Priya Sharma", day: "Wednesday", start: "11:00", end: "12:00", room: "Lab 2", semester: "5th Semester" },
        { id: 16, course: "Fluid Mechanics", faculty: "Dr. Amit Das", day: "Wednesday", start: "15:00", end: "16:00", room: "Room 103", semester: "4th Semester" },
        { id: 17, course: "Organizational Behaviour", faculty: "Prof. Neha Singh", day: "Wednesday", start: "16:00", end: "17:00", room: "Room 302", semester: "2nd Semester" },
        { id: 18, course: "Operating Systems", faculty: "Dr. Suresh Menon", day: "Thursday", start: "09:00", end: "10:00", room: "Room 205", semester: "4th Semester" },
        { id: 19, course: "Data Structures", faculty: "Dr. Priya Sharma", day: "Thursday", start: "10:00", end: "11:00", room: "Room 204", semester: "3rd Semester" },
        { id: 20, course: "Circuit Theory", faculty: "Prof. Sanjay Gupta", day: "Thursday", start: "11:00", end: "12:00", room: "Room 202", semester: "2nd Semester" },
        { id: 21, course: "Database Systems", faculty: "Prof. Raj Kumar", day: "Thursday", start: "14:00", end: "15:00", room: "Room 203", semester: "4th Semester" },
        { id: 22, course: "Concrete Technology", faculty: "Dr. Meena Iyer", day: "Thursday", start: "15:00", end: "16:00", room: "Room 301", semester: "6th Semester" },
        { id: 23, course: "Computer Networks", faculty: "Prof. Kavita Rao", day: "Friday", start: "09:00", end: "10:00", room: "Lab 3", semester: "4th Semester" },
        { id: 24, course: "Machine Design", faculty: "Dr. Amit Das", day: "Friday", start: "10:00", end: "11:00", room: "Room 104", semester: "6th Semester" },
        { id: 25, course: "Software Engineering", faculty: "Prof. Raj Kumar", day: "Friday", start: "11:00", end: "12:00", room: "Room 203", semester: "6th Semester" },
        { id: 26, course: "Business Economics", faculty: "Dr. Vikram Rao", day: "Friday", start: "14:00", end: "15:00", room: "Room 303", semester: "1st Semester" },
        { id: 27, course: "Surveying", faculty: "Dr. Meena Iyer", day: "Friday", start: "15:00", end: "16:00", room: "Room 305", semester: "3rd Semester" },
        { id: 28, course: "Engineering Mechanics", faculty: "Dr. Amit Das", day: "Saturday", start: "09:00", end: "10:00", room: "Room 105", semester: "2nd Semester" },
        { id: 29, course: "Data Structures", faculty: "Dr. Priya Sharma", day: "Saturday", start: "10:00", end: "11:00", room: "Lab 2", semester: "1st Semester" },
        { id: 30, course: "Database Systems", faculty: "Prof. Raj Kumar", day: "Saturday", start: "11:00", end: "12:00", room: "Lab 1", semester: "2nd Semester" }
    ];

    var ttAdded = 0;
    TT_BASE.concat(TT_SEED).forEach(function (s) {
        if (tt.length >= TT_TARGET) return;
        if (ttIds[String(s.id)]) return;
        tt.push({ id: s.id, course: s.course, faculty: s.faculty, day: s.day, start: s.start, end: s.end, room: s.room, semester: s.semester });
        ttIds[String(s.id)] = true;
        ttAdded++;
    });
    if (ttAdded > 0) save(TT_KEY, tt);

    /* ================= ATTENDANCE ================= */
    var ATT_KEY = "campusAttendance";
    var att = load(ATT_KEY);
    var attKept = att.length;
    var attIds = {};
    var attKeys = {}; /* studentId|subject|date -> true (app rejects dupes) */
    att.forEach(function (r) {
        if (!r) return;
        attIds[String(r.id)] = true;
        attKeys[String(r.studentId).toLowerCase() + "|" + String(r.subject).toLowerCase() + "|" + String(r.date)] = true;
    });

    /* Canonical defaults, verbatim shape from script.js (ATT001-ATT006). */
    var ATT_BASE = [
        { id: "ATT001", studentName: "Rahul Kumar", studentId: "STU001", subject: "Data Structures", faculty: "Dr. Priya Sharma", date: "2026-10-01", status: "Present" },
        { id: "ATT002", studentName: "Rahul Kumar", studentId: "STU001", subject: "Database Systems", faculty: "Prof. Raj Kumar", date: "2026-10-01", status: "Present" },
        { id: "ATT003", studentName: "Priya Sharma", studentId: "STU002", subject: "Data Structures", faculty: "Dr. Priya Sharma", date: "2026-10-01", status: "Present" },
        { id: "ATT004", studentName: "Aman Das", studentId: "STU003", subject: "Engineering Mechanics", faculty: "Dr. Amit Das", date: "2026-10-01", status: "Absent" },
        { id: "ATT005", studentName: "Aman Das", studentId: "STU003", subject: "Data Structures", faculty: "Dr. Priya Sharma", date: "2026-10-02", status: "Absent" },
        { id: "ATT006", studentName: "Priya Sharma", studentId: "STU002", subject: "Database Systems", faculty: "Prof. Raj Kumar", date: "2026-10-02", status: "Present" }
    ];
    ATT_BASE.forEach(function (r) {
        if (attIds[r.id]) return;
        att.push(r);
        attIds[r.id] = true;
        attKeys[r.studentId.toLowerCase() + "|" + r.subject.toLowerCase() + "|" + r.date] = true;
    });

    var STUDENTS = [
        { id: "STU001", name: "Rahul Kumar" },
        { id: "STU002", name: "Priya Sharma" },
        { id: "STU003", name: "Aman Das" },
        { id: "STU004", name: "Sneha Patel" },
        { id: "STU005", name: "Arjun Singh" },
        { id: "STU006", name: "Kavya Reddy" },
        { id: "STU007", name: "Rohit Verma" },
        { id: "STU008", name: "Anjali Gupta" },
        { id: "STU009", name: "Vikash Yadav" },
        { id: "STU010", name: "Neha Kumari" },
        { id: "STU011", name: "Suresh Kumar" },
        { id: "STU012", name: "Pooja Mishra" },
        { id: "STU013", name: "Karan Joshi" },
        { id: "STU014", name: "Divya Nair" },
        { id: "STU015", name: "Manoj Tiwari" }
    ];

    var SUBJECTS = [
        { subject: "Data Structures", faculty: "Dr. Priya Sharma" },
        { subject: "Database Systems", faculty: "Prof. Raj Kumar" },
        { subject: "Engineering Mechanics", faculty: "Dr. Amit Das" },
        { subject: "Operating Systems", faculty: "Dr. Suresh Menon" },
        { subject: "Computer Networks", faculty: "Prof. Kavita Rao" }
    ];

    /* 16 school days in Oct 2026 (Mon-Sat, skipping Sundays 04/11/18). */
    var DAYS = ["2026-10-01", "2026-10-02", "2026-10-03", "2026-10-05", "2026-10-06", "2026-10-07", "2026-10-08", "2026-10-09", "2026-10-10", "2026-10-12", "2026-10-13", "2026-10-14", "2026-10-15", "2026-10-16", "2026-10-17", "2026-10-19"];

    /* Present-days per student out of 16 (generated matrix only):
       overall 192/240 = 80.0%; STU001 13/16 = 81.25% (~82%);
       STU003/STU007/STU011/STU014 below 75% (low-attendance demo). */
    var PRESENT = [13, 14, 9, 14, 14, 13, 10, 14, 14, 13, 11, 14, 14, 11, 14];

    function absentSet(sIdx, absentCount) {
        var set = {};
        for (var k = 0; k < absentCount; k++) {
            set[(sIdx * 3 + k * 5) % DAYS.length] = true; /* 5 coprime w/16: distinct days */
        }
        return set;
    }

    function pad3(n) {
        var s = String(n);
        while (s.length < 3) s = "0" + s;
        return s;
    }

    var attAdded = 0;
    var seq = 7; /* generated ids: ATT007, ATT008, ... (matches generateAttendanceId) */
    for (var d = 0; d < DAYS.length; d++) {
        for (var s = 0; s < STUDENTS.length; s++) {
            var gid = "ATT" + pad3(seq++);
            if (attIds[gid]) continue; /* already seeded: keep, add nothing */
            var absent = absentSet(s, DAYS.length - PRESENT[s]);
            var status = absent[d] ? "Absent" : "Present";
            /* Rotate subjects; shift on logical clash so the app's
               student+subject+date duplicate guard never trips. */
            var choice = (d + s) % SUBJECTS.length;
            var picked = -1;
            for (var t = 0; t < SUBJECTS.length; t++) {
                var ci = (choice + t) % SUBJECTS.length;
                var key = STUDENTS[s].id.toLowerCase() + "|" + SUBJECTS[ci].subject.toLowerCase() + "|" + DAYS[d];
                if (!attKeys[key]) {
                    picked = ci;
                    attKeys[key] = true;
                    break;
                }
            }
            if (picked === -1) continue; /* day fully covered already */
            att.push({
                id: gid,
                studentName: STUDENTS[s].name,
                studentId: STUDENTS[s].id,
                subject: SUBJECTS[picked].subject,
                faculty: SUBJECTS[picked].faculty,
                date: DAYS[d],
                status: status
            });
            attIds[gid] = true;
            attAdded++;
        }
    }
    if (attAdded > 0) save(ATT_KEY, att);

    /* ================= REPORT =================
       Perf: skip the full aggregation pass when nothing changed —
       on steady-state loads this re-scanned all 240+ rows every time. */
    if (ttAdded === 0 && attAdded === 0) {
        console.log("[seed-02] up to date: timetable " + tt.length + ", attendance " + att.length + " (no changes)");
        return;
    }
    var present = 0;
    var perStudent = {};
    att.forEach(function (r) {
        if (!perStudent[r.studentId]) perStudent[r.studentId] = { name: r.studentName, total: 0, present: 0 };
        perStudent[r.studentId].total++;
        if (r.status === "Present") {
            perStudent[r.studentId].present++;
            present++;
        }
    });
    var low = Object.keys(perStudent).filter(function (id) {
        var st = perStudent[id];
        return st.total > 0 && (st.present / st.total) * 100 < 75;
    });
    var s1 = perStudent.STU001;
    var s1pct = s1 ? ((s1.present / s1.total) * 100).toFixed(1) : "n/a";
    var overall = att.length ? ((present / att.length) * 100).toFixed(1) : "n/a";

    console.log("[seed-02] timetable: kept " + ttKept + ", added " + ttAdded + ", total " + tt.length + " (target " + TT_TARGET + ")");
    console.log("[seed-02] attendance: kept " + attKept + ", added " + attAdded + ", total " + att.length + ", present " + present + " (" + overall + "%)");
    console.log("[seed-02] STU001 Rahul Kumar: " + (s1 ? s1.present + "/" + s1.total : "none") + " (" + s1pct + "%)");
    console.log("[seed-02] low attendance (<75%): " + low.length + " students [" + low.map(function (id) {
        var st = perStudent[id];
        return id + " " + ((st.present / st.total) * 100).toFixed(1) + "%";
    }).join(", ") + "]");
})();
