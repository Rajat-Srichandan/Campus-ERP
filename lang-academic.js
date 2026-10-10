/* ============================================================
   lang-academic.js — Hindi full-content pack for academic pages
   (vanilla IIFE, additive; loads AFTER lang.js):
     <script src="lang.js"></script>
     <script src="lang-academic.js"></script>
   - Merges academic.* keys into window.CAMPUS_I18N via Object.assign
     for en + hi. English values equal the on-page fallback text.
   - Re-applies the current language so new keys take effect
     without requiring a toggle.
   - Scope: courses, attendance, timetable, assignments, fees,
     examinations, library. IDs/handlers untouched.
   ============================================================ */
(function () {
  "use strict";

  var ACADEMIC_EN = {
    /* ---- courses ---- */
    "academic.courses.title": "Courses",
    "academic.courses.addCourse": "Add Course",
    "academic.courses.courseCode": "Course Code",
    "academic.courses.courseName": "Course Name",
    "academic.courses.department": "Department",
    "academic.courses.credits": "Credits",
    "academic.courses.instructor": "Instructor",
    "academic.courses.enrolled": "Enrolled",
    "academic.courses.actions": "Actions",
    "academic.courses.departments": "Departments",

    /* ---- attendance ---- */
    "academic.attendance.title": "Attendance",
    "academic.attendance.markAttendance": "Mark Attendance",
    "academic.attendance.student": "Student",
    "academic.attendance.rollNo": "Roll No",
    "academic.attendance.status": "Status",
    "academic.attendance.present": "Present",
    "academic.attendance.absent": "Absent",
    "academic.attendance.late": "Late",
    "academic.attendance.date": "Date",
    "academic.attendance.class": "Class",

    /* ---- timetable ---- */
    "academic.timetable.title": "Timetable",
    "academic.timetable.addSchedule": "Add Schedule",
    "academic.timetable.day": "Day",
    "academic.timetable.course": "Course",
    "academic.timetable.faculty": "Faculty",
    "academic.timetable.time": "Time",
    "academic.timetable.roomLab": "Room/Lab",
    "academic.timetable.type": "Type",
    "academic.timetable.thCourse": "Course",
    "academic.timetable.thFaculty": "Faculty",
    "academic.timetable.thDay": "Day",
    "academic.timetable.thTime": "Time",
    "academic.timetable.thRoom": "Room/Lab",
    "academic.timetable.thSemester": "Semester",
    "academic.timetable.thSem": "Semester",
    "academic.timetable.thAction": "Action",
    "academic.timetable.delete": "Delete",
    "academic.timetable.adminOnly": "Only Admin can delete.",
    "academic.timetable.addSuccess": "Class schedule added successfully!",
    "academic.timetable.delConfirm": "Are you sure you want to delete this schedule?",
    "academic.timetable.noRecords": "No timetable records found.",
    "academic.timetable.endTimeError": "End time must be later than start time.",

    /* ---- assignments ---- */
    "academic.assignments.title": "Assignments",
    "academic.assignments.addAssignment": "Add Assignment",
    "academic.assignments.titleLabel": "Title",
    "academic.assignments.subject": "Subject",
    "academic.assignments.type": "Type",
    "academic.assignments.description": "Description",
    "academic.assignments.dueDate": "Due Date",
    "academic.assignments.maxMarks": "Max Marks",
    "academic.assignments.created": "Created",
    "academic.assignments.studyMaterials": "Study Materials",
    "academic.assignments.addMaterial": "Add Material",
    "academic.assignments.resourceUrl": "Resource URL",

    /* ---- fees ---- */
    "academic.fees.title": "Fees",
    "academic.fees.addFeeRecord": "Add Fee Record",
    "academic.fees.student": "Student",
    "academic.fees.studentId": "Student ID",
    "academic.fees.tuition": "Tuition",
    "academic.fees.hostel": "Hostel",
    "academic.fees.otherFee": "Other Fee",
    "academic.fees.amountPaid": "Amount Paid",
    "academic.fees.amountDue": "Amount Due",
    "academic.fees.total": "Total",
    "academic.fees.status": "Status",
    "academic.fees.paid": "Paid",
    "academic.fees.pending": "Pending",
    "academic.fees.overdue": "Overdue",
    "academic.fees.thStudent": "Student",
    "academic.fees.thStudentId": "Student ID",
    "academic.fees.thSemester": "Semester",
    "academic.fees.thTotal": "Total",
    "academic.fees.thPaid": "Paid",
    "academic.fees.thDue": "Due",
    "academic.fees.thStatus": "Status",
    "academic.fees.thAction": "Action",
    "academic.fees.delete": "Delete",
    "academic.fees.noRecords": "No fee records found.",
    "academic.fees.addSuccess": "Fee record added successfully!",
    "academic.fees.delConfirm": "Are you sure you want to delete this fee record?",
    "academic.fees.paidTooMuch": "Paid amount cannot be greater than the total fee.",

    /* ---- examinations ---- */
    "academic.examinations.title": "Examinations",
    "academic.examinations.addExam": "Add Exam",
    "academic.examinations.examName": "Exam Name",
    "academic.examinations.course": "Course",
    "academic.examinations.semester": "Semester",
    "academic.examinations.date": "Date",
    "academic.examinations.startTime": "Start Time",
    "academic.examinations.endTime": "End Time",
    "academic.examinations.maximumMarks": "Maximum Marks",
    "academic.examinations.addResult": "Add Result",
    "academic.examinations.enterStudentResult": "Enter Student Result",
    "academic.examinations.marksObtained": "Marks Obtained",
    "academic.examinations.result": "Result",
    "academic.examinations.pass": "Pass",
    "academic.examinations.fail": "Fail",

    /* ---- library ---- */
    "academic.library.title": "Library",
    "academic.library.addBook": "Add Book",
    "academic.library.titleLabel": "Title",
    "academic.library.author": "Author",
    "academic.library.isbn": "ISBN",
    "academic.library.publisher": "Publisher",
    "academic.library.year": "Year",
    "academic.library.quantity": "Quantity",
    "academic.library.available": "Available",
    "academic.library.issueBook": "Issue Book",
    "academic.library.issueDate": "Issue Date",
    "academic.library.returnDate": "Return Date"
  };

  var ACADEMIC_HI = {
    /* ---- courses ---- */
    "academic.courses.title": "पाठ्यक्रम",
    "academic.courses.addCourse": "पाठ्यक्रम जोड़ें",
    "academic.courses.courseCode": "पाठ्यक्रम कोड",
    "academic.courses.courseName": "पाठ्यक्रम नाम",
    "academic.courses.department": "विभाग",
    "academic.courses.credits": "क्रेडिट",
    "academic.courses.instructor": "अनुदेशक",
    "academic.courses.enrolled": "नामांकित",
    "academic.courses.actions": "कार्य",
    "academic.courses.departments": "विभाग",

    /* ---- attendance ---- */
    "academic.attendance.title": "उपस्थिति",
    "academic.attendance.markAttendance": "उपस्थिति दर्ज करें",
    "academic.attendance.student": "छात्र",
    "academic.attendance.rollNo": "रोल नं",
    "academic.attendance.status": "स्थिति",
    "academic.attendance.present": "उपस्थित",
    "academic.attendance.absent": "अनुपस्थित",
    "academic.attendance.late": "देरी",
    "academic.attendance.date": "तिथि",
    "academic.attendance.class": "कक्षा",

    /* ---- timetable ---- */
    "academic.timetable.title": "समय सारणी",
    "academic.timetable.addSchedule": "शेड्यूल जोड़ें",
    "academic.timetable.day": "दिन",
    "academic.timetable.course": "पाठ्यक्रम",
    "academic.timetable.faculty": "शिक्षक",
    "academic.timetable.time": "समय",
    "academic.timetable.roomLab": "कमरा/लैब",
    "academic.timetable.type": "प्रकार",
    "academic.timetable.thCourse": "पाठ्यक्रम",
    "academic.timetable.thFaculty": "शिक्षक",
    "academic.timetable.thDay": "दिन",
    "academic.timetable.thTime": "समय",
    "academic.timetable.thRoom": "कमरा/लैब",
    "academic.timetable.thSemester": "सेमेस्टर",
    "academic.timetable.thSem": "सेमेस्टर",
    "academic.timetable.thAction": "कार्य",
    "academic.timetable.delete": "हटाएं",
    "academic.timetable.adminOnly": "केवल एडमिन ही हटा सकता है।",
    "academic.timetable.addSuccess": "कक्षा शेड्यूल सफलतापूर्वक जोड़ा गया!",
    "academic.timetable.delConfirm": "क्या आप इस शेड्यूल को हटाना चाहते हैं?",
    "academic.timetable.noRecords": "कोई समय सारणी रिकॉर्ड नहीं मिला।",
    "academic.timetable.endTimeError": "अंत समय प्रारंभ समय से बाद का होना चाहिए।",

    /* ---- assignments ---- */
    "academic.assignments.title": "असाइनमेंट",
    "academic.assignments.addAssignment": "असाइनमेंट जोड़ें",
    "academic.assignments.titleLabel": "शीर्षक",
    "academic.assignments.subject": "विषय",
    "academic.assignments.type": "प्रकार",
    "academic.assignments.description": "विवरण",
    "academic.assignments.dueDate": "देय तिथि",
    "academic.assignments.maxMarks": "अधिकतम अंक",
    "academic.assignments.created": "बनाया गया",
    "academic.assignments.studyMaterials": "अध्ययन सामग्री",
    "academic.assignments.addMaterial": "सामग्री जोड़ें",
    "academic.assignments.resourceUrl": "संसाधन URL",

    /* ---- fees ---- */
    "academic.fees.title": "शुल्क",
    "academic.fees.addFeeRecord": "शुल्क रिकॉर्ड जोड़ें",
    "academic.fees.student": "छात्र",
    "academic.fees.studentId": "छात्र ID",
    "academic.fees.tuition": "ट्यूशन",
    "academic.fees.hostel": "छात्रावास",
    "academic.fees.otherFee": "अन्य शुल्क",
    "academic.fees.amountPaid": "भुगतान राशि",
    "academic.fees.amountDue": "देय राशि",
    "academic.fees.total": "कुल",
    "academic.fees.status": "स्थिति",
    "academic.fees.paid": "भुगतान किया",
    "academic.fees.pending": "लंबित",
    "academic.fees.overdue": "पिछला देय",
    "academic.fees.thStudent": "छात्र",
    "academic.fees.thStudentId": "छात्र ID",
    "academic.fees.thSemester": "सेमेस्टर",
    "academic.fees.thTotal": "कुल",
    "academic.fees.thPaid": "भुगतान",
    "academic.fees.thDue": "देय",
    "academic.fees.thStatus": "स्थिति",
    "academic.fees.thAction": "कार्य",
    "academic.fees.delete": "हटाएं",
    "academic.fees.noRecords": "कोई शुल्क रिकॉर्ड नहीं मिला।",
    "academic.fees.addSuccess": "शुल्क रिकॉर्ड सफलतापूर्वक जोड़ा गया!",
    "academic.fees.delConfirm": "क्या आप इस शुल्क रिकॉर्ड को हटाना चाहते हैं?",
    "academic.fees.paidTooMuch": "भुगतान की गई राशि कुल शुल्क से ज़्यादा नहीं हो सकती।",

    /* ---- examinations ---- */
    "academic.examinations.title": "परीक्षाएं",
    "academic.examinations.addExam": "परीक्षा जोड़ें",
    "academic.examinations.examName": "परीक्षा नाम",
    "academic.examinations.course": "पाठ्यक्रम",
    "academic.examinations.semester": "सेमेस्टर",
    "academic.examinations.date": "तिथि",
    "academic.examinations.startTime": "शुरू समय",
    "academic.examinations.endTime": "समाप्ति समय",
    "academic.examinations.maximumMarks": "अधिकतम अंक",
    "academic.examinations.addResult": "परिणाम जोड़ें",
    "academic.examinations.enterStudentResult": "छात्र परिणाम दर्ज करें",
    "academic.examinations.marksObtained": "प्राप्त अंक",
    "academic.examinations.result": "परिणाम",
    "academic.examinations.pass": "उत्तीर्ण",
    "academic.examinations.fail": "अनुत्तीर्ण",

    /* ---- library ---- */
    "academic.library.title": "पुस्तकालय",
    "academic.library.addBook": "पुस्तक जोड़ें",
    "academic.library.titleLabel": "शीर्षक",
    "academic.library.author": "लेखक",
    "academic.library.isbn": "ISBN",
    "academic.library.publisher": "प्रकाशक",
    "academic.library.year": "वर्ष",
    "academic.library.quantity": "मात्रा",
    "academic.library.available": "उपलब्ध",
    "academic.library.issueBook": "पुस्तक जारी करें",
    "academic.library.issueDate": "जारी तिथि",
    "academic.library.returnDate": "वापसी तिथि"
  };

  /* Merge into the lang.js dict (additive, no clobber of nav/common keys). */
  try {
    var I18N = window.CAMPUS_I18N;
    if (I18N && I18N.en && I18N.hi) {
      Object.assign(I18N.en, ACADEMIC_EN);
      Object.assign(I18N.hi, ACADEMIC_HI);
    } else {
      window.CAMPUS_I18N = { en: ACADEMIC_EN, hi: ACADEMIC_HI };
    }
  } catch (e) {
    try { window.CAMPUS_I18N = { en: ACADEMIC_EN, hi: ACADEMIC_HI }; } catch (e2) {}
  }

  /* Re-apply current language so the new keys take effect immediately. */
  try {
    if (typeof window.applyLang === "function" && typeof window.getLang === "function") {
      window.applyLang(window.getLang());
    }
  } catch (e) {}

  /* Return key counts for verification */
  return {
    path: "lang-academic.js",
    enKeys: Object.keys(ACADEMIC_EN).length,
    hiKeys: Object.keys(ACADEMIC_HI).length
  };
})();
