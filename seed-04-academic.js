/* =====================================================
   seed-04-academic.js
   Seeds EXAMS + RESULTS + ASSIGNMENTS + STUDY MATERIALS.

   - Vanilla IIFE, localStorage only, never edits script.js.
   - Keeps existing entries (dedupe by id + natural key).
   - Tops up to: 12 exams, 60 results, 15 assignments,
     12 study materials (only when the stored list is short;
     script.js already ships 25 default materials, which are
     left untouched).
   - Safe to run multiple times (idempotent).
   Storage keys (must match script.js):
     campusExaminations / campusResults /
     campusAssignments / campusStudyMaterials
   ===================================================== */
(function () {
    "use strict";

    var EXAM_KEY = "campusExaminations";
    var RESULT_KEY = "campusResults";
    var ASSIGN_KEY = "campusAssignments";
    var MAT_KEY = "campusStudyMaterials";

    var EXAM_TARGET = 12;
    var RESULT_TARGET = 60;
    var ASSIGN_TARGET = 15;
    var MAT_TARGET = 12;

    /* ---------- storage (browser localStorage, memory fallback) ---------- */
    var memoryStore = {};
    var hasLocalStorage = false;
    try {
        hasLocalStorage =
            typeof localStorage !== "undefined" &&
            typeof localStorage.getItem === "function";
    } catch (e) {
        hasLocalStorage = false;
    }

    function load(key) {
        try {
            var raw = hasLocalStorage
                ? localStorage.getItem(key)
                : memoryStore[key] || null;
            if (!raw) return null;
            var parsed = JSON.parse(raw);
            return Array.isArray(parsed) ? parsed : null;
        } catch (e) {
            return null;
        }
    }

    function save(key, list) {
        try {
            var raw = JSON.stringify(list);
            if (hasLocalStorage) {
                localStorage.setItem(key, raw);
            } else {
                memoryStore[key] = raw;
            }
            return true;
        } catch (e) {
            return false;
        }
    }

    /* ---------- merge helper: keep existing, add missing seeds ---------- */
    function mergeSeeds(existing, seeds, keyFn, naturalFn) {
        var seenIds = {};
        var seenNatural = {};
        existing.forEach(function (item) {
            seenIds[String(keyFn(item))] = true;
            if (naturalFn) seenNatural[String(naturalFn(item))] = true;
        });
        var added = 0;
        seeds.forEach(function (item) {
            var id = String(keyFn(item));
            var nat = naturalFn ? String(naturalFn(item)) : null;
            if (seenIds[id]) return;
            if (nat && seenNatural[nat]) return;
            seenIds[id] = true;
            if (nat) seenNatural[nat] = true;
            existing.push(item);
            added += 1;
        });
        return added;
    }

    /* ---------- default replicas (mirror script.js fallbacks) ----------
       Used only when the storage key is absent, so first-run seeding
       keeps the built-in entries instead of replacing them. */
    var DEFAULT_EXAMS = [
        {
            id: 1,
            name: "Mid Semester Examination",
            course: "Data Structures",
            semester: "3rd Semester",
            date: "2026-10-15",
            maxMarks: 100
        },
        {
            id: 2,
            name: "End Semester Examination",
            course: "Database Systems",
            semester: "4th Semester",
            date: "2026-12-10",
            maxMarks: 100
        }
    ];

    var DEFAULT_RESULTS = [
        {
            id: 1,
            studentName: "Rahul Kumar",
            studentId: "STU001",
            exam: "Mid Semester Examination",
            subject: "Data Structures",
            marks: 88,
            maxMarks: 100
        },
        {
            id: 2,
            studentName: "Priya Sharma",
            studentId: "STU002",
            exam: "Mid Semester Examination",
            subject: "Data Structures",
            marks: 76,
            maxMarks: 100
        },
        {
            id: 3,
            studentName: "Aman Das",
            studentId: "STU003",
            exam: "Mid Semester Examination",
            subject: "Data Structures",
            marks: 38,
            maxMarks: 100
        }
    ];

    var DEFAULT_ASSIGNMENTS = [
        {
            id: "ASM001",
            title: "Data Structures Assignment",
            subject: "Data Structures",
            faculty: "Dr. Priya Sharma",
            semester: "3rd Semester",
            deadline: "2026-10-10",
            marks: 20,
            description:
                "Complete the linked list and stack programming problems.",
            status: "Pending"
        },
        {
            id: "ASM002",
            title: "Database Design",
            subject: "Database Systems",
            faculty: "Prof. Raj Kumar",
            semester: "4th Semester",
            deadline: "2026-10-05",
            marks: 25,
            description:
                "Design a normalized database schema for a college management system.",
            status: "Submitted"
        },
        {
            id: "ASM003",
            title: "Engineering Mechanics Problems",
            subject: "Engineering Mechanics",
            faculty: "Dr. Amit Das",
            semester: "2nd Semester",
            deadline: "2026-09-28",
            marks: 20,
            description:
                "Solve the assigned mechanics numerical problems.",
            status: "Overdue"
        }
    ];

    /* ================= EXAMS: top up to 12 =================
       Shape: { id, name, course, semester, date, maxMarks } */
    var SEED_EXAMS = [
        {
            id: 3,
            name: "Mid Semester Examination",
            course: "Operating Systems",
            semester: "4th Semester",
            date: "2026-10-17",
            maxMarks: 70
        },
        {
            id: 4,
            name: "Mid Semester Examination",
            course: "Computer Networks",
            semester: "5th Semester",
            date: "2026-10-20",
            maxMarks: 70
        },
        {
            id: 5,
            name: "Mid Semester Examination",
            course: "Thermodynamics",
            semester: "3rd Semester",
            date: "2026-10-18",
            maxMarks: 70
        },
        {
            id: 6,
            name: "Mid Semester Examination",
            course: "Circuit Theory",
            semester: "3rd Semester",
            date: "2026-10-19",
            maxMarks: 70
        },
        {
            id: 7,
            name: "Mid Semester Examination",
            course: "Web Technologies",
            semester: "5th Semester",
            date: "2026-10-22",
            maxMarks: 70
        },
        {
            id: 8,
            name: "End Semester Examination",
            course: "Data Structures",
            semester: "3rd Semester",
            date: "2026-11-24",
            maxMarks: 100
        },
        {
            id: 9,
            name: "End Semester Examination",
            course: "Operating Systems",
            semester: "4th Semester",
            date: "2026-11-25",
            maxMarks: 100
        },
        {
            id: 10,
            name: "End Semester Examination",
            course: "Computer Networks",
            semester: "5th Semester",
            date: "2026-11-26",
            maxMarks: 100
        },
        {
            id: 11,
            name: "End Semester Examination",
            course: "Power Systems",
            semester: "5th Semester",
            date: "2026-11-27",
            maxMarks: 100
        },
        {
            id: 12,
            name: "End Semester Examination",
            course: "Heat Transfer",
            semester: "4th Semester",
            date: "2026-11-28",
            maxMarks: 100
        }
    ];

    var exams = load(EXAM_KEY);
    if (!exams) exams = DEFAULT_EXAMS.slice();
    var examsAdded = mergeSeeds(
        exams,
        SEED_EXAMS,
        function (e) { return e.id; },
        function (e) { return e.name + "|" + e.course + "|" + e.date; }
    );
    /* Perf: skip rewrite when nothing changed (was unconditional). */
    if (examsAdded > 0) save(EXAM_KEY, exams);

    /* ================= RESULTS: top up to 60 =================
       Shape: { id, studentName, studentId, exam, subject,
                marks, maxMarks } (grade/status derived at render) */
    var RESULT_STUDENTS = [
        ["STU001", "Rahul Kumar"],
        ["STU002", "Priya Sharma"],
        ["STU003", "Aman Das"],
        ["STU004", "Sneha Patel"],
        ["STU005", "Vikram Singh"],
        ["STU006", "Anjali Gupta"],
        ["STU007", "Rohit Verma"],
        ["STU008", "Kavya Nair"],
        ["STU009", "Arjun Mehta"],
        ["STU010", "Divya Reddy"],
        ["STU011", "Karan Joshi"],
        ["STU012", "Neha Kulkarni"],
        ["STU013", "Aditya Rao"],
        ["STU014", "Pooja Mishra"],
        ["STU015", "Suresh Yadav"]
    ];
    var RESULT_SUBJECTS = [
        "Data Structures",
        "Operating Systems",
        "Computer Networks",
        "Database Systems"
    ];
    var MID_SEM = "Mid Semester Examination";

    /* [studentIndex, subjectIndex, marks] — skips the 3 default rows
       (STU001-STU003 x Data Structures). ~12% Fail (<40) for analytics. */
    var RESULT_MARKS = [
        [0, 1, 82], [0, 2, 74], [0, 3, 91],
        [1, 1, 68], [1, 2, 79], [1, 3, 84],
        [2, 1, 45], [2, 2, 33], [2, 3, 52],
        [3, 0, 78], [3, 1, 85], [3, 2, 69], [3, 3, 92],
        [4, 0, 66], [4, 1, 58], [4, 2, 71], [4, 3, 63],
        [5, 0, 95], [5, 1, 89], [5, 2, 93], [5, 3, 97],
        [6, 0, 41], [6, 1, 55], [6, 2, 48], [6, 3, 36],
        [7, 0, 88], [7, 1, 76], [7, 2, 81], [7, 3, 90],
        [8, 0, 59], [8, 1, 64], [8, 2, 52], [8, 3, 70],
        [9, 0, 73], [9, 1, 29], [9, 2, 61], [9, 3, 77],
        [10, 0, 84], [10, 1, 80], [10, 2, 86], [10, 3, 82],
        [11, 0, 47], [11, 1, 51], [11, 2, 39], [11, 3, 44],
        [12, 0, 90], [12, 1, 94], [12, 2, 88], [12, 3, 35],
        [13, 0, 62], [13, 1, 70], [13, 2, 75], [13, 3, 68],
        [14, 0, 31], [14, 1, 57], [14, 2, 65], [14, 3, 72]
    ];

    var SEED_RESULTS = RESULT_MARKS.map(function (row, i) {
        var student = RESULT_STUDENTS[row[0]];
        return {
            id: 4 + i,
            studentName: student[1],
            studentId: student[0],
            exam: MID_SEM,
            subject: RESULT_SUBJECTS[row[1]],
            marks: row[2],
            maxMarks: 100
        };
    });

    var results = load(RESULT_KEY);
    if (!results) results = DEFAULT_RESULTS.slice();
    var resultsAdded = mergeSeeds(
        results,
        SEED_RESULTS,
        function (r) { return r.id; },
        function (r) { return r.studentId + "|" + r.exam + "|" + r.subject; }
    );
    /* Perf: skip rewrite when nothing changed (was unconditional). */
    if (resultsAdded > 0) save(RESULT_KEY, results);

    /* ================= ASSIGNMENTS: top up to 15 =================
       Shape: { id, title, subject, faculty, semester,
                deadline, marks, description, status } */
    var SEED_ASSIGNMENTS = [
        {
            id: "ASM004",
            title: "Process Scheduling Simulation",
            subject: "Operating Systems",
            faculty: "Dr. Amit Das",
            semester: "4th Semester",
            deadline: "2026-10-12",
            marks: 20,
            description:
                "Simulate FCFS, SJF and Round Robin scheduling and compare average waiting times.",
            status: "Pending"
        },
        {
            id: "ASM005",
            title: "Subnetting Worksheet",
            subject: "Computer Networks",
            faculty: "Prof. Kavita Rao",
            semester: "5th Semester",
            deadline: "2026-10-14",
            marks: 15,
            description:
                "Solve the CIDR subnetting and supernetting problems with full working.",
            status: "Pending"
        },
        {
            id: "ASM006",
            title: "SQL Queries Practice Set",
            subject: "Database Systems",
            faculty: "Prof. Raj Kumar",
            semester: "4th Semester",
            deadline: "2026-10-08",
            marks: 25,
            description:
                "Write SQL queries for joins, subqueries and aggregate functions on the given schema.",
            status: "Submitted"
        },
        {
            id: "ASM007",
            title: "Thermodynamic Cycle Analysis",
            subject: "Thermodynamics",
            faculty: "Dr. S. Iyer",
            semester: "3rd Semester",
            deadline: "2026-10-16",
            marks: 20,
            description:
                "Analyse the Rankine cycle for the given operating conditions and compute thermal efficiency.",
            status: "Pending"
        },
        {
            id: "ASM008",
            title: "Circuit Theorems Numericals",
            subject: "Circuit Theory",
            faculty: "Prof. M. Nair",
            semester: "3rd Semester",
            deadline: "2026-10-11",
            marks: 20,
            description:
                "Solve network problems using Thevenin, Norton and superposition theorems.",
            status: "Pending"
        },
        {
            id: "ASM009",
            title: "Responsive Portfolio Website",
            subject: "Web Technologies",
            faculty: "Ms. R. Bose",
            semester: "5th Semester",
            deadline: "2026-10-20",
            marks: 30,
            description:
                "Build a responsive personal portfolio using HTML, CSS flexbox/grid and vanilla JavaScript.",
            status: "Pending"
        },
        {
            id: "ASM010",
            title: "BST and Graph Traversals",
            subject: "Data Structures",
            faculty: "Dr. Priya Sharma",
            semester: "3rd Semester",
            deadline: "2026-10-06",
            marks: 20,
            description:
                "Implement BST operations and BFS/DFS traversals with time-complexity analysis.",
            status: "Submitted"
        },
        {
            id: "ASM011",
            title: "Load Flow Analysis",
            subject: "Power Systems",
            faculty: "Dr. K. Sen",
            semester: "5th Semester",
            deadline: "2026-10-24",
            marks: 25,
            description:
                "Perform Gauss-Seidel load flow analysis on the given 3-bus system.",
            status: "Pending"
        },
        {
            id: "ASM012",
            title: "Heat Exchanger Design",
            subject: "Heat Transfer",
            faculty: "Dr. S. Iyer",
            semester: "4th Semester",
            deadline: "2026-10-18",
            marks: 20,
            description:
                "Design a shell-and-tube heat exchanger using the LMTD method.",
            status: "Pending"
        },
        {
            id: "ASM013",
            title: "ER Modeling Case Study",
            subject: "Database Systems",
            faculty: "Prof. Raj Kumar",
            semester: "4th Semester",
            deadline: "2026-10-02",
            marks: 15,
            description:
                "Draw the ER diagram for the hospital management case study and map it to tables.",
            status: "Overdue"
        },
        {
            id: "ASM014",
            title: "Deadlock Detection Programs",
            subject: "Operating Systems",
            faculty: "Dr. Amit Das",
            semester: "4th Semester",
            deadline: "2026-10-27",
            marks: 20,
            description:
                "Implement the Banker's algorithm and deadlock detection routine in C.",
            status: "Pending"
        },
        {
            id: "ASM015",
            title: "TCP Socket Programming",
            subject: "Computer Networks",
            faculty: "Prof. Kavita Rao",
            semester: "5th Semester",
            deadline: "2026-10-30",
            marks: 25,
            description:
                "Write a concurrent TCP client-server chat application with basic error handling.",
            status: "Pending"
        }
    ];

    var assignments = load(ASSIGN_KEY);
    if (!assignments) assignments = DEFAULT_ASSIGNMENTS.slice();
    var assignsAdded = mergeSeeds(
        assignments,
        SEED_ASSIGNMENTS,
        function (a) { return a.id; },
        function (a) { return a.title + "|" + a.subject + "|" + a.deadline; }
    );
    /* Perf: skip rewrite when nothing changed (was unconditional). */
    if (assignsAdded > 0) save(ASSIGN_KEY, assignments);

    /* ================= STUDY MATERIALS: ensure 12 =================
       Shape: { id, title, subject, faculty, type, link, date }
       3 each of PDF / Video / Link / Notes. Only merged when the
       stored list exists but is short (script.js defaults already
       ship 25, which are left untouched). */
    var SEED_MATERIALS = [
        {
            id: "MAT101",
            title: "Data Structures Trees and Graphs Handbook",
            subject: "Data Structures",
            faculty: "Dr. Priya Sharma",
            type: "PDF",
            link: "https://example.com/ds-trees-graphs-handbook",
            date: "2026-10-04"
        },
        {
            id: "MAT102",
            title: "DBMS Indexing Complete Guide",
            subject: "Database Systems",
            faculty: "Prof. Raj Kumar",
            type: "PDF",
            link: "https://example.com/dbms-indexing-guide",
            date: "2026-10-03"
        },
        {
            id: "MAT103",
            title: "Power Systems Formula Handbook",
            subject: "Power Systems",
            faculty: "Dr. K. Sen",
            type: "PDF",
            link: "https://example.com/ps-formula-handbook",
            date: "2026-10-02"
        },
        {
            id: "MAT104",
            title: "Operating Systems Paging and Virtual Memory Lecture",
            subject: "Operating Systems",
            faculty: "Dr. Amit Das",
            type: "Video",
            link: "https://example.com/os-paging-lecture",
            date: "2026-10-05"
        },
        {
            id: "MAT105",
            title: "Computer Networks Routing Protocols Explained",
            subject: "Computer Networks",
            faculty: "Prof. Kavita Rao",
            type: "Video",
            link: "https://example.com/cn-routing-video",
            date: "2026-10-04"
        },
        {
            id: "MAT106",
            title: "Heat Transfer Conduction Masterclass",
            subject: "Heat Transfer",
            faculty: "Dr. S. Iyer",
            type: "Video",
            link: "https://example.com/ht-conduction-video",
            date: "2026-10-03"
        },
        {
            id: "MAT107",
            title: "Data Structures Sorting Visualizer Lab",
            subject: "Data Structures",
            faculty: "Dr. Priya Sharma",
            type: "Link",
            link: "https://example.com/ds-sorting-lab",
            date: "2026-10-06"
        },
        {
            id: "MAT108",
            title: "Circuit Simulator Playground",
            subject: "Circuit Theory",
            faculty: "Prof. M. Nair",
            type: "Link",
            link: "https://example.com/circuit-playground",
            date: "2026-10-05"
        },
        {
            id: "MAT109",
            title: "SQL Practice Playground and Docs",
            subject: "Database Systems",
            faculty: "Prof. Raj Kumar",
            type: "Link",
            link: "https://example.com/sql-playground-docs",
            date: "2026-10-04"
        },
        {
            id: "MAT110",
            title: "Thermodynamics Rankine Cycle Notes",
            subject: "Thermodynamics",
            faculty: "Dr. S. Iyer",
            type: "Notes",
            link: "https://example.com/thermo-rankine-notes",
            date: "2026-10-03"
        },
        {
            id: "MAT111",
            title: "Web Technologies Flexbox and Grid Notes",
            subject: "Web Technologies",
            faculty: "Ms. R. Bose",
            type: "Notes",
            link: "https://example.com/web-flexbox-grid-notes",
            date: "2026-10-02"
        },
        {
            id: "MAT112",
            title: "Computer Networks Subnetting Quick Revision Notes",
            subject: "Computer Networks",
            faculty: "Prof. Kavita Rao",
            type: "Notes",
            link: "https://example.com/cn-subnetting-notes",
            date: "2026-10-01"
        }
    ];

    var materialsAdded = 0;
    var materials = load(MAT_KEY);
    if (materials && materials.length < MAT_TARGET) {
        materialsAdded = mergeSeeds(
            materials,
            SEED_MATERIALS,
            function (m) { return m.id; },
            function (m) { return m.title + "|" + m.type; }
        );
        save(MAT_KEY, materials);
    }

    /* ---------- report ---------- */
    function count(arr) {
        return Array.isArray(arr) ? arr.length : 0;
    }

    try {
        console.log(
            "[seed-04-academic] examinations: " + count(exams) +
            " (added " + examsAdded + ", key=" + EXAM_KEY + ")"
        );
        console.log(
            "[seed-04-academic] results: " + count(results) +
            " (added " + resultsAdded + ", key=" + RESULT_KEY + ")"
        );
        console.log(
            "[seed-04-academic] assignments: " + count(assignments) +
            " (added " + assignsAdded + ", key=" + ASSIGN_KEY + ")"
        );
        console.log(
            "[seed-04-academic] studyMaterials: " +
            (materials ? count(materials) : "deferred to script.js defaults") +
            " (added " + materialsAdded + ", key=" + MAT_KEY + ")"
        );
    } catch (e) { /* logging must never break the page */ }

    /* expose for testing (bun/node) without polluting browsers */
    try {
        if (typeof module !== "undefined" && module.exports) {
            module.exports = {
                EXAM_KEY: EXAM_KEY,
                RESULT_KEY: RESULT_KEY,
                ASSIGN_KEY: ASSIGN_KEY,
                MAT_KEY: MAT_KEY,
                targets: {
                    exams: EXAM_TARGET,
                    results: RESULT_TARGET,
                    assignments: ASSIGN_TARGET,
                    materials: MAT_TARGET
                }
            };
        }
    } catch (e) { /* ignore */ }
})();
