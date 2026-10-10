/* ============================================================
   lang-login.js — Hindi full-content pack for login page
   (vanilla IIFE, additive; loads AFTER lang.js):
     <script src="lang.js"></script>
     <script src="lang-login.js"></script>
   - Merges login.* keys into window.CAMPUS_I18N via Object.assign
     for en + hi. English values equal the on-page fallback text.
   - Re-applies the current language so new keys take effect
     without requiring a toggle.
   - Scope: login page labels, headings, buttons, placeholders,
     helper text. IDs/handlers untouched.
   ============================================================ */
(function () {
  "use strict";

  var LOGIN_EN = {
    "login.subtitle": "Campus Management System",
    "login.loginAs": "Login As",
    "login.selectRole": "Select Role",
    "login.student": "Student",
    "login.faculty": "Faculty",
    "login.administrator": "Administrator",
    "login.emailUserId": "Email / User ID",
    "login.enterEmailOrUserId": "Enter email or user ID",
    "login.password": "Password",
    "login.enterPassword": "Enter password",
    "login.loginBtn": "Login",
    "login.demoAccounts": "Demo Accounts",
    "login.adminLabel": "Admin:",
    "login.studentLabel": "Student:",
    "login.facultyLabel": "Faculty:",
    "login.fillAdmin": "Fill Admin",
    "login.fillStudent": "Fill Student",
    "login.fillFaculty": "Fill Faculty"
  };

  var LOGIN_HI = {
    "login.subtitle": "कैम्पस प्रबंधन प्रणाली",
    "login.loginAs": "रूप में लॉगिन करें",
    "login.selectRole": "भूमिका चुनें",
    "login.student": "छात्र",
    "login.faculty": "शिक्षक",
    "login.administrator": "प्रशासक",
    "login.emailUserId": "ईमेल / उपयोगकर्ता ID",
    "login.enterEmailOrUserId": "ईमेल या उपयोगकर्ता ID दर्ज करें",
    "login.password": "पासवर्ड",
    "login.enterPassword": "पासवर्ड दर्ज करें",
    "login.loginBtn": "लॉगिन",
    "login.demoAccounts": "डेमो खाते",
    "login.adminLabel": "प्रशासक:",
    "login.studentLabel": "छात्र:",
    "login.facultyLabel": "शिक्षक:",
    "login.fillAdmin": "एडमिन भरें",
    "login.fillStudent": "छात्र भरें",
    "login.fillFaculty": "शिक्षक भरें"
  };

  /* Merge into the lang.js dict (additive, no clobber of nav/common keys). */
  try {
    var I18N = window.CAMPUS_I18N;
    if (I18N && I18N.en && I18N.hi) {
      Object.assign(I18N.en, LOGIN_EN);
      Object.assign(I18N.hi, LOGIN_HI);
    } else {
      window.CAMPUS_I18N = { en: LOGIN_EN, hi: LOGIN_HI };
    }
  } catch (e) {
    try { window.CAMPUS_I18N = { en: LOGIN_EN, hi: LOGIN_HI }; } catch (e2) {}
  }

  /* Re-apply current language so the new keys take effect immediately. */
  try {
    if (typeof window.applyLang === "function" && typeof window.getLang === "function") {
      window.applyLang(window.getLang());
    }
  } catch (e) {}

  /* Return key counts for verification */
  return {
    path: "lang-login.js",
    enKeys: Object.keys(LOGIN_EN).length,
    hiKeys: Object.keys(LOGIN_HI).length
  };
})();
