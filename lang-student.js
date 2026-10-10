/* ============================================================
   lang-student.js — Hindi full-content pack for student dashboard
   (vanilla IIFE, additive; loads AFTER lang.js):
     <script src="lang.js"></script>
     <script src="lang-student.js"></script>
   - Merges student.* keys into window.CAMPUS_I18N via Object.assign
     for en + hi. English values equal the on-page fallback text.
   - Re-applies the current language so new keys take effect
     without requiring a toggle.
   - Scope: student dashboard specific strings.
   ============================================================ */
(function () {
  "use strict";

  var STUDENT_EN = {
    "student.dashboard.title": "Student Dashboard",
    "student.dashboard.welcome": "Welcome back! Here's your campus overview.",
    "student.dashboard.attendance": "Attendance",
    "student.dashboard.pendingRequests": "My pending requests",
    "student.dashboard.messToday": "Mess today",
    "student.dashboard.feesDue": "Fees Due",
    "student.dashboard.services": "My Services (one tap)",
    "student.dashboard.todayClasses": "Today's Classes (live)",
    "student.dashboard.viewAll": "View All",
    "student.dashboard.myNotices": "My Notices (targeted)",
    "student.dashboard.all": "All",
    "student.dashboard.myRequests": "My Requests",
    "student.dashboard.new": "New",
    "student.dashboard.details": "Details",
    "student.dashboard.overallAttendance": "Overall Attendance",
    "student.dashboard.copilot": "Campus Copilot",
    "student.dashboard.copilotAsk": "Ask me anything about your campus.",
    "student.dashboard.copilotHelp": "How can I help you today?",
    "student.dashboard.copilotPlaceholder": "Ask something... e.g. What is my attendance?",
    "student.dashboard.send": "Send",
    "student.dashboard.liveFromAttendance": "live from Attendance page",
    "student.dashboard.english": "English",
    "student.dashboard.hindi": "हिंदी",
    "student.dashboard.dark": "Dark",
    "student.dashboard.online": "Online",
    "student.dashboard.logout": "Logout",
    "student.dashboard.campus": "Campus",
    "student.dashboard.timetable": "Timetable",
    "student.dashboard.leaveGatePass": "Leave & Gate-Pass",
    "student.dashboard.certificates": "Certificates",
    "student.dashboard.complaints": "Complaints",
    "student.dashboard.mess": "Mess",
    "student.dashboard.examinations": "Examinations",
    "student.dashboard.results": "Results",
    "student.dashboard.fees": "Fees",
    "student.dashboard.feesQueries": "Fees + Queries",
    "student.dashboard.notices": "Notices",
    "student.dashboard.opsInsights": "Ops Insights",
    "student.dashboard.settings": "Settings",
    "student.dashboard.studentLabel": "Student",
    "student.dashboard.studentEmail": "student@campus.edu"
  };

  var STUDENT_HI = {
    "student.dashboard.title": "छात्र डैशबोर्ड",
    "student.dashboard.welcome": "वापसी पर स्वागत है! यहां आपका कैम्पस ओवरव्यू है।",
    "student.dashboard.attendance": "उपस्थिति",
    "student.dashboard.pendingRequests": "मेरे लंबित अनुरोध",
    "student.dashboard.messToday": "आज का मेस",
    "student.dashboard.feesDue": "देय शुल्क",
    "student.dashboard.services": "मेरी सेवाएं (एक टैप)",
    "student.dashboard.todayClasses": "आज की कक्षाएं (लाइव)",
    "student.dashboard.viewAll": "सभी देखें",
    "student.dashboard.myNotices": "मेरी सूचनाएं (लक्षित)",
    "student.dashboard.all": "सभी",
    "student.dashboard.myRequests": "मेरे अनुरोध",
    "student.dashboard.new": "नया",
    "student.dashboard.details": "विवरण",
    "student.dashboard.overallAttendance": "कुल उपस्थिति",
    "student.dashboard.copilot": "कैम्पस कोपायलट",
    "student.dashboard.copilotAsk": "अपने कैम्पस के बारे में कुछ भी पूछें।",
    "student.dashboard.copilotHelp": "आज मैं आपकी क्या मदद कर सकता हूं?",
    "student.dashboard.copilotPlaceholder": "कुछ पूछें... उदाहरण: मेरी उपस्थिति क्या है?",
    "student.dashboard.send": "भेजें",
    "student.dashboard.liveFromAttendance": "उपस्थिति पेज से लाइव",
    "student.dashboard.english": "अंग्रेजी",
    "student.dashboard.hindi": "हिंदी",
    "student.dashboard.dark": "डार्क",
    "student.dashboard.online": "ऑनलाइन",
    "student.dashboard.logout": "लॉग आउट",
    "student.dashboard.campus": "कैम्पस",
    "student.dashboard.timetable": "समय सारणी",
    "student.dashboard.leaveGatePass": "छुट्टी व गेट-पास",
    "student.dashboard.certificates": "प्रमाणपत्र",
    "student.dashboard.complaints": "शिकायतें",
    "student.dashboard.mess": "मेस",
    "student.dashboard.examinations": "परीक्षाएं",
    "student.dashboard.results": "परिणाम",
    "student.dashboard.fees": "शुल्क",
    "student.dashboard.feesQueries": "शुल्क + प्रश्न",
    "student.dashboard.notices": "सूचनाएं",
    "student.dashboard.opsInsights": "ऑप्स इनसाइट्स",
    "student.dashboard.settings": "सेटिंग्स",
    "student.dashboard.studentLabel": "छात्र",
    "student.dashboard.studentEmail": "student@campus.edu"
  };

  /* Merge into the lang.js dict (additive, no clobber of nav/common keys). */
  try {
    var I18N = window.CAMPUS_I18N;
    if (I18N && I18N.en && I18N.hi) {
      Object.assign(I18N.en, STUDENT_EN);
      Object.assign(I18N.hi, STUDENT_HI);
    } else {
      window.CAMPUS_I18N = { en: STUDENT_EN, hi: STUDENT_HI };
    }
  } catch (e) {
    try { window.CAMPUS_I18N = { en: STUDENT_EN, hi: STUDENT_HI }; } catch (e2) {}
  }

  /* Re-apply current language so the new keys take effect immediately. */
  try {
    if (typeof window.applyLang === "function" && typeof window.getLang === "function") {
      window.applyLang(window.getLang());
    }
  } catch (e) {}

  /* Return key counts for verification */
  return {
    path: "lang-student.js",
    enKeys: Object.keys(STUDENT_EN).length,
    hiKeys: Object.keys(STUDENT_HI).length
  };
})();
