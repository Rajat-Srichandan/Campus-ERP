/* ============================================================
   lang-admin.js — Hindi full-content pack for admin core pages
   (vanilla IIFE, additive; loads AFTER lang.js):
     <script src="lang.js"></script>
     <script src="lang-admin.js"></script>
   - Merges admin.* keys into window.CAMPUS_I18N via Object.assign
     for en + hi. English values equal the on-page fallback text.
   - Re-applies the current language so new keys take effect
     without requiring a toggle.
   - Scope: admin-dashboard, ops-dashboard, reports, students,
     faculty, departments, courses. IDs/handlers untouched.
   ============================================================ */
(function () {
  "use strict";

  var ADMIN_EN = {
    /* ---- admin-dashboard ---- */
    "admin.dashboard.totalStudents": "Total Students",
    "admin.dashboard.totalFaculty": "Total Faculty",
    "admin.dashboard.totalCourses": "Total Courses",
    "admin.dashboard.totalFees": "Total Fees",
    "admin.dashboard.attendance": "Attendance",
    "admin.dashboard.recentActivity": "Recent Activity",
    "admin.dashboard.studentEnrollments": "Student Enrollments",
    "admin.dashboard.facultyHiring": "Faculty Hiring",
    "admin.dashboard.courseCompletions": "Course Completions",

    /* ---- ops-dashboard ---- */
    "admin.ops.overview": "Overview",
    "admin.ops.liveOps": "Live Ops",
    "admin.ops.pending": "Pending",
    "admin.ops.resolved": "Resolved",
    "admin.ops.hostelCapacity": "Hostel Capacity",
    "admin.ops.busAllocation": "Bus Allocation",
    "admin.ops.messRating": "Mess Rating",
    "admin.ops.maintenance": "Maintenance",
    "admin.ops.electrical": "Electrical",
    "admin.ops.cleaning": "Cleaning",
    "admin.ops.overallCompletion": "Overall Completion",

    /* ---- reports ---- */
    "admin.reports.title": "Reports",
    "admin.reports.financialOverview": "Financial Overview",
    "admin.reports.revenueCollected": "Revenue Collected",
    "admin.reports.expenses": "Expenses",
    "admin.reports.totalStudents": "Total Students",
    "admin.reports.totalFees": "Total Fees",
    "admin.reports.totalCourses": "Total Courses",
    "admin.reports.totalFaculty": "Total Faculty",
    "admin.reports.refreshReports": "Refresh Reports",

    /* ---- students ---- */
    "admin.students.title": "Students",
    "admin.students.addStudent": "Add Student",
    "admin.students.name": "Name",
    "admin.students.studentId": "Student ID",
    "admin.students.course": "Course",
    "admin.students.semester": "Semester",
    "admin.students.email": "Email",
    "admin.students.phone": "Phone",
    "admin.students.status": "Status",
    "admin.students.active": "Active",
    "admin.students.inactive": "Inactive",
    "admin.students.admittedOn": "Admitted On",
    "admin.students.actions": "Actions",
    "admin.students.thId": "ID",
    "admin.students.thName": "Name",
    "admin.students.thEmail": "Email",
    "admin.students.thDept": "Department",
    "admin.students.thSemester": "Semester",
    "admin.students.thAction": "Action",
    "admin.students.delete": "Delete",
    "admin.students.countZero": "{0} students",
    "admin.students.countOne": "1 student",
    "admin.students.dupId": "A student with this ID already exists.",
    "admin.students.addSuccess": "Student added successfully!",
    "admin.students.delConfirm": "Are you sure you want to delete this student?",
    "admin.students.subtitle": "Add and manage campus students.",
    "admin.students.addTitle": "Add New Student",
    "admin.students.fullName": "Full Name",
    "admin.students.phName": "Enter student name",
    "admin.students.phId": "e.g. STU001",
    "admin.students.phEmail": "student@email.com",
    "admin.students.department": "Department",
    "admin.students.selDept": "Select Department",
    "admin.students.selSem": "Select Semester",
    "admin.students.listTitle": "Student List",
    "admin.students.searchPh": "Search students...",
    "admin.students.thSem": "Semester",
    "admin.students.empty": "No students found.",
    "admin.students.fillRequired": "Please fill in all required fields.",

    /* ---- faculty ---- */
    "admin.faculty.title": "Faculty",
    "admin.faculty.addFaculty": "Add Faculty",
    "admin.faculty.employeeId": "Employee ID",
    "admin.faculty.department": "Department",
    "admin.faculty.joinDate": "Join Date",
    "admin.faculty.thId": "ID",
    "admin.faculty.thName": "Name",
    "admin.faculty.thEmail": "Email",
    "admin.faculty.thDept": "Department",
    "admin.faculty.thSubject": "Subject",
    "admin.faculty.thAction": "Action",
    "admin.faculty.delete": "Delete",
    "admin.faculty.countZero": "{0} faculty members",
    "admin.faculty.countOne": "1 faculty member",
    "admin.faculty.dupId": "A faculty member with this ID already exists.",
    "admin.faculty.addSuccess": "Faculty added successfully!",
    "admin.faculty.delConfirm": "Are you sure you want to delete this faculty member?",

    /* ---- departments ---- */
    "admin.departments.thCode": "Code",
    "admin.departments.thName": "Name",
    "admin.departments.thAction": "Action",
    "admin.departments.delete": "Delete",
    "admin.departments.countZero": "{0} departments",
    "admin.departments.countOne": "1 department",
    "admin.departments.dupCode": "This department code already exists.",
    "admin.departments.addSuccess": "Department added successfully!",
    "admin.departments.delConfirm": "Are you sure you want to delete this department?",
    "admin.departments.hasCourses": "This department has courses assigned to it. Remove those courses first.",

    /* ---- courses ---- */
    "admin.courses.thCode": "Code",
    "admin.courses.thName": "Name",
    "admin.courses.thDept": "Department",
    "admin.courses.thSemester": "Semester",
    "admin.courses.thAction": "Action",
    "admin.courses.delete": "Delete",
    "admin.courses.countZero": "{0} courses",
    "admin.courses.countOne": "1 course",
    "admin.courses.dupCode": "This course code already exists.",
    "admin.courses.addSuccess": "Course added successfully!",
    "admin.courses.delConfirm": "Are you sure you want to delete this course?",

    /* ---- users ---- */
    "admin.users.title": "User Management",
    "admin.users.addUser": "Add User",
    "admin.users.role": "Role",
    "admin.users.superAdmin": "Super Admin",
    "admin.users.admin": "Admin",
    "admin.users.faculty": "Faculty",
    "admin.users.student": "Student"
  };

  var ADMIN_HI = {
    /* ---- admin-dashboard ---- */
    "admin.dashboard.totalStudents": "कुल छात्र",
    "admin.dashboard.totalFaculty": "कुल शिक्षक",
    "admin.dashboard.totalCourses": "कुल पाठ्यक्रम",
    "admin.dashboard.totalFees": "कुल शुल्क",
    "admin.dashboard.attendance": "उपस्थिति",
    "admin.dashboard.recentActivity": "हाल की गतिविधि",
    "admin.dashboard.studentEnrollments": "छात्र नामांकन",
    "admin.dashboard.facultyHiring": "शिक्षक भर्ती",
    "admin.dashboard.courseCompletions": "पाठ्यक्रम पूर्ण",

    /* ---- ops-dashboard ---- */
    "admin.ops.overview": "अवलोकन",
    "admin.ops.liveOps": "लाइव ऑप्स",
    "admin.ops.pending": "लंबित",
    "admin.ops.resolved": "हल",
    "admin.ops.hostelCapacity": "छात्रावास क्षमता",
    "admin.ops.busAllocation": "बस आवंटन",
    "admin.ops.messRating": "मेस रेटिंग",
    "admin.ops.maintenance": "रखरखाव",
    "admin.ops.electrical": "विद्युत",
    "admin.ops.cleaning": "सफाई",
    "admin.ops.overallCompletion": "कुल पूर्णता",

    /* ---- reports ---- */
    "admin.reports.title": "रिपोर्ट",
    "admin.reports.financialOverview": "वित्तीय अवलोकन",
    "admin.reports.revenueCollected": "राजस्व एकत्रित",
    "admin.reports.expenses": "खर्च",
    "admin.reports.totalStudents": "कुल छात्र",
    "admin.reports.totalFees": "कुल शुल्क",
    "admin.reports.totalCourses": "कुल पाठ्यक्रम",
    "admin.reports.totalFaculty": "कुल शिक्षक",
    "admin.reports.refreshReports": "रिपोर्ट ताज़ा करें",

    /* ---- students ---- */
    "admin.students.title": "छात्र",
    "admin.students.addStudent": "छात्र जोड़ें",
    "admin.students.name": "नाम",
    "admin.students.studentId": "छात्र ID",
    "admin.students.course": "पाठ्यक्रम",
    "admin.students.semester": "सेमेस्टर",
    "admin.students.email": "ईमेल",
    "admin.students.phone": "फोन",
    "admin.students.status": "स्थिति",
    "admin.students.active": "सक्रिय",
    "admin.students.inactive": "निष्क्रिय",
    "admin.students.admittedOn": "प्रवेश तिथि",
    "admin.students.actions": "कार्य",
    "admin.students.thId": "ID",
    "admin.students.thName": "नाम",
    "admin.students.thEmail": "ईमेल",
    "admin.students.thDept": "विभाग",
    "admin.students.thSemester": "सेमेस्टर",
    "admin.students.thAction": "कार्य",
    "admin.students.delete": "हटाएं",
    "admin.students.countZero": "{0} छात्र",
    "admin.students.countOne": "1 छात्र",
    "admin.students.dupId": "इस ID वाला छात्र पहले से मौजूद है।",
    "admin.students.addSuccess": "छात्र सफलतापूर्वक जोड़ा गया!",
    "admin.students.delConfirm": "क्या आप इस छात्र को हटाना चाहते हैं?",
    "admin.students.subtitle": "कैंपस छात्रों को जोड़ें और प्रबंधित करें।",
    "admin.students.addTitle": "नया छात्र जोड़ें",
    "admin.students.fullName": "पूरा नाम",
    "admin.students.phName": "छात्र का नाम दर्ज करें",
    "admin.students.phId": "जैसे STU001",
    "admin.students.phEmail": "student@email.com",
    "admin.students.department": "विभाग",
    "admin.students.selDept": "विभाग चुनें",
    "admin.students.selSem": "सेमेस्टर चुनें",
    "admin.students.listTitle": "छात्र सूची",
    "admin.students.searchPh": "छात्र खोजें...",
    "admin.students.thSem": "सेमेस्टर",
    "admin.students.empty": "कोई छात्र नहीं मिला।",
    "admin.students.fillRequired": "कृपया सभी आवश्यक फ़ील्ड भरें।",

    /* ---- faculty ---- */
    "admin.faculty.title": "शिक्षक",
    "admin.faculty.addFaculty": "शिक्षक जोड़ें",
    "admin.faculty.employeeId": "कर्मचारी ID",
    "admin.faculty.department": "विभाग",
    "admin.faculty.joinDate": "शामिल होने की तिथि",
    "admin.faculty.thId": "ID",
    "admin.faculty.thName": "नाम",
    "admin.faculty.thEmail": "ईमेल",
    "admin.faculty.thDept": "विभाग",
    "admin.faculty.thSubject": "विषय",
    "admin.faculty.thAction": "कार्य",
    "admin.faculty.delete": "हटाएं",
    "admin.faculty.countZero": "{0} शिक्षक",
    "admin.faculty.countOne": "1 शिक्षक",
    "admin.faculty.dupId": "इस ID वाला शिक्षक पहले से मौजूद है।",
    "admin.faculty.addSuccess": "शिक्षक सफलतापूर्वक जोड़ा गया!",
    "admin.faculty.delConfirm": "क्या आप इस शिक्षक को हटाना चाहते हैं?",

    /* ---- departments ---- */
    "admin.departments.thCode": "कोड",
    "admin.departments.thName": "नाम",
    "admin.departments.thAction": "कार्य",
    "admin.departments.delete": "हटाएं",
    "admin.departments.countZero": "{0} विभाग",
    "admin.departments.countOne": "1 विभाग",
    "admin.departments.dupCode": "यह विभाग कोड पहले से मौजूद है।",
    "admin.departments.addSuccess": "विभाग सफलतापूर्वक जोड़ा गया!",
    "admin.departments.delConfirm": "क्या आप इस विभाग को हटाना चाहते हैं?",
    "admin.departments.hasCourses": "इस विभाग में पाठ्यक्रम असाइन किए गए हैं। पहले उन पाठ्यक्रमों को हटाएं।",

    /* ---- courses ---- */
    "admin.courses.thCode": "कोड",
    "admin.courses.thName": "नाम",
    "admin.courses.thDept": "विभाग",
    "admin.courses.thSemester": "सेमेस्टर",
    "admin.courses.thAction": "कार्य",
    "admin.courses.delete": "हटाएं",
    "admin.courses.countZero": "{0} पाठ्यक्रम",
    "admin.courses.countOne": "1 पाठ्यक्रम",
    "admin.courses.dupCode": "यह पाठ्यक्रम कोड पहले से मौजूद है।",
    "admin.courses.addSuccess": "पाठ्यक्रम सफलतापूर्वक जोड़ा गया!",
    "admin.courses.delConfirm": "क्या आप इस पाठ्यक्रम को हटाना चाहते हैं?",

    /* ---- users ---- */
    "admin.users.title": "उपयोगकर्ता प्रबंधन",
    "admin.users.addUser": "उपयोगकर्ता जोड़ें",
    "admin.users.role": "भूमिका",
    "admin.users.superAdmin": "सुपर एडमिन",
    "admin.users.admin": "एडमिन",
    "admin.users.faculty": "शिक्षक",
    "admin.users.student": "छात्र"
  };

  /* Merge into the lang.js dict (additive, no clobber of nav/common keys). */
  try {
    var I18N = window.CAMPUS_I18N;
    if (I18N && I18N.en && I18N.hi) {
      Object.assign(I18N.en, ADMIN_EN);
      Object.assign(I18N.hi, ADMIN_HI);
    } else {
      window.CAMPUS_I18N = { en: ADMIN_EN, hi: ADMIN_HI };
    }
  } catch (e) {
    try { window.CAMPUS_I18N = { en: ADMIN_EN, hi: ADMIN_HI }; } catch (e2) {}
  }

  /* Re-apply current language so the new keys take effect immediately. */
  try {
    if (typeof window.applyLang === "function" && typeof window.getLang === "function") {
      window.applyLang(window.getLang());
    }
  } catch (e) {}

  /* Return key counts for verification */
  return {
    path: "lang-admin.js",
    enKeys: Object.keys(ADMIN_EN).length,
    hiKeys: Object.keys(ADMIN_HI).length
  };
})();
