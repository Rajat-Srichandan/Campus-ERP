/* ============================================================
   campus-sidebar.js — Dynamic sidebar for all roles
   Reads campusSession from localStorage and renders appropriate nav.
   Usage: <aside class="sidebar-placeholder"></aside> + <script src="campus-sidebar.js"></script>
   Vanilla IIFE, no dependencies, no prompt/alert.
   i18n: keeps data-i18n on inner <span> so window.applyLang()
   replaces text without wiping inline SVG icons.
   ============================================================ */
(function () {
  "use strict";

  var SIDEBAR_SELECTOR = ".sidebar-placeholder, .student-sidebar, .admin-sidebar, .faculty-sidebar, .sidebar";

  function getCurrentUser() {
    try {
      var raw = localStorage.getItem("campusSession");
      if (!raw) return null;
      return JSON.parse(raw) || null;
    } catch (e) {
      return null;
    }
  }

  function getRole() {
    var u = getCurrentUser();
    if (u && typeof u.role === "string" && u.role) return u.role;
    return "Guest";
  }

  function currentFileName() {
    try {
      var path = window.location.pathname || "";
      var file = path.split("/").pop() || "";
      file = file.split("?")[0].split("#")[0];
      return file.toLowerCase();
    } catch (e) {
      return "";
    }
  }

  function currentHash() {
    try {
      return (window.location.hash || "").toLowerCase();
    } catch (e) {
      return "";
    }
  }

  function getCurrentPage() {
    var file = currentFileName().replace(/\.html$/, "");
    if (!file || file === "/" || file === "index") return "index";

    // Courses page carries section in hash (#departments / #courses).
    var h = currentHash();
    if (file === "courses" && h) {
      if (h.indexOf("department") !== -1) return "departments";
    }

    // Examinations and Results live on the same file. Examinations is the
    // default view; the Results nav item only owns the page when the file is
    // deep-linked to its results section (#results).
    if (file === "examinations" && h.indexOf("result") !== -1) return "results";

    var pageMap = {
      "student-dashboard": "dashboard",
      "admin-dashboard": "dashboard",
      "faculty-dashboard": "dashboard",
      "ops-dashboard": "ops",
      "timetable": "timetable",
      "attendance": "attendance",
      "requests": "requests",
      "certificates": "certificates",
      "complaints": "complaints",
      "mess": "mess",
      "examinations": "examinations",
      "results": "results",
      "fees": "fees",
      "announcements": "announcements",
      "student-settings": "settings",
      "students": "students",
      "faculty": "faculty",
      "courses": "courses",
      "departments": "departments",
      "users": "users",
      "assignments": "assignments",
      "library": "library",
      "hostel": "hostel",
      "transport": "transport",
      "reports": "reports"
    };
    return pageMap[file] || file;
  }

  /* ---------------- nav data (icon = SVG path d or full inner SVG, class "ic") ---------------- */

  var STUDENT_NAV = [
    { href: "student-dashboard.html", icon: "M3 3h7v9H3V3zm11 0h7v5h-7V3zm0 11h7v9h-7v-9zM3 16h7v5H3v-5z", label: "student.dashboard.title", text: "Dashboard", page: "dashboard" },
    { href: "timetable.html", icon: "M3 4h18v18H3V4zm13-2v2H8V2h8zm-8 8h18v2H8v-2z", label: "student.dashboard.timetable", text: "Timetable", page: "timetable" },
    { href: "attendance.html", icon: "M3 4h18v18H3V4zm13-2v2H8V2h8zm-8 8h18v2H8v-2zM9 16l2 2 4-4", label: "student.dashboard.attendance", text: "Attendance", page: "attendance" },
    { href: "requests.html", icon: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M16 13H8M16 17H8", label: "student.dashboard.leaveGatePass", text: "Leave & Gate-Pass", page: "requests" },
    { href: "certificates.html", icon: '<circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/>', label: "student.dashboard.certificates", text: "Certificates", page: "certificates" },
    { href: "complaints.html", icon: "M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z", label: "student.dashboard.complaints", text: "Complaints", page: "complaints" },
    { href: "mess.html", icon: "M18 8h1a4 4 0 0 1 0 8h-1M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8zM6 1V4M10 1v3M14 1v3", label: "student.dashboard.mess", text: "Mess", page: "mess" },
    { href: "examinations.html", icon: "M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2M8 2h8v4H8V2zM9 12h6M9 16h6", label: "student.dashboard.examinations", text: "Examinations", page: "examinations" },
    { href: "examinations.html", icon: "M23 6l-9.5 9.5-5-5-7 7M17 6h6v6", label: "student.dashboard.results", text: "Results", page: "results" },
    { href: "fees.html", icon: "M1 4h22v16H1V4zM1 10h22", label: "student.dashboard.fees", text: "Fees", page: "fees" },
    { href: "announcements.html", icon: "M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 0 1-3.5 0", label: "student.dashboard.notices", text: "Notices", page: "announcements" },
    { href: "ops-dashboard.html", icon: "M23 6l-9.5 9.5-5-5-7 7M17 6h6v6", label: "student.dashboard.opsInsights", text: "Ops Insights", page: "ops" },
    { href: "student-settings.html", icon: "M12 12c2.2 0 4-1.8 4-4s-1.8-4-4-4-4 1.8-4 4 1.8 4 4 4zm0 2c-2.7 0-4.5 2.3-4.5 4.5V21h9v-4.5c0-2.2-1.8-4-4-4z", label: "student.dashboard.settings", text: "Settings", page: "settings" }
  ];

  var ADMIN_NAV = [
    { section: "nav.overview", sectionText: "Overview", items: [
      { href: "admin-dashboard.html", icon: "M3 3h7v9H3V3zm11 0h7v5h-7V3zm0 11h7v9h-7v-9zM3 16h7v5H3v-5z", label: "nav.dashboard", text: "Dashboard", page: "dashboard" },
      { href: "ops-dashboard.html", icon: "M23 6l-9.5 9.5-5-5-7 7M17 6h6v6", label: "nav.ops", text: "Ops Insights", page: "ops" },
      { href: "reports.html", icon: "M18 20V10M12 20V4M6 20v-6", label: "nav.reports", text: "Reports", page: "reports" }
    ]},
    { section: "nav.records", sectionText: "Records", items: [
      { href: "students.html", icon: "M22 10l-10-5-10 5 10 5 10-5zM6 12v5c0 1.7 2.7 3 6 3s6-1.3 6-3v-5M22 10v6", label: "nav.students", text: "Students", page: "students" },
      { href: "faculty.html", icon: "M2 7h20v14h-20V7zm14-2V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16", label: "nav.faculty", text: "Faculty", page: "faculty" },
      { href: "courses.html#departments", icon: "M4 2h16v20H4V2zm5 22v-4h6v4zm-1-4h.01M9 6h.01M15 6h.01M9 10h.01M9 14h.01M15 10h.01M15 14h.01", label: "nav.departments", text: "Departments", page: "departments" },
      { href: "courses.html#courses", icon: "M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2zM22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z", label: "nav.courses", text: "Courses", page: "courses" },
      { href: "attendance.html", icon: "M3 4h18v18H3V4zm13-2v2H8V2h8zm-8 8h18v2H8v-2zM9 16l2 2 4-4", label: "nav.attendance", text: "Attendance", page: "attendance" },
      { href: "users.html", icon: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 7c0-2.2 1.8-4 4-4s4 1.8 4 4M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75", label: "nav.users", text: "Users", page: "users" }
    ]},
    { section: "nav.academic", sectionText: "Academic", items: [
      { href: "timetable.html", icon: "M3 4h18v18H3V4zm13-2v2H8V2h8zm-8 8h18v2H8v-2z", label: "nav.timetable", text: "Timetable", page: "timetable" },
      { href: "assignments.html", icon: "M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z", label: "nav.assignments", text: "Assignments", page: "assignments" },
      { href: "fees.html", icon: "M1 4h22v16H1V4zM1 10h22", label: "nav.fees", text: "Fees", page: "fees" },
      { href: "examinations.html", icon: "M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2M8 2h8v4H8V2zM9 12h6M9 16h6", label: "nav.examinations", text: "Examinations", page: "examinations" },
      { href: "library.html", icon: "M4 19.5A2.5 2.5 0 0 1 6.5 17H20M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z", label: "nav.library", text: "Library", page: "library" }
    ]},
    { section: "nav.campus", sectionText: "Campus", items: [
      { href: "hostel.html", icon: "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2zM9 22V12h6v10", label: "nav.hostel", text: "Hostel", page: "hostel" },
      { href: "transport.html", icon: "M1 3h15v13h-15V3zm15 0h3v3h-3V3zm0 10h3v6h-3v-6zM4 16h2v5H4v-5zm14.5-11.5c0-1.4-1.1-2.5-2.5-2.5S14 3.1 14 4.5 15.1 7 16.5 7s2.5-1.1 2.5-2.5zM16.5 16.5c0-1.4-1.1-2.5-2.5-2.5S14 15.1 14 16.5s1.1 2.5 2.5 2.5 2.5-1.1 2.5-2.5z", label: "nav.transport", text: "Transport", page: "transport" }
    ]},
    { section: "nav.hub", sectionText: "Hub", items: [
      { href: "requests.html", icon: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M16 13H8M16 17H8", label: "nav.requests", text: "Leave & Gate-Pass", page: "requests" },
      { href: "certificates.html", icon: '<circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/>', label: "nav.certificates", text: "Certificates", page: "certificates" },
      { href: "complaints.html", icon: "M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z", label: "nav.complaints", text: "Complaints", page: "complaints" },
      { href: "mess.html", icon: "M18 8h1a4 4 0 0 1 0 8h-1M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8zM6 1V4M10 1v3M14 1v3", label: "nav.mess", text: "Mess", page: "mess" },
      { href: "announcements.html", icon: "M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 0 1-3.5 0", label: "nav.announcements", text: "Announcements", page: "announcements" }
    ]}
  ];

  var FACULTY_NAV = [
    { section: "nav.overview", sectionText: "Overview", items: [
      { href: "faculty-dashboard.html", icon: "M3 3h7v9H3V3zm11 0h7v5h-7V3zm0 11h7v9h-7v-9zM3 16h7v5H3v-5z", label: "nav.dashboard", text: "Dashboard", page: "dashboard" }
    ]},
    { section: "nav.academic", sectionText: "Academic", items: [
      { href: "students.html", icon: "M22 10l-10-5-10 5 10 5 10-5zM6 12v5c0 1.7 2.7 3 6 3s6-1.3 6-3v-5M22 10v6", label: "nav.students", text: "Students", page: "students" },
      { href: "courses.html", icon: "M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2zM22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z", label: "nav.courses", text: "Courses", page: "courses" },
      { href: "timetable.html", icon: "M3 4h18v18H3V4zm13-2v2H8V2h8zm-8 8h18v2H8v-2z", label: "nav.timetable", text: "Timetable", page: "timetable" },
      { href: "assignments.html", icon: "M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z", label: "nav.assignments", text: "Assignments", page: "assignments" },
      { href: "attendance.html", icon: "M3 4h18v18H3V4zm13-2v2H8V2h8zm-8 8h18v2H8v-2zM9 16l2 2 4-4", label: "nav.attendance", text: "Attendance", page: "attendance" },
      { href: "examinations.html", icon: "M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2M8 2h8v4H8V2zM9 12h6M9 16h6", label: "nav.examinations", text: "Examinations", page: "examinations" }
    ]},
    { section: "nav.hub", sectionText: "Hub", items: [
      { href: "requests.html", icon: "M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M16 13H8M16 17H8", label: "nav.requests", text: "Leave & Gate-Pass", page: "requests" },
      { href: "announcements.html", icon: "M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 0 1-3.5 0", label: "nav.announcements", text: "Announcements", page: "announcements" }
    ]}
  ];

  function createIcon(path) {
    // Supports single-path `d` strings (legacy) and full inner SVG
    // (e.g. '<circle .../><polyline .../>') so feather-style
    // multi-element icons like award render correctly.
    if (path && path.indexOf("<") !== -1) {
      return '<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + path + "</svg>";
    }
    return '<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="' + path + '"/></svg>';
  }

  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  /* ---------------- active-item resolution ----------------
     Exactly ONE item per nav is active. Matching happens once per nav
     (resolveActiveItem) instead of per item, so two entries sharing the same
     href (e.g. Examinations + Results -> examinations.html) can never both
     highlight. Page id is authoritative; href matching is only a fallback and
     requires an exact basename match plus a unique candidate. */

  function navItems(nav) {
    var out = [];
    if (!nav || !nav.length) return out;
    nav.forEach(function (entry) {
      if (!entry) return;
      if (entry.items && entry.items.length) {
        entry.items.forEach(function (item) { if (item) out.push(item); });
      } else if (entry.href) {
        out.push(entry);
      }
    });
    return out;
  }

  function hrefFileOf(href) {
    if (!href) return "";
    return String(href).split("#")[0].split("?")[0].trim().toLowerCase();
  }

  function hrefHashOf(href) {
    if (!href) return "";
    var parts = String(href).split("#");
    return parts[1] ? ("#" + parts[1].split("?")[0].toLowerCase()) : "";
  }

  function resolveActiveItem(nav, currentPage, currentFile) {
    try {
      var items = navItems(nav);
      if (!items.length) return null;

      // 1. Page id match. First match wins, so at most one item is active.
      for (var i = 0; i < items.length; i++) {
        if (items[i].page && items[i].page === currentPage) return items[i];
      }

      // 2. No page id matched: fall back to an exact href file match.
      //    Only used when the nav has no explicit page for this file.
      var fileMatches = items.filter(function (item) {
        return hrefFileOf(item.href) && hrefFileOf(item.href) === currentFile;
      });
      if (fileMatches.length === 1) return fileMatches[0];
      if (fileMatches.length > 1) {
        var hash = currentHash();
        for (var j = 0; j < fileMatches.length; j++) {
          var h = hrefHashOf(fileMatches[j].href);
          if (h && h === hash) return fileMatches[j];
        }
        // Ambiguous (duplicate hrefs, no matching anchor): prefer a hashless
        // entry, otherwise the first one. Never more than one.
        for (var k = 0; k < fileMatches.length; k++) {
          if (!hrefHashOf(fileMatches[k].href)) return fileMatches[k];
        }
        return fileMatches[0];
      }

      return null;
    } catch (e) {
      return null;
    }
  }

  function applyTranslations() {
    try {
      if (typeof window !== "undefined" && typeof window.applyLang === "function") {
        if (typeof window.getLang === "function") {
          window.applyLang(window.getLang());
        } else if (typeof getLang === "function") {
          window.applyLang(getLang());
        } else {
          window.applyLang("en");
        }
      } else if (typeof applyLang === "function") {
        try {
          applyLang(typeof getLang === "function" ? getLang() : "en");
        } catch (e) {}
      }
    } catch (e) {}
  }

  function findAside() {
    try {
      return document.querySelector(SIDEBAR_SELECTOR);
    } catch (e) {
      return null;
    }
  }

  var SCROLL_KEY = "campusSidebarScrollTop";
  // NOTE: shared key with script.js, which already saves the inner menu UL's
  // scrollTop on scroll/pagehide for static asides. Placeholder pages rebuild
  // the menu via innerHTML AFTER script.js's DOMContentLoaded restore ran
  // (the UL does not exist yet at that point), so this file must restore the
  // SAME key on the SAME element or the position is lost on every load.
  // Guards against save-during-rebuild / unload races that used to clobber a
  // good saved offset with 0 (innerHTML replace resets scrollTop to 0 and
  // fires a scroll; page unload can do the same).
  var sidebarSuppressUntil = 0;
  var isSidebarPageHiding = false;
  var sidebarLoadReassertDone = false;
  try {
    window.addEventListener("pagehide", function () { isSidebarPageHiding = true; }, { passive: true });
  } catch (e) {}
  try {
    document.addEventListener("visibilitychange", function () {
      try {
        // Reflect current state (do NOT latch): hidden -> suppress saves,
        // visible -> allow saves again.
        isSidebarPageHiding = !!document.hidden;
      } catch (e) {}
    });
  } catch (e) {}

  function suppressSidebarSave(ms) {
    try {
      sidebarSuppressUntil = Date.now() + (ms || 250);
    } catch (e) {}
  }

  function isSidebarSaveSuppressed() {
    if (isSidebarPageHiding) return true;
    try {
      if (document.hidden) return true;
    } catch (e) {}
    try {
      if (Date.now() < sidebarSuppressUntil) return true;
    } catch (e) {}
    return false;
  }

  var SIDEBAR_MENU_SELECTOR = "ul.dashboard-menu, ul.admin-menu, ul.faculty-menu";

  function sidebarScrollerFor(aside) {
    // The scroll container is the inner menu UL, NOT the aside. CSS makes the
    // aside display:flex;column with overflow:hidden while the UL has
    // overflow-y:auto;flex:1 (style.css "Sidebar scrollable + sticky logout").
    // Saving aside.scrollTop always saves 0, so restores were no-ops and the
    // no-saved-value scrollIntoView fallback yanked the menu on every load.
    // Falls back to the aside itself for legacy layouts where it still scrolls.
    try {
      if (aside && typeof aside.querySelector === "function") {
        var menu = aside.querySelector(SIDEBAR_MENU_SELECTOR);
        if (menu) return menu;
      }
    } catch (e) {}
    return aside;
  }

  function clampSidebarScroll(aside, saved) {
    var scroller = sidebarScrollerFor(aside);
    var max = 0;
    try {
      max = scroller.scrollHeight - scroller.clientHeight;
    } catch (e) {
      max = 0;
    }
    if (!(max > 0)) max = 0;
    if (saved < 0) saved = 0;
    if (saved > max) saved = max;
    return saved;
  }

  function applySavedSidebarScroll(aside, saved) {
    var scroller = sidebarScrollerFor(aside);
    var target = clampSidebarScroll(aside, saved);
    try {
      scroller.scrollTop = target;
    } catch (e) {}
  }

  function getSavedSidebarScroll() {
    try {
      var raw = sessionStorage.getItem(SCROLL_KEY);
      if (raw === null || raw === undefined || raw === "") return null;
      var n = parseInt(raw, 10);
      if (isNaN(n)) return null;
      return Math.max(0, n);
    } catch (e) {
      return null;
    }
  }

  function attachSidebarScrollPersistence(aside) {
    try {
      // Bind the actual scroller (inner UL). It is a fresh node after every
      // innerHTML rebuild, so the bound-flag lives on the scroller itself and
      // each render re-binds to the new node (the old node is garbage).
      var scroller = sidebarScrollerFor(aside);
      if (!scroller || scroller.dataset.campusScrollBound === "1") return;
      scroller.dataset.campusScrollBound = "1";
      var ticking = false;
      var persist = function () {
        ticking = false;
        // Guard 1: never persist while rebuilding/restoring, unloading, or hidden.
        if (isSidebarSaveSuppressed()) return;
        try {
          var cur = scroller.scrollTop || 0;
          // Guard 2: never clobber a good saved offset with a rebuild/unload 0.
          // A 0 is only persisted after the user genuinely scrolled this menu
          // (flag is set on user scroll below, and is reset on every rebuild).
          if (!(cur > 0) && !scroller._campusUserScrolled) return;
          sessionStorage.setItem(SCROLL_KEY, String(cur));
        } catch (e) {}
      };
      scroller.addEventListener("scroll", function () {
        // Drop programmatic scrolls fired by innerHTML replace / restore, plus
        // any scroll while the page is hiding.
        if (isSidebarSaveSuppressed()) return;
        try {
          if (scroller.scrollTop > 0) scroller._campusUserScrolled = true;
        } catch (e) {}
        if (ticking) return;
        ticking = true;
        try {
          if (typeof window.requestAnimationFrame === "function") {
            window.requestAnimationFrame(persist);
          } else {
            setTimeout(persist, 50);
          }
        } catch (e) {
          setTimeout(persist, 50);
        }
      }, { passive: true });
    } catch (e) {}
  }

  function reassertSavedSidebarScroll(aside, saved) {
    // Late re-apply for fonts/icons/layout settling after restore (which can
    // grow scrollHeight and shift the effective position slightly upward).
    // Only runs when a saved value exists and position drifted by >2px, so it
    // never fights the user or the scrollIntoView fallback.
    if (saved === null || saved === undefined) return;
    var target;
    try {
      var scroller = sidebarScrollerFor(aside);
      target = clampSidebarScroll(aside, saved);
      if (Math.abs((scroller.scrollTop || 0) - target) > 2) {
        suppressSidebarSave(250);
        applySavedSidebarScroll(aside, target);
      }
    } catch (e) {}
  }

  function restoreAsideScroll(aside) {
    try {
      if (!aside) return;
      attachSidebarScrollPersistence(aside);
      var scroller = sidebarScrollerFor(aside);
      // Fresh menu node for this page load: programmatic scrolls below must
      // not count as user scrolls, and must not be re-persisted.
      if (scroller) scroller._campusUserScrolled = false;
      var saved = getSavedSidebarScroll();
      if (saved !== null) {
        // Restore path: clamp to current content height (content differs per
        // page/role), then re-assert once layout settles. The scrollIntoView
        // fallback below runs ONLY when saved === null, never after a restore.
        suppressSidebarSave(300);
        applySavedSidebarScroll(aside, saved);
        try {
          if (typeof window.requestAnimationFrame === "function") {
            window.requestAnimationFrame(function () { reassertSavedSidebarScroll(aside, saved); });
          } else {
            setTimeout(function () { reassertSavedSidebarScroll(aside, saved); }, 50);
          }
        } catch (e) {}
        if (!sidebarLoadReassertDone) {
          sidebarLoadReassertDone = true;
          var onLoad = function () { reassertSavedSidebarScroll(aside, saved); };
          try {
            if (document.readyState === "complete") {
              onLoad();
            } else if (typeof window.addEventListener === "function") {
              window.addEventListener("load", onLoad, { once: true });
            }
          } catch (e) {}
        }
        return;
      }
      // First visit (no saved position): keep the active link visible
      // without moving the window/page scroll.
      var activeAnchor = null;
      try {
        activeAnchor = aside.querySelector("a.active");
      } catch (e) {
        activeAnchor = null;
      }
      if (activeAnchor && typeof activeAnchor.scrollIntoView === "function") {
        var wx = 0;
        var wy = 0;
        try {
          wx = window.scrollX || window.pageXOffset || 0;
          wy = window.scrollY || window.pageYOffset || 0;
        } catch (e) {}
        try {
          activeAnchor.scrollIntoView({ block: "nearest" });
        } catch (e) {}
        try {
          window.scrollTo(wx, wy);
        } catch (e) {}
      }
    } catch (e) {}
  }

  function renderStudentSidebar() {
    var aside = findAside();
    if (!aside) return;
    // Bare placeholders carry no layout class: adopt the fixed
    // student rail so existing .student-sidebar CSS applies.
    // Existing .student-sidebar/.sidebar asides are left untouched.
    if (aside.classList && aside.classList.contains("sidebar-placeholder")) aside.classList.add("student-sidebar");

    var currentPage = getCurrentPage();
    var currentFile = currentFileName();
    var activeItem = resolveActiveItem(STUDENT_NAV, currentPage, currentFile);
    var html = "";

    html += '<div class="dashboard-logo">' + createIcon("M22 10 12 5 2 10l10 5 10-5zM6 12v5c0 1.7 2.7 3 6 3s6-1.3 6-3v-5M22 10v6") + '<span data-i18n="student.dashboard.campus">Campus</span></div>';
    html += '<ul class="dashboard-menu">';

    STUDENT_NAV.forEach(function (item) {
      var active = item === activeItem;
      html += '<li' + (active ? ' class="active"' : "") + '><a href="' + esc(item.href) + '"' + (active ? ' class="active"' : "") + '>' + createIcon(item.icon) + '<span data-i18n="' + esc(item.label) + '">' + esc(item.text) + "</span></a></li>";
    });

    html += "</ul>";
    html += '<button type="button" class="logout-btn" onclick="logout()">' + createIcon("M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9") + '<span data-i18n="student.dashboard.logout">Logout</span></button>';

    // Suppress the scroll event fired by innerHTML replace (scrollTop -> 0)
    // so it can never clobber the saved offset. Restore runs after
    // translations so i18n text swaps cannot reset it; rAF/load re-asserts
    // cover late font/icon layout growth.
    suppressSidebarSave(300);
    aside.innerHTML = html;
    applyTranslations();
    restoreAsideScroll(aside);
  }

  function renderAdminSidebar() {
    var aside = findAside();
    if (!aside) return;
    if (aside.classList && aside.classList.contains("sidebar-placeholder")) aside.classList.add("admin-sidebar");

    var currentPage = getCurrentPage();
    var currentFile = currentFileName();
    var activeItem = resolveActiveItem(ADMIN_NAV, currentPage, currentFile);
    var html = "";

    html += '<div class="admin-logo">' + createIcon("M22 10 12 5 2 10l10 5 10-5zM6 12v5c0 1.7 2.7 3 6 3s6-1.3 6-3v-5M22 10v6") + "<span>Campus Admin</span></div>";
    html += '<ul class="admin-menu">';

    ADMIN_NAV.forEach(function (section) {
      html += '<li class="nav-section" data-i18n="' + esc(section.section) + '">' + esc(section.sectionText) + "</li>";
      section.items.forEach(function (item) {
        var active = item === activeItem;
        html += '<li' + (active ? ' class="active"' : "") + '><a href="' + esc(item.href) + '"' + (active ? ' class="active"' : "") + '>' + createIcon(item.icon) + '<span data-i18n="' + esc(item.label) + '">' + esc(item.text) + "</span></a></li>";
      });
    });

    html += "</ul>";
    html += '<button type="button" class="admin-logout" onclick="logout()">' + createIcon("M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9") + '<span data-i18n="nav.logout">Logout</span></button>';

    suppressSidebarSave(300);
    aside.innerHTML = html;
    applyTranslations();
    restoreAsideScroll(aside);
  }

  function renderFacultySidebar() {
    var aside = findAside();
    if (!aside) return;
    if (aside.classList && aside.classList.contains("sidebar-placeholder")) aside.classList.add("faculty-sidebar");

    var currentPage = getCurrentPage();
    var currentFile = currentFileName();
    var activeItem = resolveActiveItem(FACULTY_NAV, currentPage, currentFile);
    var html = "";

    html += '<div class="admin-logo">' + createIcon("M22 10 12 5 2 10l10 5 10-5zM6 12v5c0 1.7 2.7 3 6 3s6-1.3 6-3v-5M22 10v6") + "<span>Campus Faculty</span></div>";
    html += '<ul class="admin-menu">';

    FACULTY_NAV.forEach(function (section) {
      html += '<li class="nav-section" data-i18n="' + esc(section.section) + '">' + esc(section.sectionText) + "</li>";
      section.items.forEach(function (item) {
        var active = item === activeItem;
        html += '<li' + (active ? ' class="active"' : "") + '><a href="' + esc(item.href) + '"' + (active ? ' class="active"' : "") + '>' + createIcon(item.icon) + '<span data-i18n="' + esc(item.label) + '">' + esc(item.text) + "</span></a></li>";
      });
    });

    html += "</ul>";
    html += '<button type="button" class="admin-logout" onclick="logout()">' + createIcon("M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9") + '<span data-i18n="nav.logout">Logout</span></button>';

    suppressSidebarSave(300);
    aside.innerHTML = html;
    applyTranslations();
    restoreAsideScroll(aside);
  }

  function isLoginPage() {
    try {
      var path = window.location.pathname || "";
      var file = currentFileName();
      if (file === "" || file === "index.html" || file === "index") return true;
      if (path.charAt(path.length - 1) === "/") return true;
      return false;
    } catch (e) {
      return false;
    }
  }

  function renderSidebar() {
    var role = getRole();

    if (role === "Student") {
      renderStudentSidebar();
    } else if (role === "Admin") {
      renderAdminSidebar();
    } else if (role === "Faculty") {
      renderFacultySidebar();
    } else {
      if (!isLoginPage()) {
        try {
          window.location.href = "index.html";
        } catch (e) {}
      }
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", renderSidebar);
  } else {
    renderSidebar();
  }

  try {
    window.renderSidebar = renderSidebar;
    window.renderStudentSidebar = renderStudentSidebar;
    window.renderAdminSidebar = renderAdminSidebar;
    window.renderFacultySidebar = renderFacultySidebar;
    window.getCurrentUser = getCurrentUser;
    window.getRole = getRole;
    window.getCurrentPage = getCurrentPage;
  } catch (e) {}
})();
