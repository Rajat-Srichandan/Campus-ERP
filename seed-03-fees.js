/* ============================================================
   seed-03-fees.js : FEES demo seed (vanilla IIFE, no deps)

   Keys/shapes mirror script.js + campus-hub.js exactly:
   - campusFees       : { id, studentName, studentId, semester,
                          tuition, hostel, exam, paid }
                        (status Paid/Partial/Pending is derived via
                         getTotalFee/getFeeStatus in script.js)
   - campusFeeQueries : { id, studentId, studentName, topic,
                          text, status, createdAt }
                        (LS.feeQueries === "campusFeeQueries")

   Behaviour: keeps existing entries (dedupe by id) and tops up
   to 25 fee records (STU001-STU025) + 12 fee queries.
   Safe to run multiple times (idempotent). Load after script.js
   / campus-hub.js, e.g. <script src="seed-03-fees.js"></script>.
   ============================================================ */
(function () {
    "use strict";

    function load(key, fallback) {
        try {
            var raw = localStorage.getItem(key);
            if (raw == null || raw === "") return fallback;
            var parsed = JSON.parse(raw);
            return Array.isArray(parsed) ? parsed : fallback;
        } catch (e) {
            return fallback;
        }
    }

    function save(key, val) {
        try {
            localStorage.setItem(key, JSON.stringify(val));
        } catch (e) { /* storage full / private mode: keep in-memory */ }
    }

    /* ---------- canonical roster STU001-STU025 ----------
       Tuition is set by department (40k-60k band):
       CS 60000 / IT 55000 / ECE 50000 / Electrical 48000 /
       Civil 42000 / Mechanical 40000.
       (ids 1-3 keep the exact legacy defaults from script.js) */
    var SEED_FEES = [
        { id: 1, studentName: "Rahul Kumar", studentId: "STU001", semester: "3rd Semester", tuition: 45000, hostel: 15000, exam: 3000, paid: 50000 },
        { id: 2, studentName: "Priya Sharma", studentId: "STU002", semester: "4th Semester", tuition: 45000, hostel: 0, exam: 3000, paid: 48000 },
        { id: 3, studentName: "Aman Das", studentId: "STU003", semester: "2nd Semester", tuition: 40000, hostel: 15000, exam: 3000, paid: 0 },
        { id: 4, studentName: "Rohit Verma", studentId: "STU004", semester: "1st Semester", tuition: 60000, hostel: 15000, exam: 3000, paid: 78000 },
        { id: 5, studentName: "Sneha Patel", studentId: "STU005", semester: "2nd Semester", tuition: 50000, hostel: 0, exam: 3000, paid: 30000 },
        { id: 6, studentName: "Vikram Singh", studentId: "STU006", semester: "3rd Semester", tuition: 42000, hostel: 15000, exam: 3000, paid: 0 },
        { id: 7, studentName: "Anjali Gupta", studentId: "STU007", semester: "5th Semester", tuition: 55000, hostel: 0, exam: 3000, paid: 58000 },
        { id: 8, studentName: "Arjun Mehta", studentId: "STU008", semester: "4th Semester", tuition: 48000, hostel: 15000, exam: 3000, paid: 40000 },
        { id: 9, studentName: "Kavya Reddy", studentId: "STU009", semester: "3rd Semester", tuition: 60000, hostel: 0, exam: 3000, paid: 63000 },
        { id: 10, studentName: "Aditya Nair", studentId: "STU010", semester: "5th Semester", tuition: 40000, hostel: 15000, exam: 3000, paid: 25000 },
        { id: 11, studentName: "Pooja Yadav", studentId: "STU011", semester: "2nd Semester", tuition: 42000, hostel: 0, exam: 3000, paid: 0 },
        { id: 12, studentName: "Karan Malhotra", studentId: "STU012", semester: "6th Semester", tuition: 55000, hostel: 15000, exam: 3000, paid: 73000 },
        { id: 13, studentName: "Divya Menon", studentId: "STU013", semester: "4th Semester", tuition: 50000, hostel: 15000, exam: 3000, paid: 50000 },
        { id: 14, studentName: "Nikhil Joshi", studentId: "STU014", semester: "5th Semester", tuition: 60000, hostel: 15000, exam: 3000, paid: 0 },
        { id: 15, studentName: "Riya Kapoor", studentId: "STU015", semester: "3rd Semester", tuition: 55000, hostel: 0, exam: 3000, paid: 30000 },
        { id: 16, studentName: "Manish Tiwari", studentId: "STU016", semester: "6th Semester", tuition: 40000, hostel: 0, exam: 3000, paid: 43000 },
        { id: 17, studentName: "Shreya Banerjee", studentId: "STU017", semester: "1st Semester", tuition: 50000, hostel: 15000, exam: 3000, paid: 68000 },
        { id: 18, studentName: "Deepak Chauhan", studentId: "STU018", semester: "4th Semester", tuition: 42000, hostel: 15000, exam: 3000, paid: 35000 },
        { id: 19, studentName: "Neha Agarwal", studentId: "STU019", semester: "2nd Semester", tuition: 48000, hostel: 0, exam: 3000, paid: 0 },
        { id: 20, studentName: "Sanjay Mishra", studentId: "STU020", semester: "1st Semester", tuition: 40000, hostel: 15000, exam: 3000, paid: 58000 },
        { id: 21, studentName: "Ishita Rao", studentId: "STU021", semester: "6th Semester", tuition: 60000, hostel: 0, exam: 3000, paid: 45000 },
        { id: 22, studentName: "Mohit Saxena", studentId: "STU022", semester: "2nd Semester", tuition: 55000, hostel: 15000, exam: 3000, paid: 20000 },
        { id: 23, studentName: "Tanvi Desai", studentId: "STU023", semester: "5th Semester", tuition: 50000, hostel: 0, exam: 3000, paid: 53000 },
        { id: 24, studentName: "Harsh Pandey", studentId: "STU024", semester: "3rd Semester", tuition: 48000, hostel: 15000, exam: 3000, paid: 0 },
        { id: 25, studentName: "Ananya Iyer", studentId: "STU025", semester: "5th Semester", tuition: 42000, hostel: 0, exam: 3000, paid: 45000 }
    ];

    var SEED_QUERIES = [
        { id: "FEEQ-001", studentId: "STU005", studentName: "Sneha Patel", topic: "Tuition mismatch", text: "Charged Rs 50,000 tuition for 2nd sem but my ECE fee circular says Rs 48,000. Paid Rs 30,000 on 3 Oct 2026 via UPI (UTR 328471905623). Please correct the demand.", status: "Open", createdAt: "2026-10-03T10:15:00.000Z" },
        { id: "FEEQ-002", studentId: "STU003", studentName: "Aman Das", topic: "Receipt missing", text: "Paid Rs 10,000 on 1 Oct 2026 towards hostel fee via UPI (UTR 328410077312) but no receipt generated on the portal. Need receipt for scholarship file.", status: "Open", createdAt: "2026-10-02T09:40:00.000Z" },
        { id: "FEEQ-003", studentId: "STU008", studentName: "Arjun Mehta", topic: "Hostel fee", text: "I vacated BH-2 room 204 on 28 Sep 2026 yet October hostel fee of Rs 15,000 is still showing as due. Paid Rs 40,000 on 4 Oct 2026 (UTR 328490112874). Please waive / adjust.", status: "Open", createdAt: "2026-10-04T12:05:00.000Z" },
        { id: "FEEQ-004", studentId: "STU012", studentName: "Karan Malhotra", topic: "Scholarship not applied", text: "Merit scholarship of Rs 20,000 approved for 6th sem (letter SCH/2026/114) is not reflected in my dues. Portal still shows full Rs 73,000 demand though I paid it on 5 Oct 2026. Please adjust.", status: "Open", createdAt: "2026-10-05T11:20:00.000Z" },
        { id: "FEEQ-005", studentId: "STU002", studentName: "Priya Sharma", topic: "Fine waiver", text: "Late fee fine of Rs 1,500 levied for September was paid along with Rs 48,000 dues on 1 Oct 2026 (UTR 328401558290). Request waiver as payment was within the extended deadline notice.", status: "Resolved", createdAt: "2026-10-02T14:30:00.000Z" },
        { id: "FEEQ-006", studentId: "STU015", studentName: "Riya Kapoor", topic: "Tuition mismatch", text: "Portal shows tuition Rs 55,000 for 3rd sem but I was promised the old Rs 52,000 slab at admission. Paid Rs 30,000 part payment on 4 Oct 2026 (UTR 328496620134). Please confirm correct slab.", status: "Resolved", createdAt: "2026-10-04T09:10:00.000Z" },
        { id: "FEEQ-007", studentId: "STU010", studentName: "Aditya Nair", topic: "Hostel fee", text: "Allotted hostel in July but mess/hostel split looks wrong: Rs 15,000 hostel charged twice for August and September. Paid Rs 25,000 on 6 Oct 2026 (UTR 328510077461). Please verify.", status: "Open", createdAt: "2026-10-06T10:45:00.000Z" },
        { id: "FEEQ-008", studentId: "STU022", studentName: "Mohit Saxena", topic: "Receipt missing", text: "Paid Rs 20,000 on 5 Oct 2026 via netbanking (UTR 914205733812) but the fees page still shows pending and no receipt SMS came. Need receipt urgently for education loan.", status: "Open", createdAt: "2026-10-05T16:55:00.000Z" },
        { id: "FEEQ-009", studentId: "STU007", studentName: "Anjali Gupta", topic: "Scholarship not applied", text: "SC post-matric scholarship Rs 25,000 credited to college on 30 Sep 2026 but my ledger does not show it. I cleared the balance Rs 58,000 on 2 Oct 2026 anyway (UTR 328433091755). Please reconcile.", status: "Resolved", createdAt: "2026-10-03T13:25:00.000Z" },
        { id: "FEEQ-010", studentId: "STU019", studentName: "Neha Agarwal", topic: "Fine waiver", text: "Rs 2,000 library-cum-late fine added to my fee dues though I returned books on 29 Sep 2026. Unable to pay Rs 51,000 total right now. Request fine waiver / review.", status: "Open", createdAt: "2026-10-06T08:30:00.000Z" },
        { id: "FEEQ-011", studentId: "STU001", studentName: "Rahul Kumar", topic: "Tuition mismatch", text: "Demand shows Rs 45,000 tuition but my admission receipt (2024 batch, CSE) says Rs 43,000 slab. Paid Rs 50,000 on 1 Oct 2026 (UTR 328400192837, Rs 50,000). Please clarify difference of Rs 2,000.", status: "Resolved", createdAt: "2026-10-01T15:05:00.000Z" },
        { id: "FEEQ-012", studentId: "STU014", studentName: "Nikhil Joshi", topic: "Hostel fee", text: "Day scholar since August (bus route 7) but Rs 15,000 hostel fee still in my 5th sem demand of Rs 78,000. Have not paid yet. Please remove hostel component.", status: "Resolved", createdAt: "2026-10-02T11:50:00.000Z" }
    ];

    /* ---------- merge (keep existing, dedupe by id) ---------- */
    var fees = load("campusFees", []);
    var feeIds = {};
    fees.forEach(function (r) { feeIds[String(r && r.id)] = true; });
    var feesAdded = 0;
    SEED_FEES.forEach(function (r) {
        if (!feeIds[String(r.id)]) {
            fees.push(r);
            feeIds[String(r.id)] = true;
            feesAdded++;
        }
    });
    /* Perf: skip rewrite when nothing changed (was unconditional). */
    if (feesAdded > 0) save("campusFees", fees);

    var queries = load("campusFeeQueries", []);
    var queryIds = {};
    queries.forEach(function (q) { queryIds[String(q && q.id)] = true; });
    var queriesAdded = 0;
    SEED_QUERIES.forEach(function (q) {
        if (!queryIds[String(q.id)]) {
            queries.push(q);
            queryIds[String(q.id)] = true;
            queriesAdded++;
        }
    });
    /* Perf: skip rewrite when nothing changed (was unconditional). */
    if (queriesAdded > 0) save("campusFeeQueries", queries);

    console.log("[seed-03-fees] campusFees: total=" + fees.length + " added=" + feesAdded + " (target 25)");
    console.log("[seed-03-fees] campusFeeQueries: total=" + queries.length + " added=" + queriesAdded + " (target 12)");
})();
