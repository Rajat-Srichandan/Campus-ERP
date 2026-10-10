/* ============================================================
   lang-faculty.js — Hindi full-content pack for faculty pages
   (vanilla IIFE, additive; loads AFTER lang.js):
     <script src="script.js"></script>
     <script src="campus-hub.js"></script>
     <script src="lang.js"></script>
     <script src="lang-faculty.js"></script>
   - Merges faculty.* keys into window.CAMPUS_I18N via Object.assign
     for en + hi. English values equal the on-page fallback text.
   - Re-applies the current language so new keys take effect
     without requiring a toggle.
   - Scope: faculty-dashboard. IDs/handlers untouched.
     Brand ("Campus"), names, IDs, course codes, room numbers,
     times, percentages, marks and the avatar initials/email are
     intentionally left untagged (non-translatable).
   ============================================================ */
(function () {
   "use strict";

   var FACULTY_EN = {
     /* ---- nav / sidebar ---- */
     "faculty.nav.dashboard": "Dashboard",
     "faculty.nav.myStudents": "My Students",
     "faculty.nav.mySubjects": "My Subjects",
     "faculty.nav.timetable": "Timetable",
     "faculty.nav.attendance": "Attendance",
     "faculty.nav.assignments": "Assignments",
     "faculty.nav.examinations": "Examinations",
     "faculty.nav.studentResults": "Student Results",
     "faculty.nav.announcements": "Announcements",
     "faculty.nav.logout": "Logout",

     /* ---- topbar ---- */
     "faculty.topbar.online": "Online",
     "faculty.topbar.dark": "Dark",

     /* ---- profile ---- */
     "faculty.profile.member": "Faculty Member",

     /* ---- header ---- */
     "faculty.header.title": "Faculty Dashboard",
     "faculty.header.subtitle": "Manage your classes and students.",

     /* ---- stats ---- */
     "faculty.stats.totalStudents": "Total Students",
     "faculty.stats.subjects": "Subjects",
     "faculty.stats.avgAttendance": "Average Attendance",
     "faculty.stats.pendingAssignments": "Pending Assignments",

     /* ---- today's classes ---- */
     "faculty.classes.title": "Today's Classes",
     "faculty.classes.viewTimetable": "View Timetable",
     "faculty.classes.attendanceBtn": "Attendance",

     /* ---- quick actions ---- */
     "faculty.actions.title": "Quick Actions",
     "faculty.actions.markAttendance": "Mark Attendance",
     "faculty.actions.createAssignment": "Create Assignment",
     "faculty.actions.enterMarks": "Enter Marks",
     "faculty.actions.createAnnouncement": "Create Announcement",

     /* ---- student performance ---- */
     "faculty.performance.title": "Student Performance",
     "faculty.performance.viewAll": "View All",
     "faculty.performance.colStudent": "Student",
     "faculty.performance.colAttendance": "Attendance",
     "faculty.performance.colMarks": "Marks",
     "faculty.performance.colStatus": "Status",
     "faculty.performance.excellent": "Excellent",
     "faculty.performance.good": "Good",
     "faculty.performance.attention": "Attention"
   };

   var FACULTY_HI = {
     /* ---- nav / sidebar ---- */
     "faculty.nav.dashboard": "डैशबोर्ड",
     "faculty.nav.myStudents": "मेरे छात्र",
     "faculty.nav.mySubjects": "मेरे विषय",
     "faculty.nav.timetable": "समय सारणी",
     "faculty.nav.attendance": "उपस्थिति",
     "faculty.nav.assignments": "असाइनमेंट",
     "faculty.nav.examinations": "परीक्षाएं",
     "faculty.nav.studentResults": "छात्र परिणाम",
     "faculty.nav.announcements": "घोषणाएं",
     "faculty.nav.logout": "लॉग आउट",

     /* ---- topbar ---- */
     "faculty.topbar.online": "ऑनलाइन",
     "faculty.topbar.dark": "डार्क",

     /* ---- profile ---- */
     "faculty.profile.member": "शिक्षक सदस्य",

     /* ---- header ---- */
     "faculty.header.title": "शिक्षक डैशबोर्ड",
     "faculty.header.subtitle": "अपनी कक्षाओं और छात्रों का प्रबंधन करें।",

     /* ---- stats ---- */
     "faculty.stats.totalStudents": "कुल छात्र",
     "faculty.stats.subjects": "विषय",
     "faculty.stats.avgAttendance": "औसत उपस्थिति",
     "faculty.stats.pendingAssignments": "लंबित असाइनमेंट",

     /* ---- today's classes ---- */
     "faculty.classes.title": "आज की कक्षाएं",
     "faculty.classes.viewTimetable": "समय सारणी देखें",
     "faculty.classes.attendanceBtn": "उपस्थिति",

     /* ---- quick actions ---- */
     "faculty.actions.title": "त्वरित कार्य",
     "faculty.actions.markAttendance": "उपस्थिति दर्ज करें",
     "faculty.actions.createAssignment": "असाइनमेंट बनाएं",
     "faculty.actions.enterMarks": "अंक दर्ज करें",
     "faculty.actions.createAnnouncement": "घोषणा बनाएं",

     /* ---- student performance ---- */
     "faculty.performance.title": "छात्र प्रदर्शन",
     "faculty.performance.viewAll": "सभी देखें",
     "faculty.performance.colStudent": "छात्र",
     "faculty.performance.colAttendance": "उपस्थिति",
     "faculty.performance.colMarks": "अंक",
     "faculty.performance.colStatus": "स्थिति",
     "faculty.performance.excellent": "उत्कृष्ट",
     "faculty.performance.good": "अच्छा",
     "faculty.performance.attention": "ध्यान"
   };

   /* Merge into the lang.js dict (additive, no clobber of nav/common keys). */
   try {
     var I18N = window.CAMPUS_I18N;
     if (I18N && I18N.en && I18N.hi) {
       Object.assign(I18N.en, FACULTY_EN);
       Object.assign(I18N.hi, FACULTY_HI);
     } else {
       window.CAMPUS_I18N = { en: FACULTY_EN, hi: FACULTY_HI };
     }
   } catch (e) {
     try { window.CAMPUS_I18N = { en: FACULTY_EN, hi: FACULTY_HI }; } catch (e2) {}
   }

   /* Re-apply current language so the new keys take effect immediately. */
   try {
     if (typeof window.applyLang === "function" && typeof window.getLang === "function") {
       window.applyLang(window.getLang());
     }
   } catch (e) {}

   /* Return key counts for verification */
   return {
     path: "lang-faculty.js",
     enKeys: Object.keys(FACULTY_EN).length,
     hiKeys: Object.keys(FACULTY_HI).length
   };
})();
