/* seed-01-people.js — PEOPLE seed (students, faculty, departments, courses, users).
 * Vanilla IIFE. On load: reads each localStorage key, keeps ALL existing
 * entries (dedupe by id/code/userId — never deletes STU001/ADMIN001/FAC001
 * demos), and tops up to 30 students / 12 faculty / 6 departments /
 * 18 courses, plus one login user per student+faculty+admin.
 * Record shapes mirror script.js / index.html / campus-hub.js exactly:
 *   campusStudents:    {id, name, email, department (full name), semester ("Nth Semester")}
 *   campusFaculty:     {id, name, email, department (full name), subject}
 *   campusUsers:       {id (USRnnn), name, userId (STUxxx/FACxxx/ADMIN001), email, password, role, status}
 *   campusDepartments: {name (full), code}
 *   campusCourses:     {name, code, department (full), semester ("Nth Semester")}
 */
(function seedPeople() {
    "use strict";

    var TARGETS = { students: 30, faculty: 12, departments: 6, courses: 18 };

    /* ---------- canonical roster (first entries are canonical, reused by other seeds) ---------- */

    var CANON_DEPARTMENTS = [
        { name: "Computer Science", code: "CSE" },
        { name: "Information Technology", code: "IT" },
        { name: "Mechanical Engineering", code: "ME" },
        { name: "Electrical Engineering", code: "EE" },
        { name: "Civil Engineering", code: "CE" },
        { name: "Business Administration", code: "BBA" }
    ];

    var CANON_STUDENTS = [
        { id: "STU001", name: "Rahul Kumar", email: "rahul@example.com", department: "Computer Science", semester: "3rd Semester" },
        { id: "STU002", name: "Priya Sharma", email: "priya@example.com", department: "Information Technology", semester: "4th Semester" },
        { id: "STU003", name: "Aman Das", email: "aman@example.com", department: "Mechanical Engineering", semester: "2nd Semester" },
        { id: "STU004", name: "Sneha Patel", email: "sneha.patel@example.com", department: "Computer Science", semester: "1st Semester" },
        { id: "STU005", name: "Vikram Singh", email: "vikram.singh@example.com", department: "Electrical Engineering", semester: "5th Semester" },
        { id: "STU006", name: "Anjali Gupta", email: "anjali.gupta@example.com", department: "Civil Engineering", semester: "3rd Semester" },
        { id: "STU007", name: "Rohit Verma", email: "rohit.verma@campus.edu", department: "Business Administration", semester: "2nd Semester" },
        { id: "STU008", name: "Kavya Reddy", email: "kavya.reddy@example.com", department: "Information Technology", semester: "6th Semester" },
        { id: "STU009", name: "Arjun Mehta", email: "arjun.mehta@example.com", department: "Computer Science", semester: "5th Semester" },
        { id: "STU010", name: "Pooja Nair", email: "pooja.nair@example.com", department: "Electrical Engineering", semester: "1st Semester" },
        { id: "STU011", name: "Ishan Joshi", email: "ishan.joshi@example.com", department: "Computer Science", semester: "2nd Semester" },
        { id: "STU012", name: "Divya Menon", email: "divya.menon@example.com", department: "Information Technology", semester: "3rd Semester" },
        { id: "STU013", name: "Karan Malhotra", email: "karan.malhotra@example.com", department: "Mechanical Engineering", semester: "4th Semester" },
        { id: "STU014", name: "Neha Kulkarni", email: "neha.kulkarni@example.com", department: "Civil Engineering", semester: "1st Semester" },
        { id: "STU015", name: "Aditya Rao", email: "aditya.rao@campus.edu", department: "Electrical Engineering", semester: "3rd Semester" },
        { id: "STU016", name: "Riya Banerjee", email: "riya.banerjee@example.com", department: "Business Administration", semester: "4th Semester" },
        { id: "STU017", name: "Suresh Yadav", email: "suresh.yadav@example.com", department: "Computer Science", semester: "6th Semester" },
        { id: "STU018", name: "Meera Iyer", email: "meera.iyer@example.com", department: "Information Technology", semester: "1st Semester" },
        { id: "STU019", name: "Nikhil Chandra", email: "nikhil.chandra@example.com", department: "Mechanical Engineering", semester: "5th Semester" },
        { id: "STU020", name: "Tanvi Desai", email: "tanvi.desai@example.com", department: "Civil Engineering", semester: "4th Semester" },
        { id: "STU021", name: "Harsh Thakur", email: "harsh.thakur@example.com", department: "Electrical Engineering", semester: "6th Semester" },
        { id: "STU022", name: "Shreya Bose", email: "shreya.bose@campus.edu", department: "Business Administration", semester: "1st Semester" },
        { id: "STU023", name: "Varun Pillai", email: "varun.pillai@example.com", department: "Computer Science", semester: "4th Semester" },
        { id: "STU024", name: "Ananya Mishra", email: "ananya.mishra@example.com", department: "Information Technology", semester: "2nd Semester" },
        { id: "STU025", name: "Deepak Rawat", email: "deepak.rawat@example.com", department: "Mechanical Engineering", semester: "1st Semester" },
        { id: "STU026", name: "Lakshmi Venkat", email: "lakshmi.venkat@example.com", department: "Civil Engineering", semester: "5th Semester" },
        { id: "STU027", name: "Manoj Tiwari", email: "manoj.tiwari@example.com", department: "Electrical Engineering", semester: "2nd Semester" },
        { id: "STU028", name: "Simran Kaur", email: "simran.kaur@campus.edu", department: "Business Administration", semester: "3rd Semester" },
        { id: "STU029", name: "Gaurav Saxena", email: "gaurav.saxena@example.com", department: "Computer Science", semester: "7th Semester" },
        { id: "STU030", name: "Nandini Krishnan", email: "nandini.krishnan@example.com", department: "Information Technology", semester: "5th Semester" }
    ];

    var CANON_FACULTY = [
        { id: "FAC001", name: "Dr. Priya Sharma", email: "priya@example.com", department: "Computer Science", subject: "Programming" },
        { id: "FAC002", name: "Prof. Raj Kumar", email: "raj@example.com", department: "Information Technology", subject: "Database Systems" },
        { id: "FAC003", name: "Dr. Amit Das", email: "amit@example.com", department: "Mechanical Engineering", subject: "Engineering Mechanics" },
        { id: "FAC004", name: "Dr. Sunita Rao", email: "sunita.rao@example.com", department: "Electrical Engineering", subject: "Power Systems" },
        { id: "FAC005", name: "Prof. Anil Khanna", email: "anil.khanna@example.com", department: "Civil Engineering", subject: "Structural Analysis" },
        { id: "FAC006", name: "Dr. Meera Joshi", email: "meera.joshi@campus.edu", department: "Business Administration", subject: "Marketing Management" },
        { id: "FAC007", name: "Prof. Sandeep Nair", email: "sandeep.nair@example.com", department: "Computer Science", subject: "Operating Systems" },
        { id: "FAC008", name: "Dr. Kavitha Reddy", email: "kavitha.reddy@example.com", department: "Information Technology", subject: "Computer Networks" },
        { id: "FAC009", name: "Prof. Vikash Yadav", email: "vikash.yadav@example.com", department: "Mechanical Engineering", subject: "Thermodynamics" },
        { id: "FAC010", name: "Dr. Ritu Malhotra", email: "ritu.malhotra@example.com", department: "Electrical Engineering", subject: "Control Systems" },
        { id: "FAC011", name: "Prof. Sanjay Patel", email: "sanjay.patel@example.com", department: "Civil Engineering", subject: "Geotechnical Engineering" },
        { id: "FAC012", name: "Dr. Neha Agarwal", email: "neha.agarwal@campus.edu", department: "Business Administration", subject: "Financial Accounting" }
    ];

    var CANON_COURSES = [
        { name: "Data Structures", code: "CSE201", department: "Computer Science", semester: "3rd Semester" },
        { name: "Database Systems", code: "CSE301", department: "Computer Science", semester: "4th Semester" },
        { name: "Programming Fundamentals", code: "CSE101", department: "Computer Science", semester: "1st Semester" },
        { name: "Operating Systems", code: "CSE302", department: "Computer Science", semester: "5th Semester" },
        { name: "Computer Networks", code: "CSE401", department: "Computer Science", semester: "6th Semester" },
        { name: "Web Technologies", code: "IT201", department: "Information Technology", semester: "3rd Semester" },
        { name: "Database Management", code: "IT301", department: "Information Technology", semester: "4th Semester" },
        { name: "Object Oriented Programming", code: "IT202", department: "Information Technology", semester: "2nd Semester" },
        { name: "Engineering Mechanics", code: "ME201", department: "Mechanical Engineering", semester: "2nd Semester" },
        { name: "Thermodynamics", code: "ME301", department: "Mechanical Engineering", semester: "4th Semester" },
        { name: "Machine Design", code: "ME401", department: "Mechanical Engineering", semester: "5th Semester" },
        { name: "Circuit Theory", code: "EE201", department: "Electrical Engineering", semester: "3rd Semester" },
        { name: "Power Systems", code: "EE301", department: "Electrical Engineering", semester: "5th Semester" },
        { name: "Basic Electrical Engineering", code: "EE101", department: "Electrical Engineering", semester: "1st Semester" },
        { name: "Structural Analysis", code: "CE201", department: "Civil Engineering", semester: "3rd Semester" },
        { name: "Geotechnical Engineering", code: "CE301", department: "Civil Engineering", semester: "4th Semester" },
        { name: "Principles of Management", code: "BBA201", department: "Business Administration", semester: "2nd Semester" },
        { name: "Marketing Management", code: "BBA301", department: "Business Administration", semester: "4th Semester" }
    ];

    var CANON_ADMIN = { id: "USR001", name: "Rajat Admin", userId: "ADMIN001", email: "admin@campus.edu", password: "admin123", role: "Admin", status: "Active" };

    /* ---------- storage helpers ---------- */

    function load(key) {
        try {
            var raw = localStorage.getItem(key);
            if (!raw) return [];
            var parsed = JSON.parse(raw);
            return Array.isArray(parsed) ? parsed : [];
        } catch (e) { return []; }
    }

    function save(key, value) {
        try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) {}
    }

    // Merge canonical entries into existing list without deleting anything.
    // Existing entries win on key collision; canonical entries fill gaps up to target.
    function topUp(existing, canonical, keyFn, target) {
        var seen = {};
        var merged = [];
        var added = 0;
        existing.forEach(function (item) {
            if (!item) return;
            var k = String(keyFn(item)).toLowerCase();
            if (!k || seen[k]) return; // dedupe, keep first occurrence
            seen[k] = true;
            merged.push(item);
        });
        canonical.forEach(function (item) {
            if (merged.length >= target) return;
            var k = String(keyFn(item)).toLowerCase();
            if (seen[k]) return;
            seen[k] = true;
            merged.push(item);
            added++;
        });
        return { list: merged, added: added, kept: merged.length - added, total: existing.length };
    }

    function pad(n, width) {
        var s = String(n);
        while (s.length < width) s = "0" + s;
        return s;
    }

    /* ---------- run ---------- */

    try {
        if (typeof localStorage === "undefined") return;

        var resStudents = topUp(load("campusStudents"), CANON_STUDENTS, function (s) { return s.id; }, TARGETS.students);
        /* Perf: skip rewrite when nothing changed (dedupe sweep counts as a change). */
        if (resStudents.added > 0 || resStudents.list.length !== resStudents.total) save("campusStudents", resStudents.list);

        var resFaculty = topUp(load("campusFaculty"), CANON_FACULTY, function (f) { return f.id; }, TARGETS.faculty);
        if (resFaculty.added > 0 || resFaculty.list.length !== resFaculty.total) save("campusFaculty", resFaculty.list);

        var resDepts = topUp(load("campusDepartments"), CANON_DEPARTMENTS, function (d) { return d.code; }, TARGETS.departments);
        if (resDepts.added > 0 || resDepts.list.length !== resDepts.total) save("campusDepartments", resDepts.list);

        var resCourses = topUp(load("campusCourses"), CANON_COURSES, function (c) { return c.code; }, TARGETS.courses);
        if (resCourses.added > 0 || resCourses.list.length !== resCourses.total) save("campusCourses", resCourses.list);

        // Users: keep every existing user (dedupe by userId, then id), ensure the
        // admin + one login per student/faculty exist. Never overwrite existing.
        var existingUsers = load("campusUsers");
        var byUserId = {};
        var byId = {};
        var users = [];
        existingUsers.forEach(function (u) {
            if (!u) return;
            var ku = String(u.userId || "").toLowerCase();
            var ki = String(u.id || "").toLowerCase();
            if ((ku && byUserId[ku]) || (ki && byId[ki])) return;
            if (ku) byUserId[ku] = true;
            if (ki) byId[ki] = true;
            users.push(u);
        });
        var maxUsr = 0;
        users.forEach(function (u) {
            var m = String(u.id || "").match(/USR(\d+)/i);
            if (m) maxUsr = Math.max(maxUsr, parseInt(m[1], 10));
        });
        function nextUsrId() { maxUsr++; return "USR" + pad(maxUsr, 3); }
        var usersAdded = 0;
        function ensureUser(name, userId, email, password, role) {
            var ku = String(userId).toLowerCase();
            if (byUserId[ku]) return;
            var rec = { id: nextUsrId(), name: name, userId: userId, email: email, password: password, role: role, status: "Active" };
            byUserId[ku] = true;
            byId[String(rec.id).toLowerCase()] = true;
            users.push(rec);
            usersAdded++;
        }
        ensureUser(CANON_ADMIN.name, CANON_ADMIN.userId, CANON_ADMIN.email, CANON_ADMIN.password, CANON_ADMIN.role);
        resStudents.list.forEach(function (s) {
            ensureUser(s.name, s.id, s.email, "student123", "Student");
        });
        resFaculty.list.forEach(function (f) {
            ensureUser(f.name, f.id, f.email, "faculty123", "Faculty");
        });
        /* Perf: skip rewrite when nothing changed (dedupe sweep counts as a change). */
        if (usersAdded > 0 || users.length !== existingUsers.length) save("campusUsers", users);

        console.log("[seed-01-people] students: " + resStudents.list.length +
            " (added " + resStudents.added + "), faculty: " + resFaculty.list.length +
            " (added " + resFaculty.added + "), departments: " + resDepts.list.length +
            " (added " + resDepts.added + "), courses: " + resCourses.list.length +
            " (added " + resCourses.added + "), users: " + users.length +
            " (added " + usersAdded + ")");
    } catch (e) {
        try { console.log("[seed-01-people] failed: " + (e && e.message)); } catch (_) {}
    }
})();
