/* seed-07-notices.js : ANNOUNCEMENTS + NOTICES + MESS seeds.
   Vanilla IIFE. Keeps existing records (ANN001/ANN002, NOT001.., MESS-DEMO1..)
   and tops up to: 50 announcements, 40 student notifications,
   full 7-day mess menu, 80 mess feedbacks. Safe to re-run. */
(function () {
  "use strict";

  function load(key, fallback) {
    try {
      var v = localStorage.getItem(key);
      return v ? JSON.parse(v) : fallback;
    } catch (e) { return fallback; }
  }
  function save(key, val) {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) {}
  }
  function hasId(list, id) {
    for (var i = 0; i < list.length; i++) {
      if (String(list[i] && list[i].id) === String(id)) return true;
    }
    return false;
  }

  /* ---------- 1. ANNOUNCEMENTS (campusAnnouncements) ----------
     Union shape: {id,title,message,audience,department,semester,priority,date} */
  var ANN_KEY = "campusAnnouncements";
  var anns = load(ANN_KEY, null);
  if (!Array.isArray(anns)) anns = [];

  // Backfill department/semester defaults so hub targeting never breaks.
  var annsDirty = false;
  anns.forEach(function (a) {
    if (!a.department) { a.department = "All"; annsDirty = true; }
    if (!a.semester) { a.semester = "All"; annsDirty = true; }
  });

  var ANN_SEED = [
    { id: "ANN001", title: "[CSE 3rd Sem] Lab rescheduled", message: "Data Structures lab moves to 2 PM, Room 204.", audience: "Students", department: "Computer Science", semester: "3rd Semester", priority: "Important", date: "2026-10-02" },
    { id: "ANN002", title: "Mess timing", message: "Dinner 7-9 PM this week.", audience: "All", department: "All", semester: "All", priority: "Normal", date: "2026-10-03" },
    { id: "ANN003", title: "Mid Semester Examination", message: "Mid Semester Examination will begin from 15 October 2026.", audience: "Students", department: "All", semester: "All", priority: "High", date: "2026-10-02" },
    { id: "ANN004", title: "Faculty Meeting", message: "All faculty members are requested to attend the monthly faculty meeting on 9 Oct, Seminar Hall.", audience: "Faculty", department: "All", semester: "All", priority: "Important", date: "2026-10-05" },
    { id: "ANN005", title: "Campus Maintenance", message: "Campus maintenance work will be carried out this weekend. Water supply paused 9 AM-12 PM Saturday.", audience: "All", department: "All", semester: "All", priority: "Normal", date: "2026-10-04" },
    { id: "ANN006", title: "[IT 4th Sem] DBMS lab rescheduled", message: "DBMS lab shifted to Friday 10 AM, Lab 3. Carry record notebooks.", audience: "Students", department: "Information Technology", semester: "4th Semester", priority: "Important", date: "2026-10-06" },
    { id: "ANN007", title: "[ME 2nd Sem] Workshop practice moved", message: "Workshop practice moved to Wednesday 2 PM, Central Workshop.", audience: "Students", department: "Mechanical Engineering", semester: "2nd Semester", priority: "Normal", date: "2026-10-06" },
    { id: "ANN008", title: "End-sem exam timetable released", message: "End-semester examination timetable is out. Check the Examinations page and report clashes by 12 Oct.", audience: "Students", department: "All", semester: "All", priority: "High", date: "2026-10-07" },
    { id: "ANN009", title: "Tech fest Udbhav 2026 registrations open", message: "Registrations open for coding contest, robotics and hackathon. Last date 18 Oct.", audience: "Students", department: "All", semester: "All", priority: "Normal", date: "2026-10-08" },
    { id: "ANN010", title: "Placement drive: Infosys pool campus", message: "Infosys pool drive on 21 Oct for 2027 batch. CGPA 6.5+, no active backlogs. Register via placement cell.", audience: "Students", department: "All", semester: "All", priority: "High", date: "2026-10-09" },
    { id: "ANN011", title: "Mess timings revised for exam week", message: "Breakfast 7-9 AM, lunch 12-2 PM, dinner 7-9:30 PM during exams from 15 Oct.", audience: "All", department: "All", semester: "All", priority: "Important", date: "2026-10-10" },
    { id: "ANN012", title: "[CSE 5th Sem] CN extra class", message: "Extra Computer Networks class Saturday 11 AM, Room 301 to cover Module 4.", audience: "Students", department: "Computer Science", semester: "5th Semester", priority: "Normal", date: "2026-10-11" },
    { id: "ANN013", title: "Library extended hours", message: "Central library open till 10 PM on weekdays from 13 Oct for exam prep.", audience: "All", department: "All", semester: "All", priority: "Normal", date: "2026-10-12" },
    { id: "ANN014", title: "Faculty FDP on outcome-based education", message: "Two-day FDP on OBE and NBA documentation, 16-17 Oct. All faculty to confirm seats.", audience: "Faculty", department: "All", semester: "All", priority: "Important", date: "2026-10-12" },
    { id: "ANN015", title: "[IT 3rd Sem] OS assignment deadline extended", message: "Operating Systems assignment deadline extended to 14 Oct, 11:59 PM.", audience: "Students", department: "Information Technology", semester: "3rd Semester", priority: "Normal", date: "2026-10-13" },
    { id: "ANN016", title: "Hostel warden meeting for freshers", message: "Freshers hostel meeting Sunday 5 PM, BH-1 common room. Attendance mandatory.", audience: "Students", department: "All", semester: "1st Semester", priority: "Important", date: "2026-10-14" },
    { id: "ANN017", title: "[ME 4th Sem] Thermal lab viva schedule", message: "Thermal lab viva from 19 Oct batch-wise. Roll lists pinned outside the lab.", audience: "Students", department: "Mechanical Engineering", semester: "4th Semester", priority: "High", date: "2026-10-15" },
    { id: "ANN018", title: "Sports meet trials", message: "Athletics and cricket selection trials 17 Oct, 6 AM at the main ground.", audience: "Students", department: "All", semester: "All", priority: "Normal", date: "2026-10-16" },
    { id: "ANN019", title: "Fee payment last date", message: "Semester fee payment without late fine closes 31 Oct. Counters open till 5 PM.", audience: "Students", department: "All", semester: "All", priority: "High", date: "2026-10-17" },
    { id: "ANN020", title: "Holiday: Diwali break", message: "Campus closed 20-22 Oct for Diwali. Hostel mess runs on holiday timings.", audience: "All", department: "All", semester: "All", priority: "Important", date: "2026-10-18" }
  ];

  ANN_SEED.forEach(function (s) {
    if (!hasId(anns, s.id)) { anns.push(s); annsDirty = true; }
  });
  // Sort newest date first, cap at 200 (matches campus-hub.js convention).
  // Perf: skip sort + rewrite when nothing changed (was unconditional).
  if (annsDirty) {
    anns.sort(function (a, b) { return String(b.date) < String(a.date) ? -1 : 1; });
    save(ANN_KEY, anns.slice(0, 200));
  }

  /* ---------- 2. STUDENT NOTIFICATIONS (campusStudentNotifications) ----------
     Shape: {id,title,message,type,priority,date,read} */
  var NOT_KEY = "campusStudentNotifications";
  var nots = load(NOT_KEY, null);
  if (!Array.isArray(nots)) nots = [];

  var NOT_SEED = [
    { id: "NOT001", title: "Mid Semester Examination", message: "Mid Semester Examination will begin from 15 October 2026.", type: "Exam", priority: "High", date: "2026-10-02", read: false },
    { id: "NOT002", title: "Data Structures Assignment", message: "Your Data Structures Problem Set is due on 10 October 2026.", type: "Assignment", priority: "Important", date: "2026-10-02", read: false },
    { id: "NOT003", title: "Fee Payment Reminder", message: "Your pending semester fee amount is Rs 5,000.", type: "Fee", priority: "High", date: "2026-10-01", read: false },
    { id: "NOT004", title: "Attendance Alert", message: "Your current attendance is 82%. Maintain regular attendance.", type: "Attendance", priority: "Normal", date: "2026-10-01", read: true },
    { id: "NOT005", title: "Library Book Reminder", message: "Your issued book is due for return on 9 October 2026.", type: "Library", priority: "Important", date: "2026-09-30", read: true },
    { id: "NOT006", title: "Campus Maintenance", message: "Campus maintenance work will be carried out this weekend.", type: "Announcement", priority: "Normal", date: "2026-09-29", read: false },
    { id: "NOT007", title: "DBMS Lab Rescheduled", message: "DBMS lab for IT 4th Sem moves to Friday 10 AM, Lab 3.", type: "Timetable", priority: "Important", date: "2026-10-06", read: false },
    { id: "NOT008", title: "Placement Drive Registration", message: "Infosys pool drive on 21 Oct. Register with the placement cell before 15 Oct.", type: "Placement", priority: "High", date: "2026-10-09", read: false },
    { id: "NOT009", title: "Mess Timings Revised", message: "Dinner will be served 7-9:30 PM during exam week from 15 Oct.", type: "Mess", priority: "Normal", date: "2026-10-10", read: false },
    { id: "NOT010", title: "OS Assignment Extended", message: "Operating Systems assignment deadline extended to 14 Oct.", type: "Assignment", priority: "Normal", date: "2026-10-13", read: false },
    { id: "NOT011", title: "Thermal Lab Viva", message: "ME 4th Sem thermal lab viva starts 19 Oct. Check your batch slot.", type: "Exam", priority: "High", date: "2026-10-15", read: false },
    { id: "NOT012", title: "Library Extended Hours", message: "Central library open till 10 PM on weekdays from 13 Oct.", type: "Library", priority: "Normal", date: "2026-10-12", read: true },
    { id: "NOT013", title: "Fee Receipt Available", message: "Your fee receipt for Rs 10,000 is ready to download from the Fees page.", type: "Fee", priority: "Normal", date: "2026-10-11", read: true },
    { id: "NOT014", title: "Sports Meet Trials", message: "Athletics and cricket trials on 17 Oct, 6 AM at the main ground.", type: "Announcement", priority: "Normal", date: "2026-10-16", read: false },
    { id: "NOT015", title: "Diwali Break Notice", message: "Campus closed 20-22 Oct. Hostel mess runs on holiday timings.", type: "Announcement", priority: "Important", date: "2026-10-18", read: false }
  ];

  var notsAdded = 0;
  NOT_SEED.forEach(function (s) {
    if (!hasId(nots, s.id)) { nots.push(s); notsAdded++; }
  });
  /* Perf: skip sort + rewrite when nothing changed (was unconditional). */
  if (notsAdded > 0) {
    nots.sort(function (a, b) { return new Date(b.date) - new Date(a.date); });
    save(NOT_KEY, nots.slice(0, 200));
  }

  /* ---------- 3. MESS MENU (campusMessMenu) ----------
     Shape: {day,breakfast,lunch,dinner}. Keep a valid existing 7-day menu. */
  var MENU_KEY = "campusMessMenu";
  var menu = load(MENU_KEY, null);
  function validMenu(m) {
    if (!Array.isArray(m) || m.length !== 7) return false;
    var days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    return days.every(function (d) {
      var r = m.filter(function (x) { return x && x.day === d; })[0];
      return r && r.breakfast && r.lunch && r.dinner;
    });
  }
  var FULL_MENU = [
    { day: "Monday", breakfast: "Poha + Jalebi + Tea", lunch: "Dal Tadka, Jeera Rice, Roti, Aloo-Gobi", dinner: "Paneer Butter Masala + Roti + Dal" },
    { day: "Tuesday", breakfast: "Aloo Paratha + Curd + Pickle", lunch: "Rajma, Rice, Roti, Onion Salad", dinner: "Veg Biryani + Raita + Papad" },
    { day: "Wednesday", breakfast: "Idli + Sambar + Coconut Chutney", lunch: "Chole, Rice, Roti, Green Salad", dinner: "Dal Fry + Jeera Rice + Roti" },
    { day: "Thursday", breakfast: "Veg Upma + Tea", lunch: "Veg Kolhapuri + Roti + Dal + Rice", dinner: "Soya Chaap + Roti + Salad" },
    { day: "Friday", breakfast: "Puri + Aloo Sabzi + Halwa", lunch: "Sambar Rice + Papad + Curd", dinner: "Special Thali (Paneer, Dal Makhani, Naan, Gulab Jamun)" },
    { day: "Saturday", breakfast: "Masala Dosa + Sambar + Chutney", lunch: "Veg Pulao + Dal + Raita", dinner: "Kadhai Veg + Naan + Dal" },
    { day: "Sunday", breakfast: "Chole Bhature + Lassi", lunch: "Special Thali (Shahi Paneer, Pulao, Naan, Ice Cream)", dinner: "Khichdi + Kadhi + Papad" }
  ];
  if (!validMenu(menu)) { menu = FULL_MENU; save(MENU_KEY, menu); }

  /* ---------- 4. MESS FEEDBACK (campusMessFeedback) ----------
     Shape: {id,meal,rating,text,studentId,at}. Ratings weighted ~4. */
  var FB_KEY = "campusMessFeedback";
  var fb = load(FB_KEY, null);
  if (!Array.isArray(fb)) fb = [];

  var FB_SEED = [
    { id: "MESS-DEMO1", meal: "Lunch", rating: 4, text: "Good dal today", studentId: "STU001", at: "2026-10-06T12:30:00.000Z" },
    { id: "MESS-0002", meal: "Breakfast", rating: 5, text: "Aloo paratha was fresh and crisp. Curd was good too.", studentId: "STU002", at: "2026-10-06T08:15:00.000Z" },
    { id: "MESS-0003", meal: "Dinner", rating: 4, text: "Paneer quantity was decent, rotis were soft.", studentId: "STU003", at: "2026-10-06T20:05:00.000Z" },
    { id: "MESS-0004", meal: "Lunch", rating: 3, text: "Rajma was a bit salty today.", studentId: "STU001", at: "2026-10-05T12:45:00.000Z" },
    { id: "MESS-0005", meal: "Breakfast", rating: 4, text: "Poha with peanuts was tasty. Tea was hot.", studentId: "STU004", at: "2026-10-05T08:20:00.000Z" },
    { id: "MESS-0006", meal: "Dinner", rating: 5, text: "Veg biryani + raita combo was excellent.", studentId: "STU002", at: "2026-10-05T20:10:00.000Z" },
    { id: "MESS-0007", meal: "Lunch", rating: 4, text: "Chole rice portion was filling.", studentId: "STU005", at: "2026-10-04T12:35:00.000Z" },
    { id: "MESS-0008", meal: "Breakfast", rating: 4, text: "Idli sambar was good, chutney could be more.", studentId: "STU001", at: "2026-10-04T08:25:00.000Z" },
    { id: "MESS-0009", meal: "Dinner", rating: 3, text: "Dal fry was thin today.", studentId: "STU006", at: "2026-10-04T19:55:00.000Z" },
    { id: "MESS-0010", meal: "Lunch", rating: 5, text: "Sambar rice with papad was great.", studentId: "STU003", at: "2026-10-03T12:40:00.000Z" },
    { id: "MESS-0011", meal: "Breakfast", rating: 4, text: "Puri sabzi was fresh, halwa was a nice touch.", studentId: "STU007", at: "2026-10-03T08:30:00.000Z" },
    { id: "MESS-0012", meal: "Dinner", rating: 4, text: "Special thali was worth it. Gulab jamun was soft.", studentId: "STU002", at: "2026-10-03T20:15:00.000Z" },
    { id: "MESS-0013", meal: "Lunch", rating: 2, text: "Pulao was undercooked, please check.", studentId: "STU008", at: "2026-10-02T12:50:00.000Z" },
    { id: "MESS-0014", meal: "Breakfast", rating: 5, text: "Masala dosa was crispy and perfect.", studentId: "STU001", at: "2026-10-02T08:10:00.000Z" },
    { id: "MESS-0015", meal: "Dinner", rating: 4, text: "Kadhai veg with naan was good.", studentId: "STU004", at: "2026-10-02T20:00:00.000Z" },
    { id: "MESS-0016", meal: "Lunch", rating: 4, text: "Sunday special thali was filling.", studentId: "STU005", at: "2026-10-01T12:30:00.000Z" },
    { id: "MESS-0017", meal: "Breakfast", rating: 3, text: "Chole bhature oil was a bit much.", studentId: "STU006", at: "2026-10-01T08:35:00.000Z" },
    { id: "MESS-0018", meal: "Dinner", rating: 4, text: "Khichdi kadhi was light and comforting.", studentId: "STU003", at: "2026-10-01T19:50:00.000Z" },
    { id: "MESS-0019", meal: "Lunch", rating: 5, text: "Dal, rice, roti, sabzi - homely taste today.", studentId: "STU007", at: "2026-09-30T12:40:00.000Z" },
    { id: "MESS-0020", meal: "Breakfast", rating: 4, text: "Bread upma was decent, serving was quick.", studentId: "STU002", at: "2026-09-30T08:20:00.000Z" },
    { id: "MESS-0021", meal: "Dinner", rating: 1, text: "Soya chaap was burnt and cold. Please improve.", studentId: "STU008", at: "2026-09-29T20:05:00.000Z" },
    { id: "MESS-0022", meal: "Lunch", rating: 4, text: "Veg kolhapuri spice level was just right.", studentId: "STU001", at: "2026-09-29T12:35:00.000Z" },
    { id: "MESS-0023", meal: "Breakfast", rating: 5, text: "Upma with filter coffee hit the spot.", studentId: "STU004", at: "2026-09-28T08:15:00.000Z" },
    { id: "MESS-0024", meal: "Dinner", rating: 3, text: "Jeera rice was good but dal portion small.", studentId: "STU005", at: "2026-09-28T20:10:00.000Z" },
    { id: "MESS-0025", meal: "Lunch", rating: 4, text: "Overall consistent quality this week.", studentId: "STU006", at: "2026-09-27T12:45:00.000Z" }
  ];

  var fbAdded = 0;
  FB_SEED.forEach(function (s) {
    if (!hasId(fb, s.id)) { fb.push(s); fbAdded++; }
  });
  /* Perf: skip sort + rewrite when nothing changed (was unconditional). */
  if (fbAdded > 0) {
    fb.sort(function (a, b) { return new Date(b.at) - new Date(a.at); });
    save(FB_KEY, fb.slice(0, 200));
  }

  /* Perf: log in-memory lengths (was re-parsing all 4 keys from storage). */
  console.log("[seed-07-notices] announcements: " + anns.length +
    ", notifications: " + nots.length +
    ", messMenu days: " + (Array.isArray(menu) ? menu.length : 0) +
    ", messFeedback: " + fb.length);
})();
