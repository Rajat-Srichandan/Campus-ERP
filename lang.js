/* ============================================================
   lang.js — Hindi mode core infra (vanilla, additive)
   Loaded AFTER campus-hub.js / script.js:
     <script src="campus-hub.js"></script>
     <script src="script.js"></script>
     <script src="lang.js"></script>
   - LS key: campusLang = "en" | "hi" (default "en", bare string
     shape, same as campus-hub.js).
   - Exposes: window.getLang(), window.applyLang(lang),
     window.toggleLang(). Bridges window.setLanguage so legacy
     `onchange="setLanguage(this.value)"` selects keep working.
   - applyLang sets document.documentElement.lang, swaps
     [data-i18n] textContent + [data-i18n-ph] placeholder via
     dict, persists, syncs #langToggle label and #langSelect.
   - IDs/handlers untouched: no DOM rewrites, no innerHTML,
     no event rebinding. Missing keys leave nodes as-is.
   - Works with or without campus-hub.js (guarded).
   - Font: Noto Sans Devanagari already loaded in <head>;
     no font loading here, :lang(hi) rules in style.css apply.
   ============================================================ */
(function () {
  "use strict";

  var LS_KEY = "campusLang";

  /* ---------------- dict: EN + HI ---------------- */
  var I18N = {
    en: {
      /* nav (27) */
      "nav.dashboard": "Dashboard",
      "nav.ops": "Ops Insights",
      "nav.reports": "Reports",
      "nav.students": "Students",
      "nav.faculty": "Faculty",
      "nav.departments": "Departments",
      "nav.courses": "Courses",
      "nav.attendance": "Attendance",
      "nav.users": "Users",
      "nav.timetable": "Timetable",
      "nav.assignments": "Assignments",
      "nav.fees": "Fees",
      "nav.exams": "Exams",
      "nav.examinations": "Exams",
      "nav.library": "Library",
      "nav.hostel": "Hostel",
      "nav.transport": "Transport",
      "nav.requests": "Leave & Gate-Pass",
      "nav.certs": "Certificates",
      "nav.certificates": "Certificates",
      "nav.complaints": "Complaints",
      "nav.mess": "Mess",
      "nav.announcements": "Announcements",
      "nav.overview": "Overview",
      "nav.records": "Records",
      "nav.academic": "Academic",
      "nav.campus": "Campus",
      "nav.hub": "Hub",
      "nav.logout": "Logout",
      /* common (15) */
      "common.save": "Save",
      "common.cancel": "Cancel",
      "common.search": "Search",
      "common.submit": "Submit",
      "common.add": "Add",
      "common.edit": "Edit",
      "common.delete": "Delete",
      "common.approve": "Approve",
      "common.reject": "Reject",
      "common.resolve": "Resolve",
      "common.raiseQuery": "Raise Query",
      "common.publish": "Publish",
      "common.active": "Active",
      "common.pending": "Pending",
      "common.online": "Online",
      /* hub-compat bare keys (16, verbatim campus-hub.js EN) */
      "dashboard": "Dashboard",
      "requests": "Leave & Gate-Pass",
      "certificates": "Certificates",
      "complaints": "Hostel Complaints",
      "mess": "Mess Services",
      "notices": "Notices",
      "ops": "Ops Insights",
      "pending": "Pending",
      "approved": "Approved",
      "rejected": "Rejected",
      "resolved": "Resolved",
      "open": "Open",
      "apply": "Submit",
      "online": "Online",
      "offline": "Offline \u2014 saved on this device, syncs when online.",
      "printSlip": "Print slip (offline proof)"
    },
    hi: {
      /* nav (27) */
      "nav.dashboard": "\u0921\u0948\u0936\u092c\u094b\u0930\u094d\u0921",
      "nav.ops": "\u0938\u0902\u091a\u093e\u0932\u0928 \u0938\u093e\u0930\u093e\u0902\u0936",
      "nav.reports": "\u0930\u093f\u092a\u094b\u0930\u094d\u091f",
      "nav.students": "\u091b\u093e\u0924\u094d\u0930",
      "nav.faculty": "\u0936\u093f\u0915\u094d\u0937\u0915",
      "nav.departments": "\u0935\u093f\u092d\u093e\u0917",
      "nav.courses": "\u092a\u093e\u0920\u094d\u092f\u0915\u094d\u0930\u092e",
      "nav.attendance": "\u0909\u092a\u0938\u094d\u0925\u093f\u0924\u093f",
      "nav.users": "\u0909\u092a\u092f\u094b\u0917\u0915\u0930\u094d\u0924\u093e",
      "nav.timetable": "\u0938\u092e\u092f-\u0938\u093e\u0930\u0923\u0940",
      "nav.assignments": "\u0905\u0938\u093e\u0907\u0928\u092e\u0947\u0902\u091f",
      "nav.fees": "\u0936\u0941\u0932\u094d\u0915",
      "nav.exams": "\u092a\u0930\u0940\u0915\u094d\u0937\u093e\u090f\u0902",
      "nav.examinations": "\u092a\u0930\u0940\u0915\u094d\u0937\u093e\u090f\u0902",
      "nav.library": "\u092a\u0941\u0938\u094d\u0924\u0915\u093e\u0932\u092f",
      "nav.hostel": "\u091b\u093e\u0924\u094d\u0930\u093e\u0935\u093e\u0938",
      "nav.transport": "\u092a\u0930\u093f\u0935\u0939\u0928",
      "nav.requests": "\u091b\u0941\u091f\u094d\u091f\u0940 \u0935 \u0917\u0947\u091f-\u092a\u093e\u0938",
      "nav.certs": "\u092a\u094d\u0930\u092e\u093e\u0923\u092a\u0924\u094d\u0930",
      "nav.certificates": "\u092a\u094d\u0930\u092e\u093e\u0923\u092a\u0924\u094d\u0930",
      "nav.complaints": "\u0936\u093f\u0915\u093e\u092f\u0924\u0947\u0902",
      "nav.mess": "\u092e\u0947\u0938",
      "nav.announcements": "\u0918\u094b\u0937\u0923\u093e\u090f\u0902",
      "nav.overview": "\u0905\u0935\u0932\u094b\u0915\u0928",
      "nav.records": "\u0930\u093f\u0915\u0949\u0930\u094d\u0921",
      "nav.academic": "\u0936\u0948\u0915\u094d\u0937\u0923\u093f\u0915",
      "nav.campus": "\u092a\u0930\u093f\u0938\u0930",
      "nav.hub": "\u0939\u092c",
      "nav.logout": "\u0932\u0949\u0917\u0906\u0909\u091f",
      /* common (15) */
      "common.save": "\u0938\u0939\u0947\u091c\u0947\u0902",
      "common.cancel": "\u0930\u0926\u094d\u0926 \u0915\u0930\u0947\u0902",
      "common.search": "\u0916\u094b\u091c\u0947\u0902",
      "common.submit": "\u091c\u092e\u093e \u0915\u0930\u0947\u0902",
      "common.add": "\u091c\u094b\u0921\u093c\u0947\u0902",
      "common.edit": "\u0938\u0902\u092a\u093e\u0926\u093f\u0924 \u0915\u0930\u0947\u0902",
      "common.delete": "\u0939\u091f\u093e\u090f\u0902",
      "common.approve": "\u0938\u094d\u0935\u0940\u0915\u0943\u0924 \u0915\u0930\u0947\u0902",
      "common.reject": "\u0905\u0938\u094d\u0935\u0940\u0915\u0943\u0924 \u0915\u0930\u0947\u0902",
      "common.resolve": "\u0938\u092e\u093e\u0927\u093e\u0928 \u0915\u0930\u0947\u0902",
      "common.raiseQuery": "\u0915\u094d\u0935\u0947\u0930\u0940 \u0926\u0930\u094d\u091c \u0915\u0930\u0947\u0902",
      "common.publish": "\u092a\u094d\u0930\u0915\u093e\u0936\u093f\u0924 \u0915\u0930\u0947\u0902",
      "common.active": "\u0938\u0915\u094d\u0930\u093f\u092f",
      "common.pending": "\u0932\u0902\u092c\u093f\u0924",
      "common.online": "\u0911\u0928\u0932\u093e\u0907\u0928",
      /* hub-compat bare keys (16, verbatim campus-hub.js HI) */
      "dashboard": "\u0921\u0948\u0936\u092c\u094b\u0930\u094d\u0921",
      "requests": "\u091b\u0941\u091f\u094d\u091f\u0940 \u0935 \u0917\u0947\u091f-\u092a\u093e\u0938",
      "certificates": "\u092a\u094d\u0930\u092e\u093e\u0923\u092a\u0924\u094d\u0930",
      "complaints": "\u0939\u0949\u0938\u094d\u091f\u0932 \u0936\u093f\u0915\u093e\u092f\u0924\u0947\u0902",
      "mess": "\u092e\u0947\u0938 \u0938\u0947\u0935\u093e\u090f\u0902",
      "notices": "\u0938\u0942\u091a\u0928\u093e\u090f\u0902",
      "ops": "\u092a\u094d\u0930\u0936\u093e\u0938\u0928 \u0938\u093e\u0930\u093e\u0902\u0936",
      "pending": "\u0932\u0902\u092c\u093f\u0924",
      "approved": "\u0938\u094d\u0935\u0940\u0915\u0943\u0924",
      "rejected": "\u0905\u0938\u094d\u0935\u0940\u0915\u0943\u0924",
      "resolved": "\u0938\u092e\u093e\u0927\u093e\u0928",
      "open": "\u0916\u0941\u0932\u093e",
      "apply": "\u091c\u092e\u093e \u0915\u0930\u0947\u0902",
      "online": "\u0911\u0928\u0932\u093e\u0907\u0928",
      "offline": "\u0911\u092b\u093c\u0932\u093e\u0907\u0928 \u2014 \u0907\u0938\u0940 \u0921\u093f\u0935\u093e\u0907\u0938 \u092e\u0947\u0902 \u0938\u0939\u0947\u091c\u093e \u0917\u092f\u093e\u0964",
      "printSlip": "\u092a\u0930\u094d\u091a\u0940 \u092a\u094d\u0930\u093f\u0902\u091f \u0915\u0930\u0947\u0902"
    }
  };

  function normalizeLang(v) {
    try {
      if (typeof v !== "string") v = String(v == null ? "" : v);
      v = v.trim();
      /* tolerate JSON-quoted shape ("\"hi\"") from older writers */
      if ((v.charAt(0) === '"' && v.charAt(v.length - 1) === '"') ||
          (v.charAt(0) === "'" && v.charAt(v.length - 1) === "'")) {
        try { v = String(JSON.parse(v)); } catch (e) { /* keep raw */ }
      }
      v = v.replace(/[^a-z]/gi, "").toLowerCase();
    } catch (e) { v = ""; }
    return v === "hi" ? "hi" : "en";
  }

  function getLang() {
    try {
      var raw = null;
      try { raw = localStorage.getItem(LS_KEY); } catch (e) { raw = null; }
      if (raw == null || raw === "") return "en";
      return normalizeLang(raw);
    } catch (e) { return "en"; }
  }

  function syncControls(lang) {
    try {
      var t = document.getElementById("langToggle");
      if (t) {
        var label = lang === "hi" ? "\u0939\u093f\u0902\u0926\u0940" : "EN";
        var span = null;
        try { span = t.querySelector("span"); } catch (e) { span = null; }
        if (span) span.textContent = label;
        else t.textContent = label;
        try {
          t.setAttribute("aria-pressed", lang === "hi" ? "true" : "false");
          t.setAttribute("title", lang === "hi" ? "Switch to English" : "\u0939\u093f\u0902\u0926\u0940 \u092e\u0947\u0902 \u0926\u0947\u0916\u0947\u0902");
        } catch (e) {}
      }
    } catch (e) {}
    try {
      var s = document.getElementById("langSelect");
      if (s && s.value !== lang) s.value = lang;
    } catch (e) {}
  }

  function applyLang(lang) {
    lang = normalizeLang(lang);
    try { localStorage.setItem(LS_KEY, lang); } catch (e) {}
    try { document.documentElement.lang = lang; } catch (e) {}
    try {
      var dict = I18N[lang] || I18N.en;
      var nodes = document.querySelectorAll("[data-i18n]");
      for (var i = 0; i < nodes.length; i++) {
        var el = nodes[i];
        var k = null;
        try { k = el.getAttribute("data-i18n"); } catch (e) { k = null; }
        if (k && Object.prototype.hasOwnProperty.call(dict, k)) {
          el.textContent = dict[k];
        }
      }
      var phs = document.querySelectorAll("[data-i18n-ph]");
      for (var j = 0; j < phs.length; j++) {
        var p = phs[j];
        var pk = null;
        try { pk = p.getAttribute("data-i18n-ph"); } catch (e) { pk = null; }
        if (pk && Object.prototype.hasOwnProperty.call(dict, pk)) {
          try { p.setAttribute("placeholder", dict[pk]); } catch (e) {}
        }
      }
    } catch (e) {}
    syncControls(lang);
    try {
      if (typeof document.dispatchEvent === "function") {
        document.dispatchEvent(new CustomEvent("campus:lang", { detail: { lang: lang } }));
      }
    } catch (e) {}
    return lang;
  }

  function toggleLang() {
    var next = getLang() === "hi" ? "en" : "hi";
    return applyLang(next);
  }

  /* Bridge legacy setLanguage (campus-hub.js / script.js fallback)
     so existing `onchange="setLanguage(this.value)"` covers the
     full lang.js dict too. Guarded: works whether or not the hub
     is present, and regardless of script order. */
  function bridgeSetLanguage() {
    try {
      var cur = window.setLanguage;
      if (cur === applyLang) return;
      if (cur && cur._langBridged) return;
      var orig = (typeof cur === "function") ? cur : null;
      var bridged = function (lang) {
        var n = normalizeLang(lang);
        try { if (orig) orig(n); } catch (e) {}
        return applyLang(n);
      };
      bridged._langBridged = true;
      bridged._hubOriginal = orig;
      window.setLanguage = bridged;
    } catch (e) {
      try { if (typeof window.setLanguage !== "function") window.setLanguage = applyLang; } catch (e2) {}
    }
  }

  function init() {
    bridgeSetLanguage();
    try { applyLang(getLang()); } catch (e) {}
    try {
      var t = document.getElementById("langToggle");
      if (t && !t._langBound) {
        t._langBound = true;
        t.addEventListener("click", function () { toggleLang(); });
      }
    } catch (e) {}
  }

  /* expose core API (vanilla, no clobber of hub besides bridge) */
  try {
    window.CAMPUS_I18N = I18N;
    window.getLang = getLang;
    window.applyLang = applyLang;
    window.toggleLang = toggleLang;
    bridgeSetLanguage();
  } catch (e) {}

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
