/* ============================================================
   lang-hub.js — Hindi full-content pack for campus/hub pages
   (vanilla IIFE, additive; loads AFTER lang.js):
     <script src="lang.js"></script>
     <script src="lang-hub.js"></script>
   - Merges hub.* keys into window.CAMPUS_I18N via Object.assign
     for en + hi. English values equal the on-page fallback text.
   - Re-applies the current language so new keys take effect
     without requiring a toggle.
   - Scope: hostel, transport, requests, certificates, complaints,
     mess, announcements. IDs/handlers untouched.
   ============================================================ */
(function () {
  "use strict";

  var HUB_EN = {
    /* ---- hostel ---- */
    "hub.hostel.title": "Hostel",
    "hub.hostel.addRoom": "Add Room",
    "hub.hostel.roomNo": "Room No",
    "hub.hostel.block": "Block",
    "hub.hostel.type": "Type",
    "hub.hostel.capacity": "Capacity",
    "hub.hostel.current": "Current",
    "hub.hostel.allocateStudent": "Allocate Student",
    "hub.hostel.allocationDate": "Allocation Date",

    /* ---- transport ---- */
    "hub.transport.title": "Transport",
    "hub.transport.addBus": "Add Bus",
    "hub.transport.addRoute": "Add Route",
    "hub.transport.allocateStudent": "Allocate Student",
    "hub.transport.vehicleNo": "Vehicle No",
    "hub.transport.driver": "Driver",
    "hub.transport.bus": "Bus",
    "hub.transport.route": "Route",

    /* ---- requests ---- */
    "hub.requests.title": "Leave & Gate Pass",
    "hub.requests.newRequest": "New Request",
    "hub.requests.requestType": "Request Type",
    "hub.requests.from": "From",
    "hub.requests.to": "To",
    "hub.requests.reason": "Reason",
    "hub.requests.submit": "Submit",
    "hub.requests.appliedOn": "Applied On",
    "hub.requests.status": "Status",
    "hub.requests.approve": "Approve",
    "hub.requests.reject": "Reject",
    "hub.requests.approved": "Approved",
    "hub.requests.rejected": "Rejected",
    "hub.requests.pending": "Pending",

    /* ---- certificates ---- */
    "hub.certificates.title": "Certificates",
    "hub.certificates.requestCertificate": "Request Certificate",
    "hub.certificates.certificateType": "Certificate Type",
    "hub.certificates.purpose": "Purpose",
    "hub.certificates.message": "Message",
    "hub.certificates.request": "Request",
    "hub.certificates.issued": "Issued",
    "hub.certificates.actions": "Actions",

    /* ---- complaints ---- */
    "hub.complaints.title": "Complaints",
    "hub.complaints.newComplaint": "New Complaint",
    "hub.complaints.category": "Category",
    "hub.complaints.hostelBlock": "Hostel/Block",
    "hub.complaints.roomNo": "Room No",
    "hub.complaints.description": "Description",
    "hub.complaints.status": "Status",
    "hub.complaints.priority": "Priority",
    "hub.complaints.low": "Low",
    "hub.complaints.medium": "Medium",
    "hub.complaints.high": "High",
    "hub.complaints.resolved": "Resolved",

    /* ---- mess ---- */
    "hub.mess.title": "Mess Services",
    "hub.mess.mealTimings": "Meal Timings",
    "hub.mess.breakfast": "Breakfast",
    "hub.mess.lunch": "Lunch",
    "hub.mess.snacks": "Snacks",
    "hub.mess.dinner": "Dinner",
    "hub.mess.rateFeedback": "Rate & Feedback",
    "hub.mess.sendFeedback": "Send Feedback",
    "hub.mess.messRating": "Mess Rating",
    "hub.mess.comments": "Comments",
    "hub.mess.submitted": "Submitted",

    /* ---- announcements ---- */
    "hub.announcements.title": "Announcements",
    "hub.announcements.newAnnouncement": "New Announcement",
    "hub.announcements.titleLabel": "Title",
    "hub.announcements.category": "Category",
    "hub.announcements.message": "Message",
    "hub.announcements.publish": "Publish",
    "hub.announcements.published": "Published",
    "hub.announcements.actions": "Actions"
  };

  var HUB_HI = {
    /* ---- hostel ---- */
    "hub.hostel.title": "छात्रावास",
    "hub.hostel.addRoom": "कमरा जोड़ें",
    "hub.hostel.roomNo": "कमरा नं",
    "hub.hostel.block": "ब्लॉक",
    "hub.hostel.type": "प्रकार",
    "hub.hostel.capacity": "क्षमता",
    "hub.hostel.current": "वर्तमान",
    "hub.hostel.allocateStudent": "छात्र आवंटित करें",
    "hub.hostel.allocationDate": "आवंटन तिथि",

    /* ---- transport ---- */
    "hub.transport.title": "परिवहन",
    "hub.transport.addBus": "बस जोड़ें",
    "hub.transport.addRoute": "मार्ग जोड़ें",
    "hub.transport.allocateStudent": "छात्र आवंटित करें",
    "hub.transport.vehicleNo": "वाहन नं",
    "hub.transport.driver": "ड्राइवर",
    "hub.transport.bus": "बस",
    "hub.transport.route": "मार्ग",

    /* ---- requests ---- */
    "hub.requests.title": "छुट्टी व गेट पास",
    "hub.requests.newRequest": "नया अनुरोध",
    "hub.requests.requestType": "अनुरोध प्रकार",
    "hub.requests.from": "से",
    "hub.requests.to": "तक",
    "hub.requests.reason": "कारण",
    "hub.requests.submit": "जमा करें",
    "hub.requests.appliedOn": "लागू किया गया",
    "hub.requests.status": "स्थिति",
    "hub.requests.approve": "स्वीकार करें",
    "hub.requests.reject": "अस्वीकार करें",
    "hub.requests.approved": "स्वीकृत",
    "hub.requests.rejected": "अस्वीकृत",
    "hub.requests.pending": "लंबित",

    /* ---- certificates ---- */
    "hub.certificates.title": "प्रमाणपत्र",
    "hub.certificates.requestCertificate": "प्रमाणपत्र अनुरोध",
    "hub.certificates.certificateType": "प्रमाणपत्र प्रकार",
    "hub.certificates.purpose": "उद्देश्य",
    "hub.certificates.message": "संदेश",
    "hub.certificates.request": "अनुरोध",
    "hub.certificates.issued": "जारी",
    "hub.certificates.actions": "कार्य",

    /* ---- complaints ---- */
    "hub.complaints.title": "शिकायतें",
    "hub.complaints.newComplaint": "नई शिकायत",
    "hub.complaints.category": "श्रेणी",
    "hub.complaints.hostelBlock": "छात्रावास/ब्लॉक",
    "hub.complaints.roomNo": "कमरा नं",
    "hub.complaints.description": "विवरण",
    "hub.complaints.status": "स्थिति",
    "hub.complaints.priority": "प्राथमिकता",
    "hub.complaints.low": "कम",
    "hub.complaints.medium": "मध्यम",
    "hub.complaints.high": "उच्च",
    "hub.complaints.resolved": "हल",

    /* ---- mess ---- */
    "hub.mess.title": "मेस सेवाएं",
    "hub.mess.mealTimings": "भोजन समय",
    "hub.mess.breakfast": "नाश्ता",
    "hub.mess.lunch": "दोपहर का भोजन",
    "hub.mess.snacks": "नाश्ता",
    "hub.mess.dinner": "रात का भोजन",
    "hub.mess.rateFeedback": "रेटिंग व फीडबैक",
    "hub.mess.sendFeedback": "फीडबैक भेजें",
    "hub.mess.messRating": "मेस रेटिंग",
    "hub.mess.comments": "टिप्पणी",
    "hub.mess.submitted": "जमा किया",

    /* ---- announcements ---- */
    "hub.announcements.title": "घोषणाएं",
    "hub.announcements.newAnnouncement": "नई घोषणा",
    "hub.announcements.titleLabel": "शीर्षक",
    "hub.announcements.category": "श्रेणी",
    "hub.announcements.message": "संदेश",
    "hub.announcements.publish": "प्रकाशित",
    "hub.announcements.published": "प्रकाशित",
    "hub.announcements.actions": "कार्य"
  };

  /* Merge into the lang.js dict (additive, no clobber of nav/common keys). */
  try {
    var I18N = window.CAMPUS_I18N;
    if (I18N && I18N.en && I18N.hi) {
      Object.assign(I18N.en, HUB_EN);
      Object.assign(I18N.hi, HUB_HI);
    } else {
      window.CAMPUS_I18N = { en: HUB_EN, hi: HUB_HI };
    }
  } catch (e) {
    try { window.CAMPUS_I18N = { en: HUB_EN, hi: HUB_HI }; } catch (e2) {}
  }

  /* Re-apply current language so the new keys take effect immediately. */
  try {
    if (typeof window.applyLang === "function" && typeof window.getLang === "function") {
      window.applyLang(window.getLang());
    }
  } catch (e) {}

  /* Return key counts for verification */
  return {
    path: "lang-hub.js",
    enKeys: Object.keys(HUB_EN).length,
    hiKeys: Object.keys(HUB_HI).length
  };
})();