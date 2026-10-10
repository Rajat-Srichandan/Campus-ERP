
function loginUser(event) {


event.preventDefault();

const role =
    document.getElementById("loginRole").value;

const loginValue =
    document.getElementById("loginEmail").value
    .trim()
    .toLowerCase();

const password =
    document.getElementById("loginPassword").value;


if (!role || !loginValue || !password) {

    alert("Please fill in all login fields.");

    return;
}


/*
    Read users from User Management.
*/

const storedUsers =
    JSON.parse(
        localStorage.getItem("campusUsers")
    ) || [];


/*
    Find matching user.

    Login can be performed using:
    - Email
    - User ID
*/

const user =
    storedUsers.find(item => {

        const email =
            String(item.email || "")
                .toLowerCase();

        const userId =
            String(item.userId || "")
                .toLowerCase();

        return (
            (email === loginValue ||
             userId === loginValue) &&

            item.password === password &&

            item.role === role
        );

    });


if (!user) {

    alert(
        "Invalid login credentials or account role."
    );

    return;
}


/*
    Check account status.
*/

if (user.status !== "Active") {

    alert(
        "This account is inactive. Please contact the administrator."
    );

    return;
}


/*
    Create login session.
*/

const session = {

    id: user.id,

    userId: user.userId,

    name: user.name,

    email: user.email,

    role: user.role,

    loginTime: new Date().toISOString()

};


localStorage.setItem(
    "campusSession",
    JSON.stringify(session)
);


/*
    Redirect according to role.
*/

if (user.role === "Admin") {

    window.location.href =
        "admin-dashboard.html";

}

else if (user.role === "Faculty") {

    window.location.href =
        "faculty-dashboard.html";

}

else if (user.role === "Student") {

    /*
        Keep the student profile synchronized
        with the logged-in student.
    */

    const studentProfile = {

        name: user.name,

        studentId: user.userId,

        email: user.email,

        department: "",

        semester: "",

        password: user.password

    };


    localStorage.setItem(
        "campusCurrentStudentProfile",
        JSON.stringify(studentProfile)
    );


    window.location.href =
        "student-dashboard.html";
}


}

        


function copilotLoad(key, fallback) {
    try {
        var v = localStorage.getItem(key);
        return v ? JSON.parse(v) : fallback;
    } catch (e) { return fallback; }
}

function copilotEsc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
        return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
}

function copilotMe() {
    var me = { id: "", name: "", dept: "", sem: "" };
    try {
        var s = JSON.parse(localStorage.getItem("campusSession") || "null");
        if (s) {
            me.id = s.userId || s.id || s.studentId || "";
            me.name = s.name || "";
            me.dept = s.department || "";
            me.sem = s.semester || "";
        }
    } catch (e) {}
    try {
        var p = JSON.parse(localStorage.getItem("campusCurrentStudentProfile") || "null");
        if (p) {
            if (!me.id) me.id = p.studentId || p.userId || p.id || "";
            if (!me.name) me.name = p.name || "";
            if (!me.dept) me.dept = p.department || "";
            if (!me.sem) me.sem = p.semester || "";
        }
    } catch (e) {}
    return me;
}

function copilotHas(q) {
    for (var i = 1; i < arguments.length; i++) {
        if (q.indexOf(arguments[i]) !== -1) return true;
    }
    return false;
}

function copilotAnswer(question) {
    var q = String(question || "").toLowerCase();
    var me = copilotMe();
    var myId = String(me.id || "");
    var today = new Date();
    var todayStr = today.toISOString().slice(0, 10);
    var dayName = today.toLocaleDateString("en-US", { weekday: "long" });

    function mine(arr) {
        if (!myId) return arr;
        var out = arr.filter(function (r) {
            return String(r.studentId || r.userId || r.id || "") === myId ||
                (me.name && String(r.studentName || r.name || "") === String(me.name));
        });
        return out.length ? out : arr;
    }

    // Help / capabilities
    if (copilotHas(q, "help", "what can you", "madad", "sahayata", "सहायता", "क्या कर")) {
        return "I answer from your live campus data: attendance, today's classes, exams, fees, leave/gate-pass, certificates, hostel complaints + SLA, mess menu + rating, notices. Try: 'What is my attendance?' or 'Any notices for me?'";
    }

    // Who am I
    if (copilotHas(q, "who am i", "my id", "my name", "my profile", "मेरी id", "मेरा नाम")) {
        if (!myId && !me.name) return "You are not logged in with a student profile yet. Log in as STU001 to get personalised answers.";
        return "You are " + copilotEsc(me.name || myId) + " (" + copilotEsc(myId || "no ID") + ")" +
            (me.dept ? ", " + copilotEsc(me.dept) : "") + (me.sem ? " · " + copilotEsc(me.sem) : "") + ".";
    }

    // Attendance (live %)
    if (copilotHas(q, "attendance", "attend", "उपस्थिति", "उपस्थिती", "हाजिरी", "haziri")) {
        var att = mine(copilotLoad("campusAttendance", []));
        if (!att.length) return "No attendance records found on this device yet. Check attendance.html after the next sync.";
        var present = att.filter(function (r) {
            return String(r.status || "").toLowerCase().indexOf("present") !== -1;
        }).length;
        var pct = Math.round((present / att.length) * 100);
        var warn = pct < 75 ? " Below 75% — see ops-dashboard.html low-attendance list and meet your mentor." : "";
        return "Your overall attendance is " + pct + "% (" + present + "/" + att.length + " marked present)." + warn;
    }

    // Timetable / today's classes
    if (copilotHas(q, "timetable", "time table", "class", "classes", "schedule", "today", "कक्षा", "समय सारणी", "आज")) {
        var tt = copilotLoad("campusTimetable", []);
        var todays = tt.filter(function (r) {
            return String(r.day || "").toLowerCase() === dayName.toLowerCase();
        });
        if (me.sem) {
            var semMatch = todays.filter(function (r) {
                return !r.semester || String(r.semester) === String(me.sem);
            });
            if (semMatch.length) todays = semMatch;
        }
        if (!todays.length) return "No classes found for " + dayName + " (" + tt.length + " total entries). See timetable.html.";
        var list = todays.slice(0, 4).map(function (r) {
            return copilotEsc(r.course || r.subject || "Class") + " " + copilotEsc(r.start || "") +
                (r.end ? "-" + copilotEsc(r.end) : "") + (r.room ? " · " + copilotEsc(r.room) : "");
        }).join("<br>· ");
        return "Today (" + dayName + ") you have:<br>· " + list;
    }

    // Exams (next upcoming)
    if (copilotHas(q, "exam", "mid sem", "midsem", "semester exam", "test", "परीक्षा")) {
        var exams = copilotLoad("campusExaminations", []).slice().sort(function (a, b) {
            return String(a.date || "") < String(b.date || "") ? -1 : 1;
        });
        var upcoming = exams.filter(function (e) { return String(e.date || "") >= todayStr; });
        var pick = (upcoming.length ? upcoming : exams).slice(0, 2);
        if (!pick.length) return "No examination schedule found yet. Check examinations.html after sync.";
        return "Next: " + pick.map(function (e) {
            return copilotEsc(e.course || e.name || "Exam") + " on " + copilotEsc(e.date || "?");
        }).join("; ") + ". See examinations.html for hall ticket info.";
    }

    // Fee queries (status) before generic fee due
    if ((copilotHas(q, "fee") && copilotHas(q, "quer", "status", "receipt", "mismatch", "complaint", "शिकायत")) ||
        copilotHas(q, "fee quer", "fee status", "fee receipt")) {
        var fqs = mine(copilotLoad("campusFeeQueries", []));
        if (!fqs.length) return "No fee queries found. Raise one from fees.html (e.g. tuition mismatch, receipt missing).";
        var open = fqs.filter(function (r) { return String(r.status || "").toLowerCase() !== "resolved"; });
        var last = fqs[fqs.length - 1];
        return open.length + " fee quer" + (open.length === 1 ? "y" : "ies") + " open. Latest: '" +
            copilotEsc(last.topic || last.text || last.id) + "' — " + copilotEsc(last.status || "Open") + ". Track in fees.html.";
    }

    // Fees due
    if (copilotHas(q, "fee", "fees", "due", "pending", "फीस", "बकाया")) {
        var fees = copilotLoad("campusFees", []);
        var rec = null;
        if (myId) {
            fees.forEach(function (r) {
                if (String(r.studentId || "") === myId) rec = r;
            });
        }
        if (!rec) rec = fees[0];
        if (!rec) return "No fee records on this device yet. Check fees.html after sync.";
        var total = (Number(rec.tuition) || 0) + (Number(rec.hostel) || 0) + (Number(rec.exam) || 0);
        var due = total - (Number(rec.paid) || 0);
        return "Fee due: ₹" + due.toLocaleString("en-IN") + " (total ₹" + total.toLocaleString("en-IN") +
            ", paid ₹" + (Number(rec.paid) || 0).toLocaleString("en-IN") + "). Raise disputes via fees.html, no counter queue.";
    }

    // Leave / gate-pass
    if (copilotHas(q, "leave", "gate", "gatepass", "gate-pass", "pass", "छुट्टी", "गेट पास", "अवकाश")) {
        var reqs = mine(copilotLoad("campusRequests", []));
        if (!reqs.length) return "No leave/gate-pass requests found. Apply from requests.html — approval gives a printable slip.";
        var pend = reqs.filter(function (r) { return String(r.status || "").toLowerCase() === "pending"; }).length;
        var lastR = reqs[reqs.length - 1];
        return pend + " request(s) pending. Latest " + copilotEsc(lastR.id || lastR.type || "") +
            " — " + copilotEsc(lastR.status || "Pending") + ". Apply/track in requests.html.";
    }

    // Certificates
    if (copilotHas(q, "certificat", "bonafide", "transfer", " tc ", "character", "migration", "प्रमाणपत्र", "प्रमाण पत्र")) {
        var certs = mine(copilotLoad("campusCertificates", []));
        if (!certs.length) return "No certificate applications yet. Apply (Bonafide, TC…) from certificates.html and track Issued/Pending.";
        var lastC = certs[certs.length - 1];
        return "Latest: " + copilotEsc(lastC.kind || "Certificate") + " — " + copilotEsc(lastC.status || "Pending") +
            ". Apply/track in certificates.html.";
    }

    // Hostel complaints + SLA
    if (copilotHas(q, "complaint", "hostel", "electrical", "plumb", "clean", "water", "wifi", "fan", "room", "sla", "breach", "शिकायत")) {
        var comps = mine(copilotLoad("campusComplaints", []));
        if (!comps.length) return "No hostel complaints on record. Raise one from complaints.html with category + priority — each gets an SLA timer.";
        var openC = comps.filter(function (r) {
            return ["open", "in-progress", "in progress"].indexOf(String(r.status || "").toLowerCase()) !== -1;
        });
        var breached = openC.filter(function (r) {
            if (!r.createdAt || !r.slaHours) return false;
            return (Date.now() - new Date(r.createdAt).getTime()) > (Number(r.slaHours) * 3600 * 1000);
        }).length;
        var lastO = openC.length ? openC[openC.length - 1] : comps[comps.length - 1];
        return openC.length + " complaint(s) open" + (breached ? ", " + breached + " SLA-breached" : "") +
            ". Latest: " + copilotEsc(lastO.category || "") + " " + copilotEsc(lastO.room ? "Room " + lastO.room : "") +
            " — " + copilotEsc(lastO.status || "Open") + (lastO.slaHours ? " (SLA " + copilotEsc(lastO.slaHours) + "h)" : "") + ". See complaints.html.";
    }

    // Mess rating before menu
    if (copilotHas(q, "mess") && copilotHas(q, "rat", "feedback", "star", "taste", "rate", "रेटिंग")) {
        var fb = copilotLoad("campusMessFeedback", []);
        if (!fb.length) return "No mess feedback yet. Rate today's meal in mess.html — it feeds the Ops mess-rating tile.";
        var avg = fb.reduce(function (s, r) { return s + (Number(r.rating) || 0); }, 0) / fb.length;
        return "Mess rating: " + avg.toFixed(1) + "★ from " + fb.length + " review(s). Add yours in mess.html.";
    }

    // Mess menu
    if (copilotHas(q, "mess", "menu", "lunch", "dinner", "breakfast", "food", "meal", "मेस", "खाना", "मेनू", "भोजन")) {
        var menu = copilotLoad("campusMessMenu", []);
        var todaysMenu = null;
        menu.forEach(function (m) {
            if (String(m.day || "").toLowerCase() === dayName.toLowerCase()) todaysMenu = m;
        });
        if (!todaysMenu) return "7-day mess menu lives in mess.html. Today's entry is not set yet — ask the admin to update it.";
        return "Today's mess (" + dayName + "): Breakfast " + copilotEsc(todaysMenu.breakfast || "—") +
            " · Lunch " + copilotEsc(todaysMenu.lunch || "—") + " · Dinner " + copilotEsc(todaysMenu.dinner || "—") + ".";
    }

    // Notices
    if (copilotHas(q, "notice", "notices", "announce", "notification", "news", "नोटिस", "सूचना", "घोषणा")) {
        var anns = copilotLoad("campusAnnouncements", []);
        var rel = anns.filter(function (a) {
            var aud = String(a.audience || "All").toLowerCase();
            if (aud !== "all" && aud.indexOf("student") === -1) return false;
            if (me.dept && a.department && a.department !== "All" && a.department !== me.dept) return false;
            if (me.sem && a.semester && a.semester !== "All" && a.semester !== me.sem) return false;
            return true;
        });
        var show = (rel.length ? rel : anns).slice(-3).reverse();
        if (!show.length) return "No notices on this device yet. Check announcements.html after sync.";
        return "Latest for you:<br>· " + show.map(function (a) { return copilotEsc(a.title || a.message || "Notice"); }).join("<br>· ");
    }

    // Greeting (avoid bare 'hi' matching everything)
    var trimmed = q.trim();
    if (trimmed === "hi" || trimmed === "hello" || trimmed === "hey" ||
        copilotHas(q, "hello", "namaste", "नमस्ते", "good morning", "good evening")) {
        return "Hello" + (me.name ? " " + copilotEsc(me.name.split(" ")[0]) : "") + "! Ask about attendance, today's classes, exams, fees, leave, complaints, mess or notices.";
    }

    return "I can answer from your campus data: attendance, today's classes, exams, fees, leave/gate-pass, certificates, complaints + SLA, mess menu, notices. Try 'What is my attendance?' or 'Any notices for me?'";
}

function askCopilot() {

    const input =
        document.getElementById("copilotInput");

    const chat =
        document.getElementById("chatArea");

    if (!input || !chat) {
        return;
    }

    const question =
        input.value.trim();


    if (question === "") {
        return;
    }


    // Show student's question

    const userMessage =
        document.createElement("div");

    userMessage.className = "user-message";

    userMessage.style.cssText = `
        background:#2563eb;
        padding:12px;
        border-radius:10px;
        margin:10px 0 10px auto;
        max-width:70%;
    `;

    userMessage.textContent = question;

    chat.appendChild(userMessage);


    // Data-grounded offline-first response (no network, no key)

    let answer = copilotAnswer(question);


    setTimeout(function () {

        const botMessage =
            document.createElement("div");

        botMessage.className = "bot-message";

        botMessage.innerHTML =
            "<strong>Campus Copilot</strong>" +
            "<p>" + answer + "</p>";

        chat.appendChild(botMessage);

        chat.scrollTop =
            chat.scrollHeight;

    }, 400);


    input.value = "";
}

// Enter key submits (keeps inline onclick working)
(function bindCopilotEnter() {
    function bind() {
        var el = document.getElementById("copilotInput");
        if (el && !el.dataset.copilotBound) {
            el.dataset.copilotBound = "1";
            el.addEventListener("keydown", function (e) {
                if (e.key === "Enter") {
                    e.preventDefault();
                    askCopilot();
                }
            });
        }
    }
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", bind);
    } else {
        bind();
    }
})();


/* Logout */

function logout() {

    if (!confirm("Are you sure you want to log out?")) {
        return;
    }

    window.location.href =
        "index.html";

}

// Admin quick actions

function adminAction(type) {

    if (type === "student") {
        alert("Add Student module will open here.");
    }

    else if (type === "faculty") {
        alert("Add Faculty module will open here.");
    }

    else if (type === "course") {
        alert("Add Course module will open here.");
    }

    else if (type === "announcement") {
        alert("Announcement module will open here.");
    }
}


// Logout

function logout() {
    if (!confirm("Are you sure you want to log out?")) {
        return;
    }
    window.location.href = "index.html";
}

/* =========================
   STUDENT MANAGEMENT
========================= */

let students = JSON.parse(localStorage.getItem("campusStudents")) || [
    {
        id: "STU001",
        name: "Rahul Kumar",
        email: "rahul@example.com",
        department: "Computer Science",
        semester: "3rd Semester"
    },
    {
        id: "STU002",
        name: "Priya Sharma",
        email: "priya@example.com",
        department: "Information Technology",
        semester: "4th Semester"
    },
    {
        id: "STU003",
        name: "Aman Das",
        email: "aman@example.com",
        department: "Mechanical Engineering",
        semester: "2nd Semester"
    }
];

/* Student i18n helpers: resolve admin.students.* from the shared
   window.CAMPUS_I18N dict (lang.js + lang-admin.js) using the active
   language — same dict/pattern as timetableLang/timetableMsg, so no
   new system. Normalization mirrors lang.js (any non-"hi" means "en").
   window.getLang() is preferred; localStorage campusLang is the
   fallback when lang.js is absent. English fallback + call-time lookup
   keep messages working no matter which pack loads last. */

/* Active language, normalized to "en" | "hi". Never throws. */
function studentLang() {
    try {
        var raw = "";
        if (typeof window !== "undefined" && typeof window.getLang === "function") {
            raw = window.getLang();
        } else {
            try { raw = localStorage.getItem("campusLang"); } catch (e) { raw = ""; }
        }
        raw = String(raw == null ? "" : raw).trim().replace(/[^a-z]/gi, "").toLowerCase();
        return raw === "hi" ? "hi" : "en";
    } catch (e) { return "en"; }
}

/* key -> string in the active language, else English, else `fallback`. */
function studentMsg(key, fallback) {
    try {
        var store = (typeof window !== "undefined") ? window.CAMPUS_I18N : null;
        if (store) {
            var lang = studentLang();
            if (store[lang] && store[lang][key]) return store[lang][key];
            if (store.en && store.en[key]) return store.en[key];
        }
    } catch (e) {}
    return fallback;
}

/* "{0} students" template -> count value. Never throws. */
function studentCountText(n) {
    try {
        if (n === 1) return studentMsg("admin.students.countOne", "1 student");
        return String(studentMsg("admin.students.countZero", "{0} students")).replace("{0}", String(n));
    } catch (e) { return n === 1 ? "1 student" : n + " students"; }
}

/* Remember the last student form message key so a language switch can
   re-resolve it via studentMsg(). Plain-text node, no data-i18n. */
function setStudentMessage(key, fallback, color) {
    try {
        var el = document.getElementById("studentMessage");
        if (!el) return;
        el.textContent = studentMsg(key, fallback);
        try { el.dataset.studentMsgKey = key; } catch (e) {}
        try { el.dataset.studentMsgFallback = fallback; } catch (e) {}
        if (color) el.style.color = color;
    } catch (e) {}
}


function displayStudents(studentList = students) {

    const tableBody =
        document.getElementById("studentTableBody");

    if (!tableBody) return;

    tableBody.innerHTML = "";

    if (studentList.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align:center;">
                    ${studentMsg("admin.students.empty", "No students found.")}
                </td>
            </tr>
        `;
    } else {
    studentList.forEach(function(student) {

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${student.id}</td>

            <td>
                <strong>${student.name}</strong>
            </td>

            <td>${student.email}</td>

            <td>${student.department}</td>

            <td>${student.semester}</td>

            <td>${canDeleteEntries() ? `
                <button
                    class="delete-student-btn"
                    onclick="deleteStudent('${student.id}')"
                >
                    <svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg><span data-i18n="admin.students.delete">Delete</span>
                </button>` : "-"}
            </td>
        `;

        tableBody.appendChild(row);
    });
    }

    const count =
        document.getElementById("studentCount");

    if (count) {
        count.textContent = studentCountText(studentList.length);
    }
    /* Translate the freshly injected Delete buttons (data-i18n). Guarded:
       works with or without lang.js on the page. */
    try { applyLang(getLang()); } catch (e) {}
}


function addStudent(event) {

    event.preventDefault();

    const name =
        document.getElementById("studentName").value.trim();

    const id =
        document.getElementById("studentId").value.trim();

    const email =
        document.getElementById("studentEmail").value.trim();

    const department =
        document.getElementById("studentDepartment").value;

    const semester =
        document.getElementById("studentSemester").value;


    // Required-field validation (HTML `required` normally blocks empty
    // submits; this covers programmatic/bypassed submits in-page lang).

    if (!name || !id || !email || !department || !semester) {
        setStudentMessage(
            "admin.students.fillRequired",
            "Please fill in all required fields.",
            "#dc2626"
        );

        return;
    }


    // Check duplicate ID

    const existingStudent =
        students.find(function(student) {
            return student.id.toLowerCase() === id.toLowerCase();
        });

    if (existingStudent) {

        setStudentMessage(
            "admin.students.dupId",
            "A student with this ID already exists.",
            "#dc2626"
        );

        return;
    }


    // Create student

    const newStudent = {
        id: id,
        name: name,
        email: email,
        department: department,
        semester: semester
    };


    students.push(newStudent);


    // Save to browser storage

    localStorage.setItem(
        "campusStudents",
        JSON.stringify(students)
    );


    displayStudents();


    setStudentMessage(
        "admin.students.addSuccess",
        "Student added successfully!",
        "#16a34a"
    );


    document.getElementById("studentForm").reset();
}


function deleteStudent(studentId) {
try { if (!requireDeleteAdmin()) return; } catch (e) { return; }

    const confirmed =
        confirm(studentMsg("admin.students.delConfirm", "Are you sure you want to delete this student?"));

    if (!confirmed) return;


    students = students.filter(function(student) {
        return student.id !== studentId;
    });


    localStorage.setItem(
        "campusStudents",
        JSON.stringify(students)
    );


    displayStudents();
}


function searchStudents() {

    const search =
        document
            .getElementById("studentSearch")
            .value
            .toLowerCase()
            .trim();


    const filteredStudents =
        students.filter(function(student) {

            return (
                student.id.toLowerCase().includes(search) ||
                student.name.toLowerCase().includes(search) ||
                student.email.toLowerCase().includes(search) ||
                student.department.toLowerCase().includes(search)
            );

        });


    displayStudents(filteredStudents);
}


/* Initialize student page */

document.addEventListener("DOMContentLoaded", function() {

    const studentForm =
        document.getElementById("studentForm");

    if (studentForm) {

        studentForm.addEventListener(
            "submit",
            addStudent
        );

        displayStudents();
    }

});

/* Language-change re-render.
   lang.js dispatches `campus:lang` at the end of applyLang(), and the
   #langSelect path routes setLanguage() -> applyLang(), so this single
   listener covers both the select and the toggle button. Re-rendering
   re-resolves the empty-state cell, count label (plain text, no
   data-i18n) and the last form message through studentMsg() in the new
   language. Deduped on the lang value so applyLang() firing twice per
   switch only re-renders once. Scoped to the student table: nothing
   else on the page is touched. */
(function () {
    try {
        if (typeof document === "undefined" ||
            typeof document.addEventListener !== "function") return;
        var lastRenderedLang = null;
        document.addEventListener("campus:lang", function (e) {
            try {
                var lang = (e && e.detail && e.detail.lang) ? e.detail.lang : studentLang();
                if (lang === lastRenderedLang) return;
                if (!document.getElementById("studentTableBody")) return;
                lastRenderedLang = lang;
                /* searchStudents() reads the same input and delegates to
                   displayStudents(), so an active filter survives. */
                if (document.getElementById("studentSearch")) searchStudents();
                else displayStudents();
                /* Re-resolve the last form message (dup-ID error, success,
                   validation) in the new language. */
                try {
                    var msg = document.getElementById("studentMessage");
                    if (msg && msg.dataset && msg.dataset.studentMsgKey) {
                        msg.textContent = studentMsg(
                            msg.dataset.studentMsgKey,
                            msg.dataset.studentMsgFallback || msg.textContent
                        );
                    }
                } catch (err) {}
            } catch (err) {}
        });
    } catch (e) {}
})();

/* =========================
   FACULTY MANAGEMENT
========================= */

let faculty = JSON.parse(
    localStorage.getItem("campusFaculty")
) || [
    {
        id: "FAC001",
        name: "Dr. Priya Sharma",
        email: "priya@example.com",
        department: "Computer Science",
        subject: "Programming"
    },
    {
        id: "FAC002",
        name: "Prof. Raj Kumar",
        email: "raj@example.com",
        department: "Information Technology",
        subject: "Database Systems"
    },
    {
        id: "FAC003",
        name: "Dr. Amit Das",
        email: "amit@example.com",
        department: "Mechanical Engineering",
        subject: "Engineering Mechanics"
    }
];


function displayFaculty(facultyList = faculty) {

    const tableBody =
        document.getElementById("facultyTableBody");

    if (!tableBody) return;

    tableBody.innerHTML = "";


    facultyList.forEach(function(member) {

        const row =
            document.createElement("tr");


        row.innerHTML = `
            <td>${member.id}</td>

            <td>
                <strong>${member.name}</strong>
            </td>

            <td>${member.email}</td>

            <td>${member.department}</td>

            <td>${member.subject}</td>

            <td>${canDeleteEntries() ? `
                <button
                    class="delete-student-btn"
                    onclick="deleteFaculty('${member.id}')"
                >
                    <svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg><span data-i18n="admin.faculty.delete">Delete</span>
                </button>` : "-"}
            </td>
        `;


        tableBody.appendChild(row);

    });


    const count =
        document.getElementById("facultyCount");


    if (count) {

        count.textContent =
            (facultyList.length === 1 ? "1 शिक्षक" : facultyList.length + " शिक्षक");

    }
    applyLang(getLang());
}


function addFaculty(event) {

    event.preventDefault();


    const name =
        document
            .getElementById("facultyName")
            .value
            .trim();


    const id =
        document
            .getElementById("facultyId")
            .value
            .trim();


    const email =
        document
            .getElementById("facultyEmail")
            .value
            .trim();


    const department =
        document.getElementById(
            "facultyDepartment"
        ).value;


    const subject =
        document
            .getElementById("facultySubject")
            .value
            .trim();


    const message =
        document.getElementById(
            "facultyMessage"
        );


    // Check duplicate ID

    const existingFaculty =
        faculty.find(function(member) {

            return (
                member.id.toLowerCase() ===
                id.toLowerCase()
            );

        });


    if (existingFaculty) {

        message.style.color = "#dc2626";

        message.textContent =
            "इस ID वाला शिक्षक पहले से मौजूद है।";

        return;

    }


    // Create faculty member

    const newFaculty = {

        id: id,

        name: name,

        email: email,

        department: department,

        subject: subject

    };


    faculty.push(newFaculty);


    // Save

    localStorage.setItem(
        "campusFaculty",
        JSON.stringify(faculty)
    );


    displayFaculty();


    message.style.color = "#16a34a";

    message.textContent =
        "शिक्षक सफलतापूर्वक जोड़ा गया!";


    document
        .getElementById("facultyForm")
        .reset();

}


function deleteFaculty(facultyId) {
try { if (!requireDeleteAdmin()) return; } catch (e) { return; }

    const confirmed =
        confirm(
            "क्या आप इस शिक्षक को हटाना चाहते हैं?"
        );


    if (!confirmed) return;


    faculty =
        faculty.filter(function(member) {

            return member.id !== facultyId;

        });


    localStorage.setItem(
        "campusFaculty",
        JSON.stringify(faculty)
    );


    displayFaculty();

}


function searchFaculty() {

    const search =
        document
            .getElementById("facultySearch")
            .value
            .toLowerCase()
            .trim();


    const filteredFaculty =
        faculty.filter(function(member) {

            return (

                member.id
                    .toLowerCase()
                    .includes(search)

                ||

                member.name
                    .toLowerCase()
                    .includes(search)

                ||

                member.email
                    .toLowerCase()
                    .includes(search)

                ||

                member.department
                    .toLowerCase()
                    .includes(search)

                ||

                member.subject
                    .toLowerCase()
                    .includes(search)

            );

        });


    displayFaculty(filteredFaculty);

}


/* Initialize */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        const facultyForm =
            document.getElementById(
                "facultyForm"
            );


        if (facultyForm) {

            facultyForm.addEventListener(
                "submit",
                addFaculty
            );

            displayFaculty();

        }

    }
);

/* =========================
   DEPARTMENT MANAGEMENT
========================= */

let departments = JSON.parse(
    localStorage.getItem("campusDepartments")
) || [
    {
        name: "Computer Science",
        code: "CSE"
    },
    {
        name: "Information Technology",
        code: "IT"
    },
    {
        name: "Mechanical Engineering",
        code: "ME"
    }
];


let courses = JSON.parse(
    localStorage.getItem("campusCourses")
) || [
    {
        name: "Data Structures",
        code: "CSE201",
        department: "Computer Science",
        semester: "3rd Semester"
    },
    {
        name: "Database Systems",
        code: "CSE301",
        department: "Computer Science",
        semester: "4th Semester"
    }
];


/* Add Department */

function addDepartment(event) {

    event.preventDefault();

    const name =
        document.getElementById("departmentName")
        .value
        .trim();

    const code =
        document.getElementById("departmentCode")
        .value
        .trim()
        .toUpperCase();

    const message =
        document.getElementById("departmentMessage");


    const exists = departments.some(function(department) {

        return (
            department.code.toLowerCase() ===
            code.toLowerCase()
        );

    });


    if (exists) {

        message.style.color = "#dc2626";

        message.textContent =
            "यह विभाग कोड पहले से मौजूद है।";

        return;
    }


    departments.push({
        name: name,
        code: code
    });


    localStorage.setItem(
        "campusDepartments",
        JSON.stringify(departments)
    );


    message.style.color = "#16a34a";

    message.textContent =
        "विभाग सफलतापूर्वक जोड़ा गया!";


    document
        .getElementById("departmentForm")
        .reset();


    loadDepartmentOptions();

    displayDepartments();

}


/* Display Departments */

function displayDepartments(list = departments) {

    const container =
        document.getElementById("departmentList");

    if (!container) return;

    container.innerHTML = "";


    list.forEach(function(department) {

        const card =
            document.createElement("div");

        card.className =
            "department-card";


        card.innerHTML = `
            <h3>${department.name}</h3>

            <p>
                Department Code:
                <strong>${department.code}</strong>
            </p>

            ${canDeleteEntries() ? `
            <button
                class="delete-academic-btn"
                onclick="deleteDepartment('${department.code}')"
            >
                <svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg><span data-i18n="admin.departments.delete">Delete</span>
            </button>` : ""}
        `;


        container.appendChild(card);

    });


    const count =
        document.getElementById("departmentCount");


    if (count) {

        count.textContent =
            (list.length === 1 ? "1 विभाग" : list.length + " विभाग");

    }
    applyLang(getLang());
}


/* Search Departments */

function searchDepartments() {

    const search =
        document
            .getElementById("departmentSearch")
            .value
            .toLowerCase()
            .trim();


    const filtered =
        departments.filter(function(department) {

            return (
                department.name
                    .toLowerCase()
                    .includes(search)

                ||

                department.code
                    .toLowerCase()
                    .includes(search)
            );

        });


    displayDepartments(filtered);

}


/* Delete Department */

function deleteDepartment(code) {
try { if (!requireDeleteAdmin()) return; } catch (e) { return; }

    const hasCourses =
        courses.some(function(course) {

            return course.department ===
                departments.find(
                    department =>
                        department.code === code
                )?.name;

        });


    if (hasCourses) {

        alert(
            "इस विभाग में पाठ्यक्रम असाइन किए गए हैं। पहले उन पाठ्यक्रमों को हटाएं।"
        );

        return;
    }


    if (
        !confirm(
            "क्या आप इस विभाग को हटाना चाहते हैं?"
        )
    ) {
        return;
    }


    departments =
        departments.filter(function(department) {

            return department.code !== code;

        });


    localStorage.setItem(
        "campusDepartments",
        JSON.stringify(departments)
    );


    loadDepartmentOptions();

    displayDepartments();

}


/* Load Departments into Course Dropdown */

function loadDepartmentOptions() {

    const select =
        document.getElementById("courseDepartment");

    if (!select) return;


    select.innerHTML = `
        <option value="">
            Select Department
        </option>
    `;


    departments.forEach(function(department) {

        const option =
            document.createElement("option");

        option.value =
            department.name;

        option.textContent =
            `${department.name} (${department.code})`;

        select.appendChild(option);

    });

}


/* =========================
   COURSE MANAGEMENT
========================= */


/* Add Course */

function addCourse(event) {

    event.preventDefault();


    const name =
        document
            .getElementById("courseName")
            .value
            .trim();


    const code =
        document
            .getElementById("courseCode")
            .value
            .trim()
            .toUpperCase();


    const department =
        document
            .getElementById("courseDepartment")
            .value;


    const semester =
        document
            .getElementById("courseSemester")
            .value;


    const message =
        document.getElementById("courseMessage");


    const exists =
        courses.some(function(course) {

            return (
                course.code.toLowerCase() ===
                code.toLowerCase()
            );

        });


    if (exists) {

        message.style.color = "#dc2626";

        message.textContent =
            "यह पाठ्यक्रम कोड पहले से मौजूद है।";

        return;
    }


    courses.push({

        name: name,

        code: code,

        department: department,

        semester: semester

    });


    localStorage.setItem(
        "campusCourses",
        JSON.stringify(courses)
    );


    message.style.color = "#16a34a";

    message.textContent =
        "पाठ्यक्रम सफलतापूर्वक जोड़ा गया!";


    document
        .getElementById("courseForm")
        .reset();


    displayCourses();

}


/* Display Courses */

function displayCourses(list = courses) {

    const table =
        document.getElementById(
            "courseTableBody"
        );

    if (!table) return;


    table.innerHTML = "";


    list.forEach(function(course) {

        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>
                <strong>${course.code}</strong>
            </td>

            <td>${course.name}</td>

            <td>${course.department}</td>

            <td>${course.semester}</td>

            <td>${canDeleteEntries() ? `

                <button
                    class="delete-academic-btn"
                    onclick="deleteCourse('${course.code}')"
                >
                    <svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg><span data-i18n="admin.courses.delete">Delete</span>
                </button>` : "-"}

            </td>

        `;


        table.appendChild(row);

    });


    const count =
        document.getElementById(
            "courseCount"
        );


    if (count) {

        count.textContent =
            (list.length === 1 ? "1 पाठ्यक्रम" : list.length + " पाठ्यक्रम");

    }
    applyLang(getLang());
}


/* Search Courses */

function searchCourses() {

    const search =
        document
            .getElementById("courseSearch")
            .value
            .toLowerCase()
            .trim();


    const filtered =
        courses.filter(function(course) {

            return (

                course.name
                    .toLowerCase()
                    .includes(search)

                ||

                course.code
                    .toLowerCase()
                    .includes(search)

                ||

                course.department
                    .toLowerCase()
                    .includes(search)

                ||

                course.semester
                    .toLowerCase()
                    .includes(search)

            );

        });


    displayCourses(filtered);

}


/* Delete Course */

function deleteCourse(code) {
try { if (!requireDeleteAdmin()) return; } catch (e) { return; }

    if (
        !confirm(
            "क्या आप इस पाठ्यक्रम को हटाना चाहते हैं?"
        )
    ) {
        return;
    }


    courses =
        courses.filter(function(course) {

            return course.code !== code;

        });


    localStorage.setItem(
        "campusCourses",
        JSON.stringify(courses)
    );


    displayCourses();

}


/* Initialize Academic Page */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        const departmentForm =
            document.getElementById(
                "departmentForm"
            );

        const courseForm =
            document.getElementById(
                "courseForm"
            );


        if (departmentForm) {

            departmentForm.addEventListener(
                "submit",
                addDepartment
            );

            displayDepartments();

            loadDepartmentOptions();

        }


        if (courseForm) {

            courseForm.addEventListener(
                "submit",
                addCourse
            );

            displayCourses();

        }

    }
);

/* =========================
   TIMETABLE MANAGEMENT
========================= */

let timetable = JSON.parse(localStorage.getItem("campusTimetable")) || [
    {
        id: 1,
        course: "Data Structures",
        faculty: "Dr. Priya Sharma",
        day: "Monday",
        start: "09:00",
        end: "10:00",
        room: "Room 204",
        semester: "3rd Semester"
    },
    {
        id: 2,
        course: "Database Systems",
        faculty: "Prof. Raj Kumar",
        day: "Tuesday",
        start: "11:00",
        end: "12:00",
        room: "Lab 1",
        semester: "4th Semester"
    },
    {
        id: 3,
        course: "Engineering Mechanics",
        faculty: "Dr. Amit Das",
        day: "Wednesday",
        start: "14:00",
        end: "15:00",
        room: "Room 105",
        semester: "2nd Semester"
    }
];

/* Timetable i18n helpers: resolve academic.timetable.* from the shared
   window.CAMPUS_I18N dict (lang.js + lang-academic.js) using the active
   language — same dict/pattern as campus-hub.js t() and lang.js
   applyLang, so no new system. Normalization mirrors lang.js
   (tolerates the JSON-quoted LS shape, any non-"hi" value means "en").
   window.getLang() is preferred; localStorage campusLang is the
   fallback when lang.js is absent. English fallback + call-time lookup
   keep alerts working no matter which pack loads last. */

/* Active language, normalized to "en" | "hi". Never throws. */
function timetableLang() {
    try {
        var raw = "";
        if (typeof window !== "undefined" && typeof window.getLang === "function") {
            raw = window.getLang();
        } else {
            try { raw = localStorage.getItem("campusLang"); } catch (e) { raw = ""; }
        }
        raw = String(raw == null ? "" : raw).trim().replace(/[^a-z]/gi, "").toLowerCase();
        return raw === "hi" ? "hi" : "en";
    } catch (e) { return "en"; }
}

/* key -> string in the active language, else English, else `fallback`. */
function timetableMsg(key, fallback) {
    try {
        var store = (typeof window !== "undefined") ? window.CAMPUS_I18N : null;
        if (store) {
            var lang = timetableLang();
            if (store[lang] && store[lang][key]) return store[lang][key];
            if (store.en && store.en[key]) return store.en[key];
        }
    } catch (e) {}
    return fallback;
}

function displayTimetable(data = timetable) {

    const tableBody = document.getElementById("timetableTableBody");

    if (!tableBody) return;

    tableBody.innerHTML = "";

    if (data.length === 0) {
        tableBody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align:center;">
                    ${timetableMsg("academic.timetable.noRecords", "No timetable records found.")}
                </td>
            </tr>
        `;
        try { applyLang(getLang()); } catch (e) {}
        return;
    }

    data.forEach(item => {

        tableBody.innerHTML += `
            <tr>
                <td>${item.course}</td>
                <td>${item.faculty}</td>
                <td>${item.day}</td>
                <td>${item.start} - ${item.end}</td>
                <td>${item.room}</td>
                <td>${item.semester}</td>
                <td>${canDeleteEntries() ? `
                    <button
                        class="delete-btn"
                        onclick="deleteTimetable(${item.id})">
                        <span data-i18n="academic.timetable.delete">Delete</span>
                    </button>` : "-"}
                </td>
            </tr>
        `;

    });

    /* Translate the freshly injected Delete buttons (data-i18n). Guarded:
       works with or without lang.js on the page. */
    try { applyLang(getLang()); } catch (e) {}
}

function addTimetable(event) {

    event.preventDefault();

    const course = document.getElementById("timetableCourse").value.trim();
    const faculty = document.getElementById("timetableFaculty").value.trim();
    const day = document.getElementById("timetableDay").value;
    const start = document.getElementById("startTime").value;
    const end = document.getElementById("endTime").value;
    const room = document.getElementById("timetableRoom").value.trim();
    const semester = document.getElementById("timetableSemester").value;

    if (start >= end) {
        alert(timetableMsg("academic.timetable.endTimeError", "End time must be later than start time."));
        return;
    }

    const newSchedule = {
        id: Date.now(),
        course,
        faculty,
        day,
        start,
        end,
        room,
        semester
    };

    timetable.push(newSchedule);

    localStorage.setItem(
        "campusTimetable",
        JSON.stringify(timetable)
    );

    displayTimetable();

    document.getElementById("timetableForm").reset();

    alert(timetableMsg("academic.timetable.addSuccess", "Class schedule added successfully!"));
}

function deleteTimetable(id) {
try { if (!requireDeleteAdmin("academic.timetable.adminOnly")) return; } catch (e) { return; }

    if (!confirm(timetableMsg("academic.timetable.delConfirm", "Are you sure you want to delete this schedule?"))) {
        return;
    }

    timetable = timetable.filter(item => item.id !== id);

    localStorage.setItem(
        "campusTimetable",
        JSON.stringify(timetable)
    );

    displayTimetable();
}

function searchTimetable() {

    const searchText =
        document.getElementById("timetableSearch").value.toLowerCase();

    const selectedDay =
        document.getElementById("dayFilter").value;

    const selectedSemester =
        document.getElementById("semesterFilter").value;

    const filtered = timetable.filter(item => {

        const matchesText =
            item.course.toLowerCase().includes(searchText) ||
            item.faculty.toLowerCase().includes(searchText);

        const matchesDay =
            selectedDay === "" || item.day === selectedDay;

        const matchesSemester =
            selectedSemester === "" ||
            item.semester === selectedSemester;

        return matchesText && matchesDay && matchesSemester;
    });

    displayTimetable(filtered);
}


/* Initialize timetable page */

document.addEventListener("DOMContentLoaded", function () {

    const timetableForm =
        document.getElementById("timetableForm");

    if (timetableForm) {
        timetableForm.addEventListener(
            "submit",
            addTimetable
        );

        displayTimetable();
    }

});

/* Language-change re-render.
   lang.js dispatches `campus:lang` at the end of applyLang(), and the
   #langSelect path routes setLanguage() -> applyLang(), so this single
   listener covers both the select and the toggle button. Re-rendering
   re-resolves the empty-state cell (plain text, no data-i18n) through
   timetableMsg() in the new language. Deduped on the lang value so
   applyLang() firing twice per switch only re-renders once. Scoped to
   the timetable table: nothing else on the page is touched. */
(function () {
    try {
        if (typeof document === "undefined" ||
            typeof document.addEventListener !== "function") return;
        var lastRenderedLang = null;
        document.addEventListener("campus:lang", function (e) {
            try {
                var lang = (e && e.detail && e.detail.lang) ? e.detail.lang : timetableLang();
                if (lang === lastRenderedLang) return;
                if (!document.getElementById("timetableTableBody")) return;
                lastRenderedLang = lang;
                /* searchTimetable() reads the same inputs and delegates to
                   displayTimetable(), so an active filter survives. */
                if (document.getElementById("timetableSearch")) searchTimetable();
                else displayTimetable();
            } catch (err) {}
        });
    } catch (e) {}
})();

/* =========================
   FEES MANAGEMENT
========================= */

let feeRecords =
    JSON.parse(localStorage.getItem("campusFees")) || [

        {
            id: 1,
            studentName: "Rahul Kumar",
            studentId: "STU001",
            semester: "3rd Semester",
            tuition: 45000,
            hostel: 15000,
            exam: 3000,
            paid: 50000
        },

        {
            id: 2,
            studentName: "Priya Sharma",
            studentId: "STU002",
            semester: "4th Semester",
            tuition: 45000,
            hostel: 0,
            exam: 3000,
            paid: 48000
        },

        {
            id: 3,
            studentName: "Aman Das",
            studentId: "STU003",
            semester: "2nd Semester",
            tuition: 40000,
            hostel: 15000,
            exam: 3000,
            paid: 0
        }

    ];


/* =========================
   CALCULATE TOTAL
========================= */

function getTotalFee(record) {

    return (
        Number(record.tuition) +
        Number(record.hostel) +
        Number(record.exam)
    );

}


/* =========================
   GET STATUS
========================= */

function getFeeStatus(record) {

    const total = getTotalFee(record);
    const paid = Number(record.paid);

    if (paid >= total) {
        return "Paid";
    }

    if (paid > 0) {
        return "Partial";
    }

    return "Pending";

}


/* =========================
   DISPLAY FEES
========================= */

function displayFees(data = feeRecords) {

    const tableBody =
        document.getElementById("feeTableBody");

    if (!tableBody) return;

    tableBody.innerHTML = "";


    if (data.length === 0) {

        tableBody.innerHTML = `
            <tr>
                <td colspan="8" style="text-align:center;">
                    कोई शुल्क रिकॉर्ड नहीं मिला।
                </td>
            </tr>
        `;

        updateFeeSummary();

        return;
    }


    data.forEach(record => {

        const total = getTotalFee(record);

        const paid = Number(record.paid);

        const due = Math.max(total - paid, 0);

        const status = getFeeStatus(record);


        let statusClass = "";

        if (status === "Paid") {
            statusClass = "status-paid";
        }
        else if (status === "Partial") {
            statusClass = "status-partial";
        }
        else {
            statusClass = "status-pending";
        }


        tableBody.innerHTML += `

            <tr>

                <td>${record.studentName}</td>

                <td>${record.studentId}</td>

                <td>${record.semester}</td>

                <td>₹${total.toLocaleString("en-IN")}</td>

                <td>₹${paid.toLocaleString("en-IN")}</td>

                <td>₹${due.toLocaleString("en-IN")}</td>

                <td class="${statusClass}">
                    ${status}
                </td>

                <td>${canDeleteEntries() ? `

                    <button
                        class="delete-btn"
                        onclick="deleteFee(${record.id})">

                        <span data-i18n="academic.fees.delete">Delete</span>

                    </button>` : "-"}

                </td>

            </tr>

        `;

    });


    updateFeeSummary();
    applyLang(getLang());
}


/* =========================
   ADD FEE
========================= */

function addFee(event) {

    event.preventDefault();


    const studentName =
        document.getElementById("feeStudentName").value.trim();

    const studentId =
        document.getElementById("feeStudentId").value.trim();

    const semester =
        document.getElementById("feeSemester").value;

    const tuition =
        Number(document.getElementById("tuitionFee").value);

    const hostel =
        Number(document.getElementById("hostelFee").value);

    const exam =
        Number(document.getElementById("examFee").value);

    const paid =
        Number(document.getElementById("paidAmount").value);


    const total = tuition + hostel + exam;


    if (paid > total) {

        alert(
            "भुगतान की गई राशि कुल शुल्क से ज़्यादा नहीं हो सकती।"
        );

        return;
    }


    const newRecord = {

        id: Date.now(),

        studentName,

        studentId,

        semester,

        tuition,

        hostel,

        exam,

        paid

    };


    feeRecords.push(newRecord);


    localStorage.setItem(
        "campusFees",
        JSON.stringify(feeRecords)
    );


    displayFees();


    document
        .getElementById("feeForm")
        .reset();


    alert("शुल्क रिकॉर्ड सफलतापूर्वक जोड़ा गया!");

}


/* =========================
   DELETE FEE
========================= */

function deleteFee(id) {
try { if (!requireDeleteAdmin()) return; } catch (e) { return; }

    if (
        !confirm(
            "क्या आप इस शुल्क रिकॉर्ड को हटाना चाहते हैं?"
        )
    ) {
        return;
    }


    feeRecords =
        feeRecords.filter(
            record => record.id !== id
        );


    localStorage.setItem(
        "campusFees",
        JSON.stringify(feeRecords)
    );


    displayFees();

}


/* =========================
   SEARCH FEES
========================= */

function searchFees() {

    const searchText =
        document
            .getElementById("feeSearch")
            .value
            .toLowerCase();


    const selectedStatus =
        document.getElementById("feeStatusFilter").value;


    const filtered =
        feeRecords.filter(record => {

            const matchesSearch =

                record.studentName
                    .toLowerCase()
                    .includes(searchText)

                ||

                record.studentId
                    .toLowerCase()
                    .includes(searchText);


            const matchesStatus =

                selectedStatus === ""

                ||

                getFeeStatus(record) ===
                selectedStatus;


            return (
                matchesSearch &&
                matchesStatus
            );

        });


    displayFees(filtered);

}


/* =========================
   UPDATE SUMMARY
========================= */

function updateFeeSummary() {

    const totalFeesElement =
        document.getElementById("totalFees");

    const totalPaidElement =
        document.getElementById("totalPaid");

    const totalDueElement =
        document.getElementById("totalDue");

    const pendingStudentsElement =
        document.getElementById("pendingStudents");


    if (!totalFeesElement) return;


    let totalFees = 0;

    let totalPaid = 0;

    let totalDue = 0;

    let pendingStudents = 0;


    feeRecords.forEach(record => {

        const total =
            getTotalFee(record);

        const paid =
            Number(record.paid);

        const due =
            Math.max(total - paid, 0);


        totalFees += total;

        totalPaid += paid;

        totalDue += due;


        if (due > 0) {
            pendingStudents++;
        }

    });


    totalFeesElement.textContent =
        "₹" + totalFees.toLocaleString("en-IN");


    totalPaidElement.textContent =
        "₹" + totalPaid.toLocaleString("en-IN");


    totalDueElement.textContent =
        "₹" + totalDue.toLocaleString("en-IN");


    pendingStudentsElement.textContent =
        pendingStudents;

}


/* =========================
   INITIALIZE FEES PAGE
========================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const feeForm =
            document.getElementById("feeForm");


        if (feeForm) {

            feeForm.addEventListener(
                "submit",
                addFee
            );


            displayFees();

        }

    }
);


/* =========================
   EXAM DATA
========================= */

let examinations =
    JSON.parse(
        localStorage.getItem("campusExaminations")
    ) || [

        {
            id: 1,
            name: "Mid Semester Examination",
            course: "Data Structures",
            semester: "3rd Semester",
            date: "2026-10-15",
            maxMarks: 100
        },

        {
            id: 2,
            name: "End Semester Examination",
            course: "Database Systems",
            semester: "4th Semester",
            date: "2026-12-10",
            maxMarks: 100
        }

    ];


/* =========================
   RESULT DATA
========================= */

let studentResults =
    JSON.parse(
        localStorage.getItem("campusResults")
    ) || [

        {
            id: 1,
            studentName: "Rahul Kumar",
            studentId: "STU001",
            exam: "Mid Semester Examination",
            subject: "Data Structures",
            marks: 88,
            maxMarks: 100
        },

        {
            id: 2,
            studentName: "Priya Sharma",
            studentId: "STU002",
            exam: "Mid Semester Examination",
            subject: "Data Structures",
            marks: 76,
            maxMarks: 100
        },

        {
            id: 3,
            studentName: "Aman Das",
            studentId: "STU003",
            exam: "Mid Semester Examination",
            subject: "Data Structures",
            marks: 38,
            maxMarks: 100
        }

    ];


/* =========================
   SAVE DATA
========================= */

function saveExamData() {

    localStorage.setItem(
        "campusExaminations",
        JSON.stringify(examinations)
    );

    localStorage.setItem(
        "campusResults",
        JSON.stringify(studentResults)
    );

}


/* =========================
   GRADE CALCULATION
========================= */

function getGrade(percentage) {

    if (percentage >= 90) {
        return "A+";
    }

    if (percentage >= 80) {
        return "A";
    }

    if (percentage >= 70) {
        return "B";
    }

    if (percentage >= 60) {
        return "C";
    }

    if (percentage >= 50) {
        return "D";
    }

    if (percentage >= 40) {
        return "E";
    }

    return "F";

}


/* =========================
   PASS / FAIL
========================= */

function getResultStatus(percentage) {

    return percentage >= 40
        ? "Pass"
        : "Fail";

}


/* =========================
   DISPLAY EXAMS
========================= */

function displayExaminations() {

    const tableBody =
        document.getElementById("examTableBody");

    if (!tableBody) return;

    tableBody.innerHTML = "";


    if (examinations.length === 0) {

        tableBody.innerHTML = `
            <tr>
                <td colspan="6" style="text-align:center;">
                    No examinations found.
                </td>
            </tr>
        `;

        return;
    }


    examinations.forEach(exam => {

        tableBody.innerHTML += `

            <tr>

                <td>${exam.name}</td>

                <td>${exam.course}</td>

                <td>${exam.semester}</td>

                <td>
                    ${exam.date}
                </td>

                <td>
                    ${exam.maxMarks}
                </td>

                <td>${canDeleteEntries() ? `

                    <button
                        class="delete-btn"
                        onclick="deleteExamination(${exam.id})">

                        Delete

                    </button>` : "-"}

                </td>

            </tr>

        `;

    });

}


/* =========================
   ADD EXAM
========================= */

function addExamination(event) {

    event.preventDefault();

    if (!confirm("Are you sure you want to create this examination?")) {
        return;
    }


    const name =
        document.getElementById("examName").value.trim();

    const course =
        document.getElementById("examCourse").value.trim();

    const semester =
        document.getElementById("examSemester").value;

    const date =
        document.getElementById("examDate").value;

    const maxMarks =
        Number(
            document.getElementById("examMaxMarks").value
        );


    const newExam = {

        id: Date.now(),

        name,

        course,

        semester,

        date,

        maxMarks

    };


    examinations.push(newExam);


    saveExamData();

    displayExaminations();

    updateExamSummary();


    document
        .getElementById("examForm")
        .reset();


    alert("Examination created successfully!");

}


/* =========================
   DELETE EXAM
========================= */

function deleteExamination(id) {
try { if (!requireDeleteAdmin()) return; } catch (e) { return; }

    if (
        !confirm(
            "Are you sure you want to delete this examination?"
        )
    ) {
        return;
    }


    examinations =
        examinations.filter(
            exam => exam.id !== id
        );


    saveExamData();

    displayExaminations();

    updateExamSummary();

}


/* =========================
   DISPLAY RESULTS
========================= */

function displayResults(data = studentResults) {

    const tableBody =
        document.getElementById("resultTableBody");

    if (!tableBody) return;

    tableBody.innerHTML = "";


    if (data.length === 0) {

        tableBody.innerHTML = `
            <tr>
                <td colspan="9" style="text-align:center;">
                    No results found.
                </td>
            </tr>
        `;

        updateExamSummary();

        return;
    }


    data.forEach(result => {

        const percentage =
            (result.marks / result.maxMarks) * 100;


        const grade =
            getGrade(percentage);


        const status =
            getResultStatus(percentage);


        const statusClass =
            status === "Pass"
                ? "result-pass"
                : "result-fail";


        tableBody.innerHTML += `

            <tr>

                <td>
                    ${result.studentName}
                </td>

                <td>
                    ${result.studentId}
                </td>

                <td>
                    ${result.exam}
                </td>

                <td>
                    ${result.subject}
                </td>

                <td>
                    ${result.marks}/${result.maxMarks}
                </td>

                <td>
                    ${percentage.toFixed(1)}%
                </td>

                <td>
                    ${grade}
                </td>

                <td class="${statusClass}">
                    ${status}
                </td>

                <td>${canDeleteEntries() ? `

                    <button
                        class="delete-btn"
                        onclick="deleteResult(${result.id})">

                        Delete

                    </button>` : "-"}

                </td>

            </tr>

        `;

    });


    updateExamSummary();

}


/* =========================
   ADD RESULT
========================= */

function addResult(event) {

    event.preventDefault();

    if (!confirm("Are you sure you want to add this result?")) {
        return;
    }


    const studentName =
        document
            .getElementById("resultStudentName")
            .value
            .trim();


    const studentId =
        document
            .getElementById("resultStudentId")
            .value
            .trim();


    const exam =
        document
            .getElementById("resultExam")
            .value
            .trim();


    const subject =
        document
            .getElementById("resultSubject")
            .value
            .trim();


    const marks =
        Number(
            document.getElementById("marksObtained").value
        );


    const maxMarks =
        Number(
            document.getElementById("resultMaxMarks").value
        );


    if (marks > maxMarks) {

        alert(
            "Marks obtained cannot exceed maximum marks."
        );

        return;
    }


    const newResult = {

        id: Date.now(),

        studentName,

        studentId,

        exam,

        subject,

        marks,

        maxMarks

    };


    studentResults.push(newResult);


    saveExamData();

    displayResults();

    updateExamSummary();


    document
        .getElementById("resultForm")
        .reset();


    alert("Student result added successfully!");

}


/* =========================
   DELETE RESULT
========================= */

function deleteResult(id) {
try { if (!requireDeleteAdmin()) return; } catch (e) { return; }

    if (
        !confirm(
            "Are you sure you want to delete this result?"
        )
    ) {
        return;
    }


    studentResults =
        studentResults.filter(
            result => result.id !== id
        );


    saveExamData();

    displayResults();

    updateExamSummary();

}


/* =========================
   SEARCH RESULTS
========================= */

function searchResults() {

    const searchText =
        document
            .getElementById("resultSearch")
            .value
            .toLowerCase();


    const selectedStatus =
        document
            .getElementById("resultStatusFilter")
            .value;


    const filtered =
        studentResults.filter(result => {

            const percentage =
                (result.marks / result.maxMarks) * 100;


            const status =
                getResultStatus(percentage);


            const matchesSearch =

                result.studentName
                    .toLowerCase()
                    .includes(searchText)

                ||

                result.studentId
                    .toLowerCase()
                    .includes(searchText)

                ||

                result.subject
                    .toLowerCase()
                    .includes(searchText)

                ||

                result.exam
                    .toLowerCase()
                    .includes(searchText);


            const matchesStatus =

                selectedStatus === ""

                ||

                status === selectedStatus;


            return (
                matchesSearch &&
                matchesStatus
            );

        });


    displayResults(filtered);

}


/* =========================
   UPDATE SUMMARY
========================= */

function updateExamSummary() {

    const totalExams =
        document.getElementById("totalExams");

    const totalResults =
        document.getElementById("totalResults");

    const totalPassed =
        document.getElementById("totalPassed");

    const totalFailed =
        document.getElementById("totalFailed");


    if (!totalExams) return;


    let passed = 0;

    let failed = 0;


    studentResults.forEach(result => {

        const percentage =
            (result.marks / result.maxMarks) * 100;


        if (
            getResultStatus(percentage) === "Pass"
        ) {
            passed++;
        }
        else {
            failed++;
        }

    });


    totalExams.textContent =
        examinations.length;


    totalResults.textContent =
        studentResults.length;


    totalPassed.textContent =
        passed;


    totalFailed.textContent =
        failed;

}


/* =========================
   INITIALIZE
========================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const examForm =
            document.getElementById("examForm");


        const resultForm =
            document.getElementById("resultForm");


        if (examForm) {

            examForm.addEventListener(
                "submit",
                addExamination
            );

            displayExaminations();

        }


        if (resultForm) {

            resultForm.addEventListener(
                "submit",
                addResult
            );

            displayResults();

        }

    }
);

/* =========================
   LIBRARY MANAGEMENT
========================= */


/* =========================
   BOOK DATA
========================= */

let libraryBooks =
    JSON.parse(
        localStorage.getItem("campusLibraryBooks")
    ) || [

        {
            id: "BK001",
            title: "Data Structures and Algorithms",
            author: "Narasimha Karumanchi",
            isbn: "9788193245279",
            category: "Computer Science",
            quantity: 5,
            available: 4
        },

        {
            id: "BK002",
            title: "Database System Concepts",
            author: "Abraham Silberschatz",
            isbn: "9780078022159",
            category: "Database",
            quantity: 4,
            available: 4
        },

        {
            id: "BK003",
            title: "Engineering Mechanics",
            author: "R.K. Bansal",
            isbn: "9788131808296",
            category: "Engineering",
            quantity: 6,
            available: 6
        }

    ];


/* =========================
   ISSUE DATA
========================= */

let issuedBooks =
    JSON.parse(
        localStorage.getItem("campusIssuedBooks")
    ) || [

        {
            id: 1,
            bookId: "BK001",
            bookTitle: "Data Structures and Algorithms",
            studentName: "Rahul Kumar",
            studentId: "STU001",
            issueDate: "2026-09-25",
            dueDate: "2026-10-09",
            returned: false
        }

    ];


/* =========================
   SAVE LIBRARY DATA
========================= */

function saveLibraryData() {

    localStorage.setItem(
        "campusLibraryBooks",
        JSON.stringify(libraryBooks)
    );

    localStorage.setItem(
        "campusIssuedBooks",
        JSON.stringify(issuedBooks)
    );

}


/* =========================
   DATE DIFFERENCE
========================= */

function getDaysOverdue(dueDate) {

    const today =
        new Date();

    const due =
        new Date(dueDate);


    today.setHours(0, 0, 0, 0);

    due.setHours(0, 0, 0, 0);


    const difference =
        today - due;


    return Math.max(
        0,
        Math.floor(
            difference /
            (1000 * 60 * 60 * 24)
        )
    );

}


/* =========================
   CALCULATE FINE
========================= */

function calculateFine(record) {

    const overdueDays =
        getDaysOverdue(record.dueDate);


    const finePerDay = 5;


    return overdueDays * finePerDay;

}


/* =========================
   GET STATUS
========================= */

function getLibraryStatus(record) {

    if (record.returned) {
        return "Returned";
    }


    if (
        getDaysOverdue(record.dueDate) > 0
    ) {
        return "Overdue";
    }


    return "Issued";

}


/* =========================
   DISPLAY BOOKS
========================= */

function displayBooks(data = libraryBooks) {

    const tableBody =
        document.getElementById("bookTableBody");

    if (!tableBody) return;

    tableBody.innerHTML = "";


    if (data.length === 0) {

        tableBody.innerHTML = `
            <tr>
                <td colspan="8" style="text-align:center;">
                    No books found.
                </td>
            </tr>
        `;

        return;
    }


    data.forEach(book => {

        tableBody.innerHTML += `

            <tr>

                <td>${book.id}</td>

                <td>${book.title}</td>

                <td>${book.author}</td>

                <td>${book.isbn}</td>

                <td>${book.category}</td>

                <td>${book.quantity}</td>

                <td class="library-available">
                    ${book.available}
                </td>

                <td>${canDeleteEntries() ? `

                    <button
                        class="delete-btn"
                        onclick="deleteBook('${book.id}')">

                        Delete

                    </button>` : "-"}

                </td>

            </tr>

        `;

    });

}


/* =========================
   ADD BOOK
========================= */

function addBook(event) {

    event.preventDefault();

    if (!confirm("Are you sure you want to add this book?")) {
        return;
    }


    const title =
        document.getElementById("bookTitle")
            .value.trim();


    const author =
        document.getElementById("bookAuthor")
            .value.trim();


    const isbn =
        document.getElementById("bookIsbn")
            .value.trim();


    const category =
        document.getElementById("bookCategory")
            .value.trim();


    const quantity =
        Number(
            document.getElementById("bookQuantity")
                .value
        );


    const newBook = {

        id:
            "BK" +
            String(
                libraryBooks.length + 1
            ).padStart(3, "0"),

        title,

        author,

        isbn,

        category,

        quantity,

        available: quantity

    };


    libraryBooks.push(newBook);


    saveLibraryData();

    displayBooks();

    updateLibrarySummary();


    document
        .getElementById("bookForm")
        .reset();


    alert("Book added successfully!");

}


/* =========================
   DELETE BOOK
========================= */

function deleteBook(id) {
try { if (!requireDeleteAdmin()) return; } catch (e) { return; }

    const book =
        libraryBooks.find(
            item => item.id === id
        );


    if (!book) return;


    if (book.available !== book.quantity) {

        alert(
            "This book cannot be deleted while copies are issued."
        );

        return;
    }


    if (
        !confirm(
            "Are you sure you want to delete this book?"
        )
    ) {
        return;
    }


    libraryBooks =
        libraryBooks.filter(
            item => item.id !== id
        );


    saveLibraryData();

    displayBooks();

    updateLibrarySummary();

}


/* =========================
   ISSUE BOOK
========================= */

function issueBook(event) {

    event.preventDefault();

    if (!confirm("Are you sure you want to issue this book?")) {
        return;
    }


    const bookId =
        document
            .getElementById("issueBookId")
            .value
            .trim();


    const studentName =
        document
            .getElementById("issueStudentName")
            .value
            .trim();


    const studentId =
        document
            .getElementById("issueStudentId")
            .value
            .trim();


    const issueDate =
        document
            .getElementById("issueDate")
            .value;


    const dueDate =
        document
            .getElementById("returnDate")
            .value;


    const book =
        libraryBooks.find(
            item => item.id === bookId
        );


    if (!book) {

        alert(
            "Book ID not found."
        );

        return;
    }


    if (book.available <= 0) {

        alert(
            "No copies of this book are currently available."
        );

        return;
    }


    if (dueDate <= issueDate) {

        alert(
            "Due date must be after issue date."
        );

        return;
    }


    const newIssue = {

        id: Date.now(),

        bookId,

        bookTitle:
            book.title,

        studentName,

        studentId,

        issueDate,

        dueDate,

        returned: false

    };


    issuedBooks.push(newIssue);


    book.available--;


    saveLibraryData();


    displayBooks();

    displayIssuedBooks();

    updateLibrarySummary();


    document
        .getElementById("issueForm")
        .reset();


    alert(
        "Book issued successfully!"
    );

}


/* =========================
   DISPLAY ISSUED BOOKS
========================= */

function displayIssuedBooks(
    data = issuedBooks
) {

    const tableBody =
        document.getElementById("issueTableBody");

    if (!tableBody) return;

    tableBody.innerHTML = "";


    if (data.length === 0) {

        tableBody.innerHTML = `
            <tr>
                <td colspan="8" style="text-align:center;">
                    No issue records found.
                </td>
            </tr>
        `;

        return;
    }


    data.forEach(record => {

        const status =
            getLibraryStatus(record);


        const fine =
            record.returned
                ? 0
                : calculateFine(record);


        let statusClass = "";


        if (status === "Issued") {

            statusClass =
                "library-issued";

        }
        else if (status === "Overdue") {

            statusClass =
                "library-overdue";

        }


        let actionButton = "";


        if (!record.returned) {

            actionButton = `

                <button
                    class="return-btn"
                    onclick="returnBook(${record.id})">

                    Return

                </button>

            `;

        }
        else {

            actionButton = "Returned";

        }


        tableBody.innerHTML += `

            <tr>

                <td>
                    ${record.bookTitle}
                </td>

                <td>
                    ${record.studentName}
                </td>

                <td>
                    ${record.studentId}
                </td>

                <td>
                    ${record.issueDate}
                </td>

                <td>
                    ${record.dueDate}
                </td>

                <td class="${statusClass}">
                    ${status}
                </td>

                <td>
                    ₹${fine}
                </td>

                <td>
                    ${actionButton}
                </td>

            </tr>

        `;

    });

}


/* =========================
   RETURN BOOK
========================= */

function returnBook(id) {

    const record =
        issuedBooks.find(
            item => item.id === id
        );


    if (!record || record.returned) {
        return;
    }


    const book =
        libraryBooks.find(
            item => item.id === record.bookId
        );


    record.returned = true;


    if (book) {
        book.available++;
    }


    const fine =
        calculateFine(record);


    saveLibraryData();


    displayBooks();

    displayIssuedBooks();

    updateLibrarySummary();


    if (fine > 0) {

        alert(
            "Book returned successfully.\n" +
            "Late fine: ₹" + fine
        );

    }
    else {

        alert(
            "Book returned successfully!"
        );

    }

}


/* =========================
   SEARCH LIBRARY
========================= */

function searchLibrary() {

    const searchText =
        document
            .getElementById("librarySearch")
            .value
            .toLowerCase();


    const selectedFilter =
        document
            .getElementById("libraryFilter")
            .value;


    const filteredBooks =
        libraryBooks.filter(book => {

            const matchesSearch =

                book.title
                    .toLowerCase()
                    .includes(searchText)

                ||

                book.author
                    .toLowerCase()
                    .includes(searchText)

                ||

                book.isbn
                    .toLowerCase()
                    .includes(searchText);


            let matchesFilter = true;


            if (
                selectedFilter === "Available"
            ) {

                matchesFilter =
                    book.available > 0;

            }


            if (
                selectedFilter === "Issued"
            ) {

                matchesFilter =
                    book.available <
                    book.quantity;

            }


            if (
                selectedFilter === "Overdue"
            ) {

                matchesFilter =
                    issuedBooks.some(
                        record =>
                            record.bookId === book.id &&
                            !record.returned &&
                            getDaysOverdue(
                                record.dueDate
                            ) > 0
                    );

            }


            return (
                matchesSearch &&
                matchesFilter
            );

        });


    displayBooks(filteredBooks);


    const filteredIssues =
        issuedBooks.filter(record => {

            const matchesSearch =

                record.bookTitle
                    .toLowerCase()
                    .includes(searchText)

                ||

                record.studentName
                    .toLowerCase()
                    .includes(searchText)

                ||

                record.studentId
                    .toLowerCase()
                    .includes(searchText);


            let matchesFilter = true;


            if (
                selectedFilter === "Issued"
            ) {

                matchesFilter =
                    !record.returned;

            }


            if (
                selectedFilter === "Overdue"
            ) {

                matchesFilter =
                    !record.returned &&
                    getDaysOverdue(
                        record.dueDate
                    ) > 0;

            }


            return (
                matchesSearch &&
                matchesFilter
            );

        });


    displayIssuedBooks(filteredIssues);

}


/* =========================
   LIBRARY SUMMARY
========================= */

function updateLibrarySummary() {

    const totalBooks =
        document.getElementById("totalBooks");

    const availableBooks =
        document.getElementById("availableBooks");

    const issuedBooksElement =
        document.getElementById("issuedBooks");

    const overdueBooks =
        document.getElementById("overdueBooks");


    if (!totalBooks) return;


    const totalCopies =
        libraryBooks.reduce(
            (sum, book) =>
                sum + book.quantity,
            0
        );


    const availableCopies =
        libraryBooks.reduce(
            (sum, book) =>
                sum + book.available,
            0
        );


    const activeIssues =
        issuedBooks.filter(
            record =>
                !record.returned
        ).length;


    const overdue =
        issuedBooks.filter(
            record =>
                !record.returned &&
                getDaysOverdue(
                    record.dueDate
                ) > 0
        ).length;


    totalBooks.textContent =
        totalCopies;


    availableBooks.textContent =
        availableCopies;


    issuedBooksElement.textContent =
        activeIssues;


    overdueBooks.textContent =
        overdue;

}


/* =========================
   INITIALIZE LIBRARY
========================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const bookForm =
            document.getElementById("bookForm");


        const issueForm =
            document.getElementById("issueForm");


        if (bookForm) {

            bookForm.addEventListener(
                "submit",
                addBook
            );

            displayBooks();

        }


        if (issueForm) {

            issueForm.addEventListener(
                "submit",
                issueBook
            );

            displayIssuedBooks();

        }


        if (
            document.getElementById("totalBooks")
        ) {

            updateLibrarySummary();

        }

    }
);

/* =========================
   HOSTEL MANAGEMENT
========================= */


/* =========================
   HOSTEL ROOM DATA
========================= */

let hostelRooms =
    JSON.parse(
        localStorage.getItem("campusHostelRooms")
    ) || [

        {
            id: "ROOM001",
            block: "Block A",
            room: "101",
            type: "Double",
            capacity: 2
        },

        {
            id: "ROOM002",
            block: "Block A",
            room: "102",
            type: "Triple",
            capacity: 3
        },

        {
            id: "ROOM003",
            block: "Block B",
            room: "201",
            type: "Double",
            capacity: 2
        },

        {
            id: "ROOM004",
            block: "Block B",
            room: "202",
            type: "Four Bed",
            capacity: 4
        }

    ];


/* =========================
   HOSTEL ALLOCATIONS
========================= */

let hostelAllocations =
    JSON.parse(
        localStorage.getItem("campusHostelAllocations")
    ) || [

        {
            id: 1,
            roomId: "ROOM001",
            studentName: "Rahul Kumar",
            studentId: "STU001",
            department: "Computer Science",
            allocationDate: "2026-09-20"
        },

        {
            id: 2,
            roomId: "ROOM001",
            studentName: "Aman Das",
            studentId: "STU003",
            department: "Mechanical Engineering",
            allocationDate: "2026-09-21"
        }

    ];


/* =========================
   SAVE HOSTEL DATA
========================= */

function saveHostelData() {

    localStorage.setItem(
        "campusHostelRooms",
        JSON.stringify(hostelRooms)
    );

    localStorage.setItem(
        "campusHostelAllocations",
        JSON.stringify(hostelAllocations)
    );

}


/* =========================
   GET OCCUPIED BEDS
========================= */

function getOccupiedBeds(roomId) {

    return hostelAllocations.filter(
        allocation =>
            allocation.roomId === roomId
    ).length;

}


/* =========================
   DISPLAY ROOMS
========================= */

function displayHostelRooms(
    data = hostelRooms
) {

    const tableBody =
        document.getElementById("roomTableBody");

    if (!tableBody) return;

    tableBody.innerHTML = "";


    if (data.length === 0) {

        tableBody.innerHTML = `
            <tr>
                <td colspan="9" style="text-align:center;">
                    No hostel rooms found.
                </td>
            </tr>
        `;

        return;
    }


    data.forEach(room => {

        const occupied =
            getOccupiedBeds(room.id);


        const available =
            Math.max(
                room.capacity - occupied,
                0
            );


        let status =
            "Available";


        let statusClass =
            "hostel-available";


        if (available === 0) {

            status = "Full";

            statusClass =
                "hostel-full";

        }
        else if (occupied > 0) {

            status = "Occupied";

            statusClass =
                "hostel-occupied";

        }


        tableBody.innerHTML += `

            <tr>

                <td>${room.id}</td>

                <td>${room.block}</td>

                <td>${room.room}</td>

                <td>${room.type}</td>

                <td>${room.capacity}</td>

                <td>${occupied}</td>

                <td class="${statusClass}">
                    ${available}
                </td>

                <td class="${statusClass}">
                    ${status}
                </td>

                <td>${canDeleteEntries() ? `

                    <button
                        class="delete-btn"
                        onclick="deleteHostelRoom('${room.id}')">

                        Delete

                    </button>` : "-"}

                </td>

            </tr>

        `;

    });

}


/* =========================
   ADD ROOM
========================= */

function addHostelRoom(event) {

    event.preventDefault();


    const block =
        document
            .getElementById("hostelBlock")
            .value
            .trim();


    const room =
        document
            .getElementById("roomNumber")
            .value
            .trim();


    const type =
        document
            .getElementById("roomType")
            .value;


    const capacity =
        Number(
            document
                .getElementById("roomCapacity")
                .value
        );


    const duplicate =
        hostelRooms.some(
            item =>
                item.block.toLowerCase() ===
                    block.toLowerCase() &&
                item.room === room
        );


    if (duplicate) {

        alert(
            "This room already exists."
        );

        return;
    }


    const newRoom = {

        id:
            "ROOM" +
            String(
                hostelRooms.length + 1
            ).padStart(3, "0"),

        block,

        room,

        type,

        capacity

    };


    if (!confirm("Add this hostel room?")) {
        return;
    }


    hostelRooms.push(newRoom);


    saveHostelData();

    displayHostelRooms();

    updateHostelSummary();


    document
        .getElementById("roomForm")
        .reset();


    alert(
        "Hostel room added successfully!"
    );

}


/* =========================
   DELETE ROOM
========================= */

function deleteHostelRoom(id) {
try { if (!requireDeleteAdmin()) return; } catch (e) { return; }

    const occupied =
        getOccupiedBeds(id);


    if (occupied > 0) {

        alert(
            "This room cannot be deleted because students are allocated to it."
        );

        return;
    }


    if (
        !confirm(
            "Are you sure you want to delete this room?"
        )
    ) {
        return;
    }


    hostelRooms =
        hostelRooms.filter(
            room => room.id !== id
        );


    saveHostelData();

    displayHostelRooms();

    updateHostelSummary();

}


/* =========================
   ALLOCATE STUDENT
========================= */

function allocateStudent(event) {

    event.preventDefault();


    const roomId =
        document
            .getElementById("allocationRoom")
            .value
            .trim();


    const studentName =
        document
            .getElementById("hostelStudentName")
            .value
            .trim();


    const studentId =
        document
            .getElementById("hostelStudentId")
            .value
            .trim();


    const department =
        document
            .getElementById("hostelDepartment")
            .value
            .trim();


    const allocationDate =
        document
            .getElementById("allocationDate")
            .value;


    const room =
        hostelRooms.find(
            item => item.id === roomId
        );


    if (!room) {

        alert(
            "Room ID not found."
        );

        return;
    }


    const occupied =
        getOccupiedBeds(roomId);


    if (occupied >= room.capacity) {

        alert(
            "This room is already full."
        );

        return;
    }


    const alreadyAllocated =
        hostelAllocations.some(
            allocation =>
                allocation.studentId ===
                studentId
        );


    if (alreadyAllocated) {

        alert(
            "This student is already allocated to a hostel room."
        );

        return;
    }


    const newAllocation = {

        id: Date.now(),

        roomId,

        studentName,

        studentId,

        department,

        allocationDate

    };


    if (!confirm("Allocate this student to the hostel room?")) {
        return;
    }


    hostelAllocations.push(
        newAllocation
    );


    saveHostelData();


    displayHostelRooms();

    displayAllocations();

    updateHostelSummary();


    document
        .getElementById("allocationForm")
        .reset();


    alert(
        "Student allocated successfully!"
    );

}


/* =========================
   DISPLAY ALLOCATIONS
========================= */

function displayAllocations(
    data = hostelAllocations
) {

    const tableBody =
        document.getElementById(
            "allocationTableBody"
        );

    if (!tableBody) return;

    tableBody.innerHTML = "";


    if (data.length === 0) {

        tableBody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align:center;">
                    No student allocations found.
                </td>
            </tr>
        `;

        return;
    }


    data.forEach(allocation => {

        const room =
            hostelRooms.find(
                item =>
                    item.id ===
                    allocation.roomId
            );


        const roomNumber =
            room
                ? room.room
                : "Unknown";


        const block =
            room
                ? room.block
                : "Unknown";


        tableBody.innerHTML += `

            <tr>

                <td>
                    ${allocation.studentName}
                </td>

                <td>
                    ${allocation.studentId}
                </td>

                <td>
                    ${allocation.department}
                </td>

                <td>
                    ${roomNumber}
                </td>

                <td>
                    ${block}
                </td>

                <td>
                    ${allocation.allocationDate}
                </td>

                <td>${canDeleteEntries() ? `

                    <button
                        class="return-btn"
                        onclick="checkoutStudent(${allocation.id})">

                        Checkout

                    </button>` : "-"}

                </td>

            </tr>

        `;

    });

}


/* =========================
   CHECKOUT STUDENT
========================= */

function checkoutStudent(id) {
try { if (!requireDeleteAdmin()) return; } catch (e) { return; }

    const allocation =
        hostelAllocations.find(
            item => item.id === id
        );


    if (!allocation) return;


    if (
        !confirm(
            `Checkout ${allocation.studentName} from the hostel?`
        )
    ) {
        return;
    }


    hostelAllocations =
        hostelAllocations.filter(
            item => item.id !== id
        );


    saveHostelData();


    displayHostelRooms();

    displayAllocations();

    updateHostelSummary();


    alert(
        "Student checked out successfully."
    );

}


/* =========================
   SEARCH HOSTEL
========================= */

function searchHostel() {

    const searchText =
        document
            .getElementById("hostelSearch")
            .value
            .toLowerCase();


    const selectedFilter =
        document
            .getElementById("hostelFilter")
            .value;


    const filteredRooms =
        hostelRooms.filter(room => {

            const occupied =
                getOccupiedBeds(room.id);


            const available =
                room.capacity -
                occupied;


            const matchesSearch =

                room.id
                    .toLowerCase()
                    .includes(searchText)

                ||

                room.block
                    .toLowerCase()
                    .includes(searchText)

                ||

                room.room
                    .toLowerCase()
                    .includes(searchText);


            let matchesFilter = true;


            if (
                selectedFilter === "Available"
            ) {

                matchesFilter =
                    available > 0;

            }


            if (
                selectedFilter === "Full"
            ) {

                matchesFilter =
                    available === 0;

            }


            return (
                matchesSearch &&
                matchesFilter
            );

        });


    displayHostelRooms(
        filteredRooms
    );


    const filteredAllocations =
        hostelAllocations.filter(
            allocation => {

                return (

                    allocation.studentName
                        .toLowerCase()
                        .includes(searchText)

                    ||

                    allocation.studentId
                        .toLowerCase()
                        .includes(searchText)

                    ||

                    allocation.department
                        .toLowerCase()
                        .includes(searchText)

                );

            }
        );


    displayAllocations(
        filteredAllocations
    );

}


/* =========================
   HOSTEL SUMMARY
========================= */

function updateHostelSummary() {

    const totalRooms =
        document.getElementById(
            "totalRooms"
        );


    const totalCapacity =
        document.getElementById(
            "totalCapacity"
        );


    const occupiedBeds =
        document.getElementById(
            "occupiedBeds"
        );


    const availableBeds =
        document.getElementById(
            "availableBeds"
        );


    if (!totalRooms) return;


    const capacity =
        hostelRooms.reduce(
            (sum, room) =>
                sum + room.capacity,
            0
        );


    const occupied =
        hostelAllocations.length;


    const available =
        Math.max(
            capacity - occupied,
            0
        );


    totalRooms.textContent =
        hostelRooms.length;


    totalCapacity.textContent =
        capacity;


    occupiedBeds.textContent =
        occupied;


    availableBeds.textContent =
        available;

}


/* =========================
   INITIALIZE HOSTEL
========================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const roomForm =
            document.getElementById(
                "roomForm"
            );


        const allocationForm =
            document.getElementById(
                "allocationForm"
            );


        if (roomForm) {

            roomForm.addEventListener(
                "submit",
                addHostelRoom
            );

            displayHostelRooms();

        }


        if (allocationForm) {

            allocationForm.addEventListener(
                "submit",
                allocateStudent
            );

            displayAllocations();

        }


        if (
            document.getElementById(
                "totalRooms"
            )
        ) {

            updateHostelSummary();

        }

    }
);

/* =========================================
   TRANSPORT MANAGEMENT
========================================= */

let transportBuses =
    JSON.parse(
        localStorage.getItem("campusTransportBuses")
    ) || [

        {
            id: "BUS001",
            number: "Bus 01",
            registration: "OD02AB1234",
            route: "Route A",
            capacity: 50,
            driver: "Ramesh Kumar",
            phone: "9876543210"
        },

        {
            id: "BUS002",
            number: "Bus 02",
            registration: "OD02CD5678",
            route: "Route B",
            capacity: 40,
            driver: "Suresh Das",
            phone: "9876543211"
        },

        {
            id: "BUS003",
            number: "Bus 03",
            registration: "OD02EF9012",
            route: "Route C",
            capacity: 45,
            driver: "Amit Singh",
            phone: "9876543212"
        }

    ];


let transportRoutes =
    JSON.parse(
        localStorage.getItem("campusTransportRoutes")
    ) || [

        {
            id: "ROUTE001",
            name: "Route A",
            start: "Main Gate",
            stops: "City Center, Market, College Road",
            end: "Campus"
        },

        {
            id: "ROUTE002",
            name: "Route B",
            start: "Railway Station",
            stops: "Bus Stand, University Road",
            end: "Campus"
        },

        {
            id: "ROUTE003",
            name: "Route C",
            start: "Airport Road",
            stops: "Mall, Hospital, Central Park",
            end: "Campus"
        }

    ];


let transportAllocations =
    JSON.parse(
        localStorage.getItem(
            "campusTransportAllocations"
        )
    ) || [

        {
            studentName: "Rahul Kumar",
            studentId: "STU001",
            department: "Computer Science",
            busId: "BUS001",
            pickup: "City Center"
        },

        {
            studentName: "Priya Sharma",
            studentId: "STU002",
            department: "Information Technology",
            busId: "BUS002",
            pickup: "Railway Station"
        },

        {
            studentName: "Aman Das",
            studentId: "STU003",
            department: "Mechanical Engineering",
            busId: "BUS001",
            pickup: "Market"
        }

    ];


/* =========================================
   SAVE DATA
========================================= */

function saveTransportData() {

    localStorage.setItem(
        "campusTransportBuses",
        JSON.stringify(transportBuses)
    );

    localStorage.setItem(
        "campusTransportRoutes",
        JSON.stringify(transportRoutes)
    );

    localStorage.setItem(
        "campusTransportAllocations",
        JSON.stringify(
            transportAllocations
        )
    );

}


/* =========================================
   GET BUS OCCUPANCY
========================================= */

function getBusOccupiedSeats(busId) {

    return transportAllocations.filter(
        allocation =>
            allocation.busId === busId
    ).length;

}


/* =========================================
   DISPLAY BUSES
========================================= */

function displayTransportBuses() {

    const table =
        document.getElementById(
            "busTableBody"
        );

    if (!table) return;

    table.innerHTML = "";


    transportBuses.forEach(bus => {

        const occupied =
            getBusOccupiedSeats(bus.id);

        const available =
            Math.max(
                Number(bus.capacity) -
                occupied,
                0
            );


        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>${bus.id}</td>

            <td>${bus.number}</td>

            <td>${bus.registration}</td>

            <td>${bus.route}</td>

            <td>${bus.capacity}</td>

            <td>${occupied}</td>

            <td>${available}</td>

            <td>${bus.driver}</td>

            <td>${bus.phone}</td>

            <td>${canDeleteEntries() ? `

                <button
                    class="delete-btn"
                    onclick="deleteTransportBus('${bus.id}')">

                    Delete

                </button>` : "-"}

            </td>

        `;


        table.appendChild(row);

    });

}


/* =========================================
   ADD BUS
========================================= */


/* =========================================
   ADD BUS
========================================= */

function addBus(event) {

    event.preventDefault();


    const busNumber =
        document.getElementById(
            "busNumber"
        ).value.trim();


    const registration =
        document.getElementById(
            "registrationNumber"
        ).value.trim();


    const route =
        document.getElementById(
            "routeName"
        ).value.trim();


    const capacity =
        parseInt(
            document.getElementById(
                "busCapacity"
            ).value
        );


    const driver =
        document.getElementById(
            "driverName"
        ).value.trim();


    const phone =
        document.getElementById(
            "driverPhone"
        ).value.trim();


    const numbers =
        transportBuses.map(bus => {

            return (
                parseInt(
                    bus.id.replace(
                        "BUS",
                        ""
                    )
                ) || 0
            );

        });


    const nextNumber =
        numbers.length > 0
            ? Math.max(...numbers) + 1
            : 1;


    const newBus = {

        id:
            "BUS" +
            String(nextNumber)
                .padStart(3, "0"),

        number: busNumber,

        registration: registration,

        route: route,

        capacity: capacity,

        driver: driver,

        phone: phone

    };


    if (!confirm("Add this bus?")) {
        return;
    }


    transportBuses.push(newBus);


    saveTransportData();

    displayTransportBuses();

    loadTransportBusOptions();

    updateTransportSummary();


    event.target.reset();


    alert(
        "Bus added successfully."
    );

}


/* =========================================
   DELETE BUS
========================================= */

function deleteTransportBus(id) {
try { if (!requireDeleteAdmin()) return; } catch (e) { return; }

    const occupied =
        getBusOccupiedSeats(id);


    if (occupied > 0) {

        alert(
            "This bus has students allocated to it. " +
            "Remove those allocations first."
        );

        return;

    }


    if (
        !confirm(
            "Delete this bus?"
        )
    ) {

        return;

    }


    transportBuses =
        transportBuses.filter(
            bus =>
                bus.id !== id
        );


    saveTransportData();

    displayTransportBuses();

    loadTransportBusOptions();

    updateTransportSummary();

}


/* =========================================
   DISPLAY ROUTES
========================================= */

function displayTransportRoutes() {

    const table =
        document.getElementById(
            "routeTableBody"
        );


    if (!table) return;


    table.innerHTML = "";


    transportRoutes.forEach(route => {

        const row =
            document.createElement("tr");


        row.innerHTML = `

            <td>${route.id}</td>

            <td>${route.name}</td>

            <td>${route.start}</td>

            <td>${route.stops}</td>

            <td>${route.end}</td>

            <td>${canDeleteEntries() ? `

                <button
                    class="delete-btn"
                    onclick="deleteTransportRoute('${route.id}')">

                    Delete

                </button>` : "-"}

            </td>

        `;


        table.appendChild(row);

    });

}


/* =========================================
   ADD ROUTE
========================================= */

function addRoute(event) {

    event.preventDefault();


    const name =
        document.getElementById(
            "newRouteName"
        ).value.trim();


    const start =
        document.getElementById(
            "routeStart"
        ).value.trim();


    const stops =
        document.getElementById(
            "routeStops"
        ).value.trim();


    const end =
        document.getElementById(
            "routeEnd"
        ).value.trim();


    const numbers =
        transportRoutes.map(route => {

            return (
                parseInt(
                    route.id.replace(
                        "ROUTE",
                        ""
                    )
                ) || 0
            );

        });


    const nextNumber =
        numbers.length > 0
            ? Math.max(...numbers) + 1
            : 1;


    if (!confirm("Add this route?")) {
        return;
    }


    transportRoutes.push({

        id:
            "ROUTE" +
            String(nextNumber)
                .padStart(3, "0"),

        name: name,

        start: start,

        stops: stops,

        end: end

    });


    saveTransportData();

    displayTransportRoutes();


    event.target.reset();


    alert(
        "Route added successfully."
    );

}


/* =========================================
   DELETE ROUTE
========================================= */

function deleteTransportRoute(id) {
try { if (!requireDeleteAdmin()) return; } catch (e) { return; }

    const route =
        transportRoutes.find(
            route =>
                route.id === id
        );


    if (!route) return;


    const used =
        transportBuses.some(
            bus =>
                bus.route ===
                route.name
        );


    if (used) {

        alert(
            "This route is assigned to a bus. " +
            "Change the bus route before deleting."
        );

        return;

    }


    if (
        !confirm(
            "Delete this route?"
        )
    ) {

        return;

    }


    transportRoutes =
        transportRoutes.filter(
            route =>
                route.id !== id
        );


    saveTransportData();

    displayTransportRoutes();

}


/* =========================================
   LOAD BUS OPTIONS
========================================= */

function loadTransportBusOptions() {

    const select =
        document.getElementById(
            "transportBusId"
        );


    if (!select) return;


    select.innerHTML =
        `<option value="">
            Select Bus
        </option>`;


    transportBuses.forEach(bus => {

        const occupied =
            getBusOccupiedSeats(
                bus.id
            );


        const available =
            Number(bus.capacity) -
            occupied;


        const option =
            document.createElement(
                "option"
            );


        option.value =
            bus.id;


        option.textContent =
            `${bus.number} - ${bus.route} ` +
            `(${available} seats available)`;


        if (available <= 0) {

            option.disabled = true;

        }


        select.appendChild(option);

    });

}


/* =========================================
   ALLOCATE STUDENT
========================================= */

function allocateTransport(event) {

    event.preventDefault();


    const studentName =
        document.getElementById(
            "transportStudentName"
        ).value.trim();


    const studentId =
        document.getElementById(
            "transportStudentId"
        ).value.trim();


    const department =
        document.getElementById(
            "transportDepartment"
        ).value.trim();


    const busId =
        document.getElementById(
            "transportBusId"
        ).value;


    const pickup =
        document.getElementById(
            "pickupPoint"
        ).value.trim();


    if (!busId) {

        alert(
            "Please select a bus."
        );

        return;

    }


    const bus =
        transportBuses.find(
            bus =>
                bus.id === busId
        );


    if (!bus) {

        alert(
            "Bus not found."
        );

        return;

    }


    const alreadyAllocated =
        transportAllocations.some(
            allocation =>
                allocation.studentId ===
                studentId
        );


    if (alreadyAllocated) {

        alert(
            "This student is already allocated to a bus."
        );

        return;

    }


    const occupied =
        getBusOccupiedSeats(
            busId
        );


    if (
        occupied >=
        Number(bus.capacity)
    ) {

        alert(
            "This bus is full."
        );

        return;

    }


    if (!confirm("Allocate this student to the bus?")) {
        return;
    }


    transportAllocations.push({

        studentName:
            studentName,

        studentId:
            studentId,

        department:
            department,

        busId:
            busId,

        pickup:
            pickup

    });


    saveTransportData();

    displayTransportAllocations();

    displayTransportBuses();

    loadTransportBusOptions();

    updateTransportSummary();


    event.target.reset();


    alert(
        "Student allocated successfully."
    );

}


/* =========================================
   DISPLAY ALLOCATIONS
========================================= */

function displayTransportAllocations() {

    const table =
        document.getElementById(
            "transportAllocationBody"
        );


    if (!table) return;


    table.innerHTML = "";


    transportAllocations.forEach(
        (allocation, index) => {

            const bus =
                transportBuses.find(
                    bus =>
                        bus.id ===
                        allocation.busId
                );


            const row =
                document.createElement(
                    "tr"
                );


            row.innerHTML = `

                <td>
                    ${allocation.studentName}
                </td>

                <td>
                    ${allocation.studentId}
                </td>

                <td>
                    ${allocation.department}
                </td>

                <td>
                    ${
                        bus
                            ? bus.number
                            : allocation.busId
                    }
                </td>

                <td>
                    ${allocation.pickup}
                </td>

                <td>${canDeleteEntries() ? `

                    <button
                        class="delete-btn"
                        onclick="removeTransportAllocation(${index})">

                        Remove

                    </button>` : "-"}

                </td>

            `;


            table.appendChild(row);

        }
    );

}


/* =========================================
   REMOVE ALLOCATION
========================================= */

function removeTransportAllocation(index) {
try { if (!requireDeleteAdmin()) return; } catch (e) { return; }

    if (
        !confirm(
            "Remove this transport allocation?"
        )
    ) {

        return;

    }


    transportAllocations.splice(
        index,
        1
    );


    saveTransportData();

    displayTransportAllocations();

    displayTransportBuses();

    loadTransportBusOptions();

    updateTransportSummary();

}


/* =========================================
   SEARCH TRANSPORT
========================================= */

function searchTransport() {

    const searchInput =
        document.getElementById(
            "transportSearch"
        );


    const filter =
        document.getElementById(
            "transportFilter"
        );


    if (
        !searchInput ||
        !filter
    ) {

        return;

    }


    const search =
        searchInput.value
            .toLowerCase()
            .trim();


    const type =
        filter.value;


    /* BUSES */

    if (
        type === "all" ||
        type === "buses"
    ) {

        const table =
            document.getElementById(
                "busTableBody"
            );


        if (table) {

            table.innerHTML = "";


            transportBuses
                .filter(bus => {

                    const text =
                        (
                            bus.id + " " +
                            bus.number + " " +
                            bus.registration + " " +
                            bus.route + " " +
                            bus.driver
                        ).toLowerCase();


                    return text.includes(
                        search
                    );

                })
                .forEach(bus => {

                    const occupied =
                        getBusOccupiedSeats(
                            bus.id
                        );


                    const available =
                        Number(bus.capacity) -
                        occupied;


                    const row =
                        document.createElement(
                            "tr"
                        );


                    row.innerHTML = `

                        <td>${bus.id}</td>

                        <td>${bus.number}</td>

                        <td>${bus.registration}</td>

                        <td>${bus.route}</td>

                        <td>${bus.capacity}</td>

                        <td>${occupied}</td>

                        <td>${available}</td>

                        <td>${bus.driver}</td>

                        <td>${bus.phone}</td>

                        <td>${canDeleteEntries() ? `

                            <button
                                class="delete-btn"
                                onclick="deleteTransportBus('${bus.id}')">

                                Delete

                            </button>` : "-"}

                        </td>

                    `;


                    table.appendChild(row);

                });

        }

    }


    /* ROUTES */

    if (
        type === "all" ||
        type === "routes"
    ) {

        const table =
            document.getElementById(
                "routeTableBody"
            );


        if (table) {

            table.innerHTML = "";


            transportRoutes
                .filter(route => {

                    const text =
                        (
                            route.id + " " +
                            route.name + " " +
                            route.start + " " +
                            route.stops + " " +
                            route.end
                        ).toLowerCase();


                    return text.includes(
                        search
                    );

                })
                .forEach(route => {

                    const row =
                        document.createElement(
                            "tr"
                        );


                    row.innerHTML = `

                        <td>${route.id}</td>

                        <td>${route.name}</td>

                        <td>${route.start}</td>

                        <td>${route.stops}</td>

                        <td>${route.end}</td>

                        <td>${canDeleteEntries() ? `

                            <button
                                class="delete-btn"
                                onclick="deleteTransportRoute('${route.id}')">

                                Delete

                            </button>` : "-"}

                        </td>

                    `;


                    table.appendChild(row);

                });

        }

    }


    /* STUDENTS */

    if (
        type === "all" ||
        type === "students"
    ) {

        const table =
            document.getElementById(
                "transportAllocationBody"
            );


        if (table) {

            table.innerHTML = "";


            transportAllocations
                .filter(allocation => {

                    const bus =
                        transportBuses.find(
                            bus =>
                                bus.id ===
                                allocation.busId
                        );


                    const text =
                        (
                            allocation.studentName +
                            " " +
                            allocation.studentId +
                            " " +
                            allocation.department +
                            " " +
                            allocation.pickup +
                            " " +
                            (
                                bus
                                    ? bus.number
                                    : ""
                            )
                        ).toLowerCase();


                    return text.includes(
                        search
                    );

                })
                .forEach(allocation => {

                    const originalIndex =
                        transportAllocations.indexOf(
                            allocation
                        );


                    const bus =
                        transportBuses.find(
                            bus =>
                                bus.id ===
                                allocation.busId
                        );


                    const row =
                        document.createElement(
                            "tr"
                        );


                    row.innerHTML = `

                        <td>
                            ${allocation.studentName}
                        </td>

                        <td>
                            ${allocation.studentId}
                        </td>

                        <td>
                            ${allocation.department}
                        </td>

                        <td>
                            ${
                                bus
                                    ? bus.number
                                    : allocation.busId
                            }
                        </td>

                        <td>
                            ${allocation.pickup}
                        </td>

                        <td>${canDeleteEntries() ? `

                            <button
                                class="delete-btn"
                                onclick="removeTransportAllocation(${originalIndex})">

                                Remove

                            </button>` : "-"}

                        </td>

                    `;


                    table.appendChild(row);

                });

        }

    }

}


/* =========================================
   UPDATE SUMMARY
========================================= */

function updateTransportSummary() {

    // Guard: hostel.html reuses id="totalCapacity".
    // Without this, the transport init (which runs on
    // every page) overwrites the hostel capacity with
    // the bus fleet capacity (135). Only run here on
    // the transport page, using real transportBuses data.

    if (
        !document.getElementById("totalBuses") &&
        !document.getElementById("busTableBody")
    ) {
        return;
    }


    const totalBuses =
        transportBuses.length;


    const totalCapacity =
        transportBuses.reduce(
            (total, bus) =>
                total +
                Number(bus.capacity),
            0
        );


    const occupiedSeats =
        transportAllocations.length;


    const availableSeats =
        Math.max(
            totalCapacity -
            occupiedSeats,
            0
        );


    const totalBusesElement =
        document.getElementById(
            "totalBuses"
        );


    const totalCapacityElement =
        document.getElementById(
            "totalCapacity"
        );


    const occupiedSeatsElement =
        document.getElementById(
            "occupiedSeats"
        );


    const availableSeatsElement =
        document.getElementById(
            "availableSeats"
        );


    if (totalBusesElement) {

        totalBusesElement.textContent =
            totalBuses;

    }


    if (totalCapacityElement) {

        totalCapacityElement.textContent =
            totalCapacity;

    }


    if (occupiedSeatsElement) {

        occupiedSeatsElement.textContent =
            occupiedSeats;

    }


    if (availableSeatsElement) {

        availableSeatsElement.textContent =
            availableSeats;

    }

}


/* =========================================
   INITIALIZE TRANSPORT MODULE
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        displayTransportBuses();

        displayTransportRoutes();

        displayTransportAllocations();

        loadTransportBusOptions();

        updateTransportSummary();

    }
);

/* =========================================
   ANNOUNCEMENTS MANAGEMENT
========================================= */

let announcements =
    JSON.parse(
        localStorage.getItem(
            "campusAnnouncements"
        )
    ) || [

        {
            id: "ANN001",

            title: "Mid Semester Examination",

            message:
                "Mid Semester Examination will begin from 15 October 2026.",

            audience: "Students",

            priority: "High",

            date: "2026-10-02"

        },

        {
            id: "ANN002",

            title: "Faculty Meeting",

            message:
                "All faculty members are requested to attend the monthly faculty meeting.",

            audience: "Faculty",

            priority: "Important",

            date: "2026-10-05"

        },

        {
            id: "ANN003",

            title: "Campus Maintenance",

            message:
                "Campus maintenance work will be carried out this weekend.",

            audience: "All",

            priority: "Normal",

            date: "2026-10-04"

        }

    ];


/* =========================================
   SAVE ANNOUNCEMENTS
========================================= */

function saveAnnouncements() {

    localStorage.setItem(
        "campusAnnouncements",
        JSON.stringify(
            announcements
        )
    );

}


/* =========================================
   GENERATE ANNOUNCEMENT ID
========================================= */

function generateAnnouncementId() {

    const numbers =
        announcements.map(
            announcement => {

                return (
                    parseInt(
                        announcement.id
                            .replace(
                                "ANN",
                                ""
                            )
                    ) || 0
                );

            }
        );


    const nextNumber =
        numbers.length > 0
            ? Math.max(...numbers) + 1
            : 1;


    return (
        "ANN" +
        String(nextNumber)
            .padStart(3, "0")
    );

}


/* =========================================
   ADD ANNOUNCEMENT
========================================= */

function addAnnouncement(event) {

    event.preventDefault();


    const title =
        document.getElementById(
            "announcementTitle"
        ).value.trim();


    const message =
        document.getElementById(
            "announcementMessage"
        ).value.trim();


    const audience =
        document.getElementById(
            "announcementAudience"
        ).value;


    const priority =
        document.getElementById(
            "announcementPriority"
        ).value;


    const date =
        document.getElementById(
            "announcementDate"
        ).value;


    const newAnnouncement = {

        id:
            generateAnnouncementId(),

        title:
            title,

        message:
            message,

        audience:
            audience,

        priority:
            priority,

        date:
            date

    };


    if (!confirm("Publish this announcement?")) {
        return;
    }


    announcements.push(
        newAnnouncement
    );


    saveAnnouncements();

    displayAnnouncements();

    updateAnnouncementSummary();


    event.target.reset();


    alert(
        "Announcement published successfully."
    );

}


/* =========================================
   DISPLAY ANNOUNCEMENTS
========================================= */

function displayAnnouncements(
    data = announcements
) {

    const table =
        document.getElementById(
            "announcementTableBody"
        );


    if (!table) return;


    table.innerHTML = "";


    if (!data || data.length === 0) {
        table.innerHTML = `
            <tr>
                <td colspan="6" style="text-align:center;">
                    No announcements found.
                </td>
            </tr>
        `;
        return;
    }


    data.forEach(
        announcement => {

            const row =
                document.createElement(
                    "tr"
                );


            let priorityClass =
                "";


            if (
                announcement.priority ===
                "High"
            ) {

                priorityClass =
                    "announcement-high";

            }
            else if (
                announcement.priority ===
                "Important"
            ) {

                priorityClass =
                    "announcement-important";

            }
            else {

                priorityClass =
                    "announcement-normal";

            }


            row.innerHTML = `

                <td>
                    ${announcement.title}
                </td>

                <td>
                    ${announcement.message}
                </td>

                <td>
                    ${announcement.audience}
                </td>

                <td class="${priorityClass}">
                    ${announcement.priority}
                </td>

                <td>
                    ${announcement.date}
                </td>

                <td>${canDeleteEntries() ? `

                    <button
                        class="delete-btn"
                        onclick="deleteAnnouncement('${announcement.id}')">

                        Delete

                    </button>` : "-"}

                </td>

            `;


            table.appendChild(row);

        }
    );

}


/* =========================================
   DELETE ANNOUNCEMENT
========================================= */

function deleteAnnouncement(id) {
try { if (!requireDeleteAdmin()) return; } catch (e) { return; }

    if (
        !confirm(
            "Delete this announcement?"
        )
    ) {

        return;

    }


    announcements =
        announcements.filter(
            announcement =>
                announcement.id !== id
        );


    saveAnnouncements();

    displayAnnouncements();

    updateAnnouncementSummary();

}


/* =========================================
   SEARCH ANNOUNCEMENTS
========================================= */

function searchAnnouncements() {

    const searchInput =
        document.getElementById(
            "announcementSearch"
        );


    const filter =
        document.getElementById(
            "announcementFilter"
        );


    if (
        !searchInput ||
        !filter
    ) {

        return;

    }


    const search =
        searchInput.value
            .toLowerCase()
            .trim();


    const filterValue =
        filter.value;


    const filtered =
        announcements.filter(
            announcement => {

                const searchableText =
                    (
                        announcement.title +
                        " " +
                        announcement.message +
                        " " +
                        announcement.audience +
                        " " +
                        announcement.priority
                    ).toLowerCase();


                const matchesSearch =
                    searchableText.includes(
                        search
                    );


                let matchesFilter = true;


                if (
                    filterValue !==
                    "all"
                ) {

                    if (
                        filterValue ===
                        "High"
                    ) {

                        matchesFilter =
                            announcement.priority ===
                            "High";

                    }
                    else {

                        matchesFilter =
                            announcement.audience ===
                            filterValue;

                    }

                }


                return (
                    matchesSearch &&
                    matchesFilter
                );

            }
        );


    displayAnnouncements(
        filtered
    );

}


/* =========================================
   UPDATE SUMMARY
========================================= */

function updateAnnouncementSummary() {

    const total =
        announcements.length;


    const students =
        announcements.filter(
            announcement =>
                announcement.audience ===
                "Students" ||
                announcement.audience ===
                "All"
        ).length;


    const faculty =
        announcements.filter(
            announcement =>
                announcement.audience ===
                "Faculty" ||
                announcement.audience ===
                "All"
        ).length;


    const high =
        announcements.filter(
            announcement =>
                announcement.priority ===
                "High"
        ).length;


    const totalElement =
        document.getElementById(
            "totalAnnouncements"
        );


    const studentsElement =
        document.getElementById(
            "studentAnnouncements"
        );


    const facultyElement =
        document.getElementById(
            "facultyAnnouncements"
        );


    const highElement =
        document.getElementById(
            "highPriorityAnnouncements"
        );


    if (totalElement) {

        totalElement.textContent =
            total;

    }


    if (studentsElement) {

        studentsElement.textContent =
            students;

    }


    if (facultyElement) {

        facultyElement.textContent =
            faculty;

    }


    if (highElement) {

        highElement.textContent =
            high;

    }

}


/* =========================================
   INITIALIZE ANNOUNCEMENTS
========================================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        displayAnnouncements();

        updateAnnouncementSummary();

    }
);
/* =====================================================
REPORTS & ANALYTICS
===================================================== */

function generateReports() {

/* =========================
   STUDENTS
========================= */

const studentData = JSON.parse(
    localStorage.getItem("campusStudents")
) || students || [];

const facultyData = JSON.parse(
    localStorage.getItem("campusFaculty")
) || faculty || [];

const courseData = JSON.parse(
    localStorage.getItem("campusCourses")
) || courses || [];

const departmentData = JSON.parse(
    localStorage.getItem("campusDepartments")
) || departments || [];

document.getElementById("reportStudents").textContent =
    studentData.length;

document.getElementById("reportFaculty").textContent =
    facultyData.length;

document.getElementById("reportCourses").textContent =
    courseData.length;

document.getElementById("reportDepartments").textContent =
    departmentData.length;


/* =========================
   FEES
========================= */

const feeData = JSON.parse(
    localStorage.getItem("campusFees")
) || feeRecords || [];

let totalFees = 0;
let paidFees = 0;
let dueFees = 0;
let pendingStudents = 0;

feeData.forEach(fee => {

    const tuition = Number(fee.tuition ?? fee.tuitionFee) || 0;
    const hostel = Number(fee.hostel ?? fee.hostelFee) || 0;
    const examination = Number(fee.exam ?? fee.examination ?? fee.examinationFee) || 0;
    const paid = Number(fee.paid ?? fee.amountPaid) || 0;

    const total = tuition + hostel + examination;
    const due = Math.max(total - paid, 0);

    totalFees += total;
    paidFees += paid;
    dueFees += due;

    if (due > 0) {
        pendingStudents++;
    }
});

document.getElementById("reportTotalFees").textContent =
    "₹" + totalFees.toLocaleString("en-IN");

document.getElementById("reportPaidFees").textContent =
    "₹" + paidFees.toLocaleString("en-IN");

document.getElementById("reportDueFees").textContent =
    "₹" + dueFees.toLocaleString("en-IN");

document.getElementById("reportPendingStudents").textContent =
    pendingStudents;

const feePercentage = totalFees > 0
    ? Math.round((paidFees / totalFees) * 100)
    : 0;

document.getElementById("feePercentage").textContent =
    feePercentage + "%";

document.getElementById("feeProgress").style.width =
    Math.min(feePercentage, 100) + "%";


/* =========================
   EXAMINATIONS
========================= */

const examData = JSON.parse(
    localStorage.getItem("campusExaminations")
) || examinations || [];

const resultData = JSON.parse(
    localStorage.getItem("campusResults")
) || JSON.parse(
    localStorage.getItem("campusStudentResults")
) || studentResults || [];

let passed = 0;
let failed = 0;

resultData.forEach(result => {

    const marks = Number(result.marks) || 0;
    const totalMarks = Number(result.maxMarks ?? result.totalMarks) || 100;

    const percentage =
        totalMarks > 0
            ? (marks / totalMarks) * 100
            : 0;

    if (percentage >= 40) {
        passed++;
    } else {
        failed++;
    }
});

document.getElementById("reportTotalExams").textContent =
    examData.length;

document.getElementById("reportTotalResults").textContent =
    resultData.length;

document.getElementById("reportPassed").textContent =
    passed;

document.getElementById("reportFailed").textContent =
    failed;

const passPercentage = resultData.length > 0
    ? Math.round((passed / resultData.length) * 100)
    : 0;

document.getElementById("passPercentage").textContent =
    passPercentage + "%";

document.getElementById("passProgress").style.width =
    Math.min(passPercentage, 100) + "%";


/* =========================
   LIBRARY
========================= */

const bookData = JSON.parse(
    localStorage.getItem("campusLibraryBooks")
) || libraryBooks || [];

const issuedData = JSON.parse(
    localStorage.getItem("campusIssuedBooks")
) || issuedBooks || [];

let totalBooks = 0;
let availableBooks = 0;

bookData.forEach(book => {

    totalBooks += Number(book.quantity) || 0;
    availableBooks += Number(book.available) || 0;

});

let overdueBooks = 0;

issuedData.forEach(issue => {

    if (!issue.returned) {
        const daysOverdue = getDaysOverdue(issue.dueDate);

        if (daysOverdue > 0) {
            overdueBooks++;
        }
    }

});

document.getElementById("reportTotalBooks").textContent =
    totalBooks;

document.getElementById("reportAvailableBooks").textContent =
    availableBooks;

document.getElementById("reportIssuedBooks").textContent =
    issuedData.filter(book => !book.returned).length;

document.getElementById("reportOverdueBooks").textContent =
    overdueBooks;


/* =========================
   HOSTEL
========================= */

const roomData = JSON.parse(
    localStorage.getItem("campusHostelRooms")
) || hostelRooms || [];

const allocationData = JSON.parse(
    localStorage.getItem("campusHostelAllocations")
) || hostelAllocations || [];

let hostelCapacity = 0;

roomData.forEach(room => {
    hostelCapacity += Number(room.capacity) || 0;
});

const occupiedBeds = allocationData.length;

const availableBeds =
    Math.max(hostelCapacity - occupiedBeds, 0);

document.getElementById("reportTotalRooms").textContent =
    roomData.length;

document.getElementById("reportHostelCapacity").textContent =
    hostelCapacity;

document.getElementById("reportOccupiedBeds").textContent =
    occupiedBeds;

document.getElementById("reportAvailableBeds").textContent =
    availableBeds;


/* =========================
   TRANSPORT
========================= */

const busData = JSON.parse(
    localStorage.getItem("campusTransportBuses")
) || transportBuses || [];

const transportAllocationData = JSON.parse(
    localStorage.getItem("campusTransportAllocations")
) || transportAllocations || [];

let busCapacity = 0;

busData.forEach(bus => {
    busCapacity += Number(bus.capacity) || 0;
});

const occupiedSeats =
    transportAllocationData.length;

const availableSeats =
    Math.max(busCapacity - occupiedSeats, 0);

document.getElementById("reportTotalBuses").textContent =
    busData.length;

document.getElementById("reportBusCapacity").textContent =
    busCapacity;

document.getElementById("reportOccupiedSeats").textContent =
    occupiedSeats;

document.getElementById("reportAvailableSeats").textContent =
    availableSeats;


/* =========================
   ANNOUNCEMENTS
========================= */

const announcementData = JSON.parse(
    localStorage.getItem("campusAnnouncements")
) || announcements || [];

const studentAnnouncements =
    announcementData.filter(
        announcement =>
            announcement.audience === "Students" ||
            announcement.audience === "All"
    ).length;

const facultyAnnouncements =
    announcementData.filter(
        announcement =>
            announcement.audience === "Faculty" ||
            announcement.audience === "All"
    ).length;

const highAnnouncements =
    announcementData.filter(
        announcement =>
            announcement.priority === "High"
    ).length;

document.getElementById("reportAnnouncements").textContent =
    announcementData.length;

document.getElementById("reportStudentAnnouncements").textContent =
    studentAnnouncements;

document.getElementById("reportFacultyAnnouncements").textContent =
    facultyAnnouncements;

document.getElementById("reportHighAnnouncements").textContent =
    highAnnouncements;

}
/* =====================================================
USER MANAGEMENT & ROLE-BASED ACCESS
===================================================== */

let users = JSON.parse(
localStorage.getItem("campusUsers")
) || [

{
    id: "USR001",
    name: "Rajat Admin",
    userId: "ADMIN001",
    email: "admin@campus.edu",
    password: "admin123",
    role: "Admin",
    status: "Active"
},

{
    id: "USR002",
    name: "Rahul Kumar",
    userId: "STU001",
    email: "rahul@example.com",
    password: "student123",
    role: "Student",
    status: "Active"
},

{
    id: "USR003",
    name: "Dr. Priya Sharma",
    userId: "FAC001",
    email: "priya@example.com",
    password: "faculty123",
    role: "Faculty",
    status: "Active"
}

];

/* =========================
SAVE USERS
========================= */

function saveUsers() {

localStorage.setItem(
    "campusUsers",
    JSON.stringify(users)
);

}

/* =========================
GENERATE USER ID
========================= */

function generateUserRecordId() {

let maxNumber = 0;

users.forEach(user => {

    const match = String(user.id).match(
        /USR(\d+)/
    );

    if (match) {

        const number = parseInt(
            match[1]
        );

        if (number > maxNumber) {
            maxNumber = number;
        }

    }

});

return "USR" + String(
    maxNumber + 1
).padStart(3, "0");

}

/* =========================
ADD USER
========================= */

function addUser(event) {

event.preventDefault();

const name =
    document.getElementById("userName").value.trim();

const userId =
    document.getElementById("userId").value.trim();

const email =
    document.getElementById("userEmail").value.trim();

const password =
    document.getElementById("userPassword").value;

const role =
    document.getElementById("userRole").value;

const status =
    document.getElementById("userStatus").value;


if (!name || !userId || !email || !password || !role) {
    alert("Please fill all required fields.");
    return;
}


/* Prevent duplicate User ID */

const duplicateId = users.some(
    user =>
        user.userId.toLowerCase() ===
        userId.toLowerCase()
);

if (duplicateId) {

    alert("This User ID already exists.");

    return;
}


/* Prevent duplicate email */

const duplicateEmail = users.some(
    user =>
        user.email.toLowerCase() ===
        email.toLowerCase()
);

if (duplicateEmail) {

    alert("This email is already registered.");

    return;
}


const newUser = {

    id: generateUserRecordId(),

    name: name,

    userId: userId,

    email: email,

    password: password,

    role: role,

    status: status

};


users.push(newUser);

saveUsers();

displayUsers();

updateUserSummary();

if (event && event.target && typeof event.target.reset === "function") {
    event.target.reset();
} else {
    var _form = document.querySelector("form");
    if (_form) {
        _form.reset();
    }
}

alert("User added successfully.");

}

/* =========================
DISPLAY USERS
========================= */

function displayUsers(data = users) {


const tableBody =
    document.getElementById("userTableBody");

if (!tableBody) {
    return;
}

tableBody.innerHTML = "";


if (data.length === 0) {

    tableBody.innerHTML = `
        <tr>
            <td colspan="6" style="text-align:center;">
                No users found.
            </td>
        </tr>
    `;

    return;
}


data.forEach(user => {

    let roleClass = "";

    if (user.role === "Student") {
        roleClass = "role-student";
    }

    else if (user.role === "Faculty") {
        roleClass = "role-faculty";
    }

    else if (user.role === "Admin") {
        roleClass = "role-admin";
    }


    const statusClass =
        user.status === "Active"
            ? "user-active"
            : "user-inactive";


    const statusAction =
        user.status === "Active"
            ? "Deactivate"
            : "Activate";


    tableBody.innerHTML += `

        <tr>

            <td>${user.name}</td>

            <td>${user.userId}</td>

            <td>${user.email}</td>

            <td class="user-role ${roleClass}">
                ${user.role}
            </td>

            <td class="${statusClass}">
                ${user.status}
            </td>

            <td class="user-action-cell">${canDeleteEntries() ? `
                <div class="user-actions">
                <button
                    class="status-btn"
                    onclick="toggleUserStatus('${user.id}')"
                >
                    ${statusAction}
                </button>

                <button
                    class="delete-btn"
                    onclick="deleteUser('${user.id}')"
                >
                    Delete
                </button>
                </div>` : "-"}
            </td>

        </tr>

    `;

});


}

/* =========================
SEARCH USERS
========================= */

function searchUsers() {


const searchInput =
    document.getElementById("userSearch");

const roleFilter =
    document.getElementById("roleFilter");

const statusFilter =
    document.getElementById("statusFilter");


if (!searchInput || !roleFilter || !statusFilter) {
    return;
}


const search =
    searchInput.value
        .toLowerCase()
        .trim();

const selectedRole =
    roleFilter.value;

const selectedStatus =
    statusFilter.value;


const filteredUsers = users.filter(user => {

    const matchesSearch =
        user.name.toLowerCase().includes(search) ||
        user.userId.toLowerCase().includes(search) ||
        user.email.toLowerCase().includes(search);

    const matchesRole =
        selectedRole === "All" ||
        user.role === selectedRole;

    const matchesStatus =
        selectedStatus === "All" ||
        user.status === selectedStatus;

    return (
        matchesSearch &&
        matchesRole &&
        matchesStatus
    );

});


displayUsers(filteredUsers);


}

/* =========================
TOGGLE USER STATUS
========================= */

function toggleUserStatus(id) {
try { if (!requireDeleteAdmin()) return; } catch (e) { return; }

const user = users.find(
    user => user.id === id
);

if (!user) {
    return;
}

if (!confirm(user.status === "Active" ? "Deactivate user?" : "Activate user?")) {
    return;
}


user.status =
    user.status === "Active"
        ? "Inactive"
        : "Active";


saveUsers();

displayUsers();

updateUserSummary();

}

/* =========================
DELETE USER
========================= */

function deleteUser(id) {
try { if (!requireDeleteAdmin()) return; } catch (e) { return; }


const user = users.find(
    user => user.id === id
);

if (!user) {
    return;
}


/* Prevent deleting the last Admin */

if (user.role === "Admin") {

    const adminCount =
        users.filter(
            u => u.role === "Admin"
        ).length;

    if (adminCount <= 1) {

        alert(
            "At least one Admin account must remain."
        );

        return;
    }

}


const confirmed = confirm(
    `Delete user "${user.name}"?`
);


if (!confirmed) {
    return;
}


users = users.filter(
    user => user.id !== id
);


saveUsers();

displayUsers();

updateUserSummary();


}

/* =========================
USER SUMMARY
========================= */

function updateUserSummary() {


const totalElement =
    document.getElementById("totalUsers");

if (!totalElement) {
    return;
}


const studentCount =
    users.filter(
        user => user.role === "Student"
    ).length;


const facultyCount =
    users.filter(
        user => user.role === "Faculty"
    ).length;


const adminCount =
    users.filter(
        user => user.role === "Admin"
    ).length;


document.getElementById(
    "totalUsers"
).textContent = users.length;


document.getElementById(
    "totalStudentUsers"
).textContent = studentCount;


document.getElementById(
    "totalFacultyUsers"
).textContent = facultyCount;


document.getElementById(
    "totalAdminUsers"
).textContent = adminCount;

}

/* =====================================================
ATTENDANCE MANAGEMENT
===================================================== */

let attendanceRecords = JSON.parse(
localStorage.getItem("campusAttendance")
) || [

{
    id: "ATT001",
    studentName: "Rahul Kumar",
    studentId: "STU001",
    subject: "Data Structures",
    faculty: "Dr. Priya Sharma",
    date: "2026-10-01",
    status: "Present"
},

{
    id: "ATT002",
    studentName: "Rahul Kumar",
    studentId: "STU001",
    subject: "Database Systems",
    faculty: "Prof. Raj Kumar",
    date: "2026-10-01",
    status: "Present"
},

{
    id: "ATT003",
    studentName: "Priya Sharma",
    studentId: "STU002",
    subject: "Data Structures",
    faculty: "Dr. Priya Sharma",
    date: "2026-10-01",
    status: "Present"
},

{
    id: "ATT004",
    studentName: "Aman Das",
    studentId: "STU003",
    subject: "Engineering Mechanics",
    faculty: "Dr. Amit Das",
    date: "2026-10-01",
    status: "Absent"
},

{
    id: "ATT005",
    studentName: "Aman Das",
    studentId: "STU003",
    subject: "Data Structures",
    faculty: "Dr. Priya Sharma",
    date: "2026-10-02",
    status: "Absent"
},

{
    id: "ATT006",
    studentName: "Priya Sharma",
    studentId: "STU002",
    subject: "Database Systems",
    faculty: "Prof. Raj Kumar",
    date: "2026-10-02",
    status: "Present"
}

];

/* =========================
SAVE ATTENDANCE
========================= */

function saveAttendance() {

localStorage.setItem(
    "campusAttendance",
    JSON.stringify(attendanceRecords)
);

}

/* =========================
GENERATE ATTENDANCE ID
========================= */

function generateAttendanceId() {

let maxNumber = 0;

attendanceRecords.forEach(record => {

    const match = String(record.id).match(
        /ATT(\d+)/
    );

    if (match) {

        const number = parseInt(match[1]);

        if (number > maxNumber) {
            maxNumber = number;
        }

    }

});

return "ATT" + String(
    maxNumber + 1
).padStart(3, "0");

}

/* =========================
MARK ATTENDANCE
========================= */

function markAttendance(event) {


event.preventDefault();


const studentName =
    document.getElementById(
        "attendanceStudentName"
    ).value.trim();


const studentId =
    document.getElementById(
        "attendanceStudentId"
    ).value.trim();


const subject =
    document.getElementById(
        "attendanceSubject"
    ).value.trim();


const faculty =
    document.getElementById(
        "attendanceFaculty"
    ).value.trim();


const date =
    document.getElementById(
        "attendanceDate"
    ).value;


const status =
    document.getElementById(
        "attendanceStatus"
    ).value;


if (
    !studentName ||
    !studentId ||
    !subject ||
    !faculty ||
    !date ||
    !status
) {

    alert(
        "Please fill all attendance fields."
    );

    return;

}


/* Prevent duplicate attendance */

const duplicate = attendanceRecords.some(
    record =>
        record.studentId.toLowerCase() ===
        studentId.toLowerCase() &&

        record.subject.toLowerCase() ===
        subject.toLowerCase() &&

        record.date === date
);


if (duplicate) {

    alert(
        "Attendance for this student, subject and date already exists."
    );

    return;

}


if (!confirm("Mark attendance?")) {
    return;
}


const newRecord = {

    id: generateAttendanceId(),

    studentName: studentName,

    studentId: studentId,

    subject: subject,

    faculty: faculty,

    date: date,

    status: status

};


attendanceRecords.push(newRecord);

saveAttendance();

displayAttendance();

updateAttendanceSummary();

displayStudentAttendanceSummary();


document.querySelector(
    ".form-section form"
).reset();


alert(
    "Attendance marked successfully."
);


}

/* =========================
DISPLAY ATTENDANCE
========================= */

function displayAttendance(data = attendanceRecords, showAll = false) {


const tableBody =
    document.getElementById(
        "attendanceTableBody"
    );


if (!tableBody) {
    return;
}


tableBody.innerHTML = "";


if (data.length === 0) {

    tableBody.innerHTML = `
        <tr>
            <td colspan="7" style="text-align:center;">
                No attendance records found.
            </td>
        </tr>
    `;

    return;

}


var ATTENDANCE_PAGE_SIZE = 100;
var totalRows = data.length;
var truncated = !showAll && totalRows > ATTENDANCE_PAGE_SIZE;
var visible = truncated ? data.slice(0, ATTENDANCE_PAGE_SIZE) : data;

/* Perf: single innerHTML assignment. Per-row `tableBody.innerHTML +=`
   re-parses the whole table on every iteration (O(n^2) over 240+ rows),
   which is the main attendance-page jank. Search/filter narrows the list
   so it renders in full; the capped initial view offers "Show all". */
var allowDelete = canDeleteEntries();
var html = "";
visible.forEach(function (record) {
    var statusClass = record.status === "Present" ? "attendance-present" : "attendance-absent";
    html += `
        <tr>
            <td>${record.studentName}</td>
            <td>${record.studentId}</td>
            <td>${record.subject}</td>
            <td>${record.faculty}</td>
            <td>${record.date}</td>
            <td class="${statusClass}">
                ${record.status}
            </td>
            <td>${allowDelete ? `
                <button
                    class="attendance-delete-btn"
                    onclick="deleteAttendance('${record.id}')"
                >
                    Delete
                </button>` : "-"}
            </td>
        </tr>
    `;
});
if (truncated) {
    html += `
        <tr>
            <td colspan="7" style="text-align:center;">
                Showing ${visible.length} of ${totalRows} records.
                Use search above to narrow, or
                <button class="btn-secondary" onclick="displayAttendance(attendanceRecords, true)">Show all</button>.
            </td>
        </tr>
    `;
}
tableBody.innerHTML = html;


}

/* =========================
DELETE ATTENDANCE
========================= */

function deleteAttendance(id) {
try { if (!requireDeleteAdmin()) return; } catch (e) { return; }


const record =
    attendanceRecords.find(
        record => record.id === id
    );


if (!record) {
    return;
}


const confirmed = confirm(
    `Delete attendance record for ${record.studentName}?`
);


if (!confirmed) {
    return;
}


attendanceRecords =
    attendanceRecords.filter(
        record => record.id !== id
    );


saveAttendance();

displayAttendance();

updateAttendanceSummary();

displayStudentAttendanceSummary();


}

/* =========================
SEARCH ATTENDANCE
========================= */

function searchAttendance() {


const searchElement =
    document.getElementById(
        "attendanceSearch"
    );


const dateElement =
    document.getElementById(
        "attendanceDateFilter"
    );


const statusElement =
    document.getElementById(
        "attendanceStatusFilter"
    );


if (
    !searchElement ||
    !dateElement ||
    !statusElement
) {
    return;
}


const search =
    searchElement.value
        .toLowerCase()
        .trim();


const date =
    dateElement.value;


const status =
    statusElement.value;


const filtered =
    attendanceRecords.filter(record => {

        const matchesSearch =
            record.studentName
                .toLowerCase()
                .includes(search) ||

            record.studentId
                .toLowerCase()
                .includes(search) ||

            record.subject
                .toLowerCase()
                .includes(search) ||

            record.faculty
                .toLowerCase()
                .includes(search);


        const matchesDate =
            !date ||
            record.date === date;


        const matchesStatus =
            status === "All" ||
            record.status === status;


        return (
            matchesSearch &&
            matchesDate &&
            matchesStatus
        );

    });


displayAttendance(filtered);


}

/* =========================
ATTENDANCE SUMMARY
========================= */

function updateAttendanceSummary() {


const totalElement =
    document.getElementById(
        "totalAttendanceRecords"
    );


if (!totalElement) {
    return;
}


const total =
    attendanceRecords.length;


/* Perf: single pass instead of two full .filter() scans. */
let present = 0;
let absent = 0;
for (let i = 0; i < attendanceRecords.length; i++) {
    if (attendanceRecords[i].status === "Present") present++;
    else if (attendanceRecords[i].status === "Absent") absent++;
}


document.getElementById(
    "totalAttendanceRecords"
).textContent = total;


document.getElementById(
    "totalPresent"
).textContent = present;


document.getElementById(
    "totalAbsent"
).textContent = absent;


/*
   Find students whose attendance
   percentage is below 75%.
*/

const studentStats = {};


attendanceRecords.forEach(record => {

    if (!studentStats[record.studentId]) {

        studentStats[record.studentId] = {

            total: 0,

            present: 0

        };

    }


    studentStats[
        record.studentId
    ].total++;


    if (record.status === "Present") {

        studentStats[
            record.studentId
        ].present++;

    }

});


let lowAttendanceCount = 0;


Object.values(studentStats).forEach(
    student => {

        const percentage =
            student.total > 0
                ? (
                    student.present /
                    student.total
                ) * 100
                : 0;


        if (percentage < 75) {
            lowAttendanceCount++;
        }

    }
);


document.getElementById(
    "lowAttendanceStudents"
).textContent = lowAttendanceCount;


}

/* =========================
STUDENT ATTENDANCE SUMMARY
========================= */

function displayStudentAttendanceSummary() {


const tableBody =
    document.getElementById(
        "attendanceSummaryBody"
    );


if (!tableBody) {
    return;
}


tableBody.innerHTML = "";


const studentStats = {};


attendanceRecords.forEach(record => {

    if (!studentStats[record.studentId]) {

        studentStats[record.studentId] = {

            studentName:
                record.studentName,

            studentId:
                record.studentId,

            total: 0,

            present: 0,

            absent: 0

        };

    }


    studentStats[
        record.studentId
    ].total++;


    if (record.status === "Present") {

        studentStats[
            record.studentId
        ].present++;

    }


    if (record.status === "Absent") {

        studentStats[
            record.studentId
        ].absent++;

    }

});


const students =
    Object.values(studentStats);


if (students.length === 0) {

    tableBody.innerHTML = `
        <tr>
            <td colspan="7" style="text-align:center;">
                No attendance data available.
            </td>
        </tr>
    `;

    return;

}


/* Perf: single innerHTML assignment (was per-row `+=`, O(n^2) re-parse). */
var summaryHtml = "";
students.forEach(function (student) {
    var percentage =
        student.total > 0
            ? (
                student.present /
                student.total
            ) * 100
            : 0;
    var roundedPercentage =
        Math.round(percentage);
    var status = "";
    var statusClass = "";
    if (percentage >= 75) {
        status = "Good";
        statusClass = "attendance-good";
    }
    else if (percentage >= 60) {
        status = "Warning";
        statusClass = "attendance-warning";
    }
    else {
        status = "Critical";
        statusClass = "attendance-danger";
    }
    summaryHtml += `
        <tr>
            <td>${student.studentName}</td>
            <td>${student.studentId}</td>
            <td>${student.total}</td>
            <td>${student.present}</td>
            <td>${student.absent}</td>
            <td>
                <div class="attendance-progress">
                    <div
                        style="
                            width:${roundedPercentage}%;
                            background:
                            ${
                                percentage >= 75
                                    ? "#27ae60"
                                    : percentage >= 60
                                        ? "#f39c12"
                                        : "#e74c3c"
                            };
                        "
                    ></div>
                </div>
                ${roundedPercentage}%
            </td>
            <td class="${statusClass}">
                ${status}
            </td>
        </tr>
    `;
});
tableBody.innerHTML = summaryHtml;


}
/* =====================================================
ASSIGNMENTS & STUDY MATERIALS
===================================================== */

/* =====================================================
ASSIGNMENTS
===================================================== */

let assignments = JSON.parse(
localStorage.getItem("campusAssignments")
) || [

{
    id: "ASM001",
    title: "Data Structures Assignment",
    subject: "Data Structures",
    faculty: "Dr. Priya Sharma",
    semester: "3rd Semester",
    deadline: "2026-10-10",
    marks: 20,
    description:
        "Complete the linked list and stack programming problems.",
    status: "Pending"
},

{
    id: "ASM002",
    title: "Database Design",
    subject: "Database Systems",
    faculty: "Prof. Raj Kumar",
    semester: "4th Semester",
    deadline: "2026-10-05",
    marks: 25,
    description:
        "Design a normalized database schema for a college management system.",
    status: "Submitted"
},

{
    id: "ASM003",
    title: "Engineering Mechanics Problems",
    subject: "Engineering Mechanics",
    faculty: "Dr. Amit Das",
    semester: "2nd Semester",
    deadline: "2026-09-28",
    marks: 20,
    description:
        "Solve the assigned mechanics numerical problems.",
    status: "Overdue"
}

];

/* =========================
STUDY MATERIALS
========================= */

let studyMaterials = JSON.parse(
localStorage.getItem("campusStudyMaterials")
) || [

{
    id: "MAT001",
    title: "Data Structures Complete Handbook",
    subject: "Data Structures",
    faculty: "Dr. Priya Sharma",
    type: "PDF",
    link: "https://example.com/ds-handbook-pdf",
    date: "2026-10-01"
},

{
    id: "MAT002",
    title: "DBMS Normalization and SQL Guide",
    subject: "DBMS",
    faculty: "Prof. Raj Kumar",
    type: "PDF",
    link: "https://example.com/dbms-normalization-pdf",
    date: "2026-09-28"
},

{
    id: "MAT003",
    title: "Operating Systems Process Scheduling",
    subject: "Operating Systems",
    faculty: "Dr. Amit Das",
    type: "PDF",
    link: "https://example.com/os-scheduling-pdf",
    date: "2026-09-25"
},

{
    id: "MAT004",
    title: "Computer Networks OSI and TCP-IP Charts",
    subject: "Computer Networks",
    faculty: "Prof. Kavita Rao",
    type: "PDF",
    link: "https://example.com/cn-osi-charts-pdf",
    date: "2026-09-22"
},

{
    id: "MAT005",
    title: "Engineering Mathematics Formula Book",
    subject: "Mathematics",
    faculty: "Dr. Suresh Menon",
    type: "PDF",
    link: "https://example.com/maths-formula-pdf",
    date: "2026-09-20"
},

{
    id: "MAT006",
    title: "Data Structures Trees and Graphs Explained",
    subject: "Data Structures",
    faculty: "Dr. Priya Sharma",
    type: "Video",
    link: "https://example.com/ds-trees-video",
    date: "2026-10-02"
},

{
    id: "MAT007",
    title: "DBMS Joins and Transactions Lecture",
    subject: "DBMS",
    faculty: "Prof. Raj Kumar",
    type: "Video",
    link: "https://example.com/dbms-joins-video",
    date: "2026-09-29"
},

{
    id: "MAT008",
    title: "Operating Systems Deadlocks Demystified",
    subject: "Operating Systems",
    faculty: "Dr. Amit Das",
    type: "Video",
    link: "https://example.com/os-deadlocks-video",
    date: "2026-09-26"
},

{
    id: "MAT009",
    title: "Computer Networks Subnetting Masterclass",
    subject: "Computer Networks",
    faculty: "Prof. Kavita Rao",
    type: "Video",
    link: "https://example.com/cn-subnetting-video",
    date: "2026-09-23"
},

{
    id: "MAT010",
    title: "Mathematics Linear Algebra Visualized",
    subject: "Mathematics",
    faculty: "Dr. Suresh Menon",
    type: "Video",
    link: "https://example.com/maths-linalg-video",
    date: "2026-09-21"
},

{
    id: "MAT011",
    title: "Data Structures Stack and Queue Notes",
    subject: "Data Structures",
    faculty: "Dr. Priya Sharma",
    type: "Notes",
    link: "https://example.com/ds-stack-queue-notes",
    date: "2026-09-30"
},

{
    id: "MAT012",
    title: "DBMS ER Diagram Quick Notes",
    subject: "DBMS",
    faculty: "Prof. Raj Kumar",
    type: "Notes",
    link: "https://example.com/dbms-er-notes",
    date: "2026-09-27"
},

{
    id: "MAT013",
    title: "Operating Systems Memory Management Notes",
    subject: "Operating Systems",
    faculty: "Prof. Neha Verma",
    type: "Notes",
    link: "https://example.com/os-memory-notes",
    date: "2026-09-24"
},

{
    id: "MAT014",
    title: "Computer Networks Routing Protocols Notes",
    subject: "Computer Networks",
    faculty: "Prof. Kavita Rao",
    type: "Notes",
    link: "https://example.com/cn-routing-notes",
    date: "2026-09-21"
},

{
    id: "MAT015",
    title: "Mathematics Calculus Revision Notes",
    subject: "Mathematics",
    faculty: "Dr. Suresh Menon",
    type: "Notes",
    link: "https://example.com/maths-calculus-notes",
    date: "2026-09-19"
},

{
    id: "MAT016",
    title: "Data Structures Sorting Algorithms Deck",
    subject: "Data Structures",
    faculty: "Dr. Priya Sharma",
    type: "Presentation",
    link: "https://example.com/ds-sorting-slides",
    date: "2026-09-29"
},

{
    id: "MAT017",
    title: "DBMS Indexing and Query Optimization Slides",
    subject: "DBMS",
    faculty: "Prof. Raj Kumar",
    type: "Presentation",
    link: "https://example.com/dbms-indexing-slides",
    date: "2026-09-26"
},

{
    id: "MAT018",
    title: "Operating Systems Paging vs Segmentation PPT",
    subject: "Operating Systems",
    faculty: "Dr. Amit Das",
    type: "Presentation",
    link: "https://example.com/os-paging-slides",
    date: "2026-09-23"
},

{
    id: "MAT019",
    title: "Computer Networks DNS and HTTP Slides",
    subject: "Computer Networks",
    faculty: "Prof. Kavita Rao",
    type: "Presentation",
    link: "https://example.com/cn-dns-http-slides",
    date: "2026-09-20"
},

{
    id: "MAT020",
    title: "Mathematics Probability Distributions Deck",
    subject: "Mathematics",
    faculty: "Dr. Suresh Menon",
    type: "Presentation",
    link: "https://example.com/maths-probability-slides",
    date: "2026-09-18"
},

{
    id: "MAT021",
    title: "Data Structures Interactive Visualizer",
    subject: "Data Structures",
    faculty: "Dr. Priya Sharma",
    type: "Link",
    link: "https://example.com/ds-visualizer",
    date: "2026-10-03"
},

{
    id: "MAT022",
    title: "DBMS Practice Playground and Docs",
    subject: "DBMS",
    faculty: "Prof. Raj Kumar",
    type: "Link",
    link: "https://example.com/dbms-playground",
    date: "2026-09-30"
},

{
    id: "MAT023",
    title: "Operating Systems Lab Simulations",
    subject: "Operating Systems",
    faculty: "Prof. Neha Verma",
    type: "Link",
    link: "https://example.com/os-lab-sims",
    date: "2026-09-27"
},

{
    id: "MAT024",
    title: "Computer Networks CIDR Calculator Tool",
    subject: "Computer Networks",
    faculty: "Prof. Kavita Rao",
    type: "Link",
    link: "https://example.com/cn-cidr-tool",
    date: "2026-09-24"
},

{
    id: "MAT025",
    title: "Mathematics Problem Solver Collection",
    subject: "Mathematics",
    faculty: "Dr. Suresh Menon",
    type: "Link",
    link: "https://example.com/maths-solvers",
    date: "2026-09-22"
}

];

/* =========================
SAVE DATA
========================= */

function saveAssignments() {

localStorage.setItem(
    "campusAssignments",
    JSON.stringify(assignments)
);

}

function saveStudyMaterials() {

localStorage.setItem(
    "campusStudyMaterials",
    JSON.stringify(studyMaterials)
);

}

/* =========================
GENERATE IDS
========================= */

function generateAssignmentId() {

let maxNumber = 0;

assignments.forEach(assignment => {

    const match =
        String(assignment.id).match(
            /ASM(\d+)/
        );

    if (match) {

        const number =
            parseInt(match[1]);

        if (number > maxNumber) {
            maxNumber = number;
        }

    }

});

return "ASM" +
    String(maxNumber + 1)
        .padStart(3, "0");

}

function generateMaterialId() {

let maxNumber = 0;

studyMaterials.forEach(material => {

    const match =
        String(material.id).match(
            /MAT(\d+)/
        );

    if (match) {

        const number =
            parseInt(match[1]);

        if (number > maxNumber) {
            maxNumber = number;
        }

    }

});

return "MAT" +
    String(maxNumber + 1)
        .padStart(3, "0");

}

/* =====================================================
ADD ASSIGNMENT
===================================================== */

function addAssignment(event) {

event.preventDefault();

if (!confirm("Are you sure you want to create this assignment?")) {
    return;
}


const title =
    document.getElementById(
        "assignmentTitle"
    ).value.trim();


const subject =
    document.getElementById(
        "assignmentSubject"
    ).value.trim();


const faculty =
    document.getElementById(
        "assignmentFaculty"
    ).value.trim();


const semester =
    document.getElementById(
        "assignmentSemester"
    ).value.trim();


const deadline =
    document.getElementById(
        "assignmentDeadline"
    ).value;


const marks =
    Number(
        document.getElementById(
            "assignmentMarks"
        ).value
    );


const description =
    document.getElementById(
        "assignmentDescription"
    ).value.trim();


if (
    !title ||
    !subject ||
    !faculty ||
    !semester ||
    !deadline ||
    !marks ||
    !description
) {

    alert(
        "Please fill all assignment fields."
    );

    return;

}


const newAssignment = {

    id: generateAssignmentId(),

    title: title,

    subject: subject,

    faculty: faculty,

    semester: semester,

    deadline: deadline,

    marks: marks,

    description: description,

    status: "Pending"

};


assignments.push(newAssignment);

saveAssignments();

displayAssignments();

updateAssignmentSummary();


document.querySelector(
    ".form-section form"
).reset();


alert(
    "Assignment created successfully."
);

}

/* =====================================================
GET ASSIGNMENT STATUS
===================================================== */

function getAssignmentStatus(assignment) {

if (assignment.status === "Submitted") {
    return "Submitted";
}


const today =
    new Date().toISOString().split("T")[0];


if (
    assignment.deadline &&
    assignment.deadline < today
) {

    return "Overdue";

}


return "Pending";

}

/* =====================================================
DISPLAY ASSIGNMENTS
===================================================== */

function displayAssignments(data = assignments) {


const tableBody =
    document.getElementById(
        "assignmentTableBody"
    );


if (!tableBody) {
    return;
}


tableBody.innerHTML = "";


if (data.length === 0) {

    tableBody.innerHTML = `
        <tr>
            <td colspan="8" style="text-align:center;">
                No assignments found.
            </td>
        </tr>
    `;

    return;

}


data.forEach(assignment => {

    const currentStatus =
        getAssignmentStatus(
            assignment
        );


    let statusClass =
        "assignment-pending";


    if (currentStatus === "Submitted") {

        statusClass =
            "assignment-submitted";

    }

    else if (
        currentStatus === "Overdue"
    ) {

        statusClass =
            "assignment-overdue";

    }


    tableBody.innerHTML += `

        <tr>

            <td>
                ${assignment.title}
            </td>

            <td>
                ${assignment.subject}
            </td>

            <td>
                ${assignment.faculty}
            </td>

            <td>
                ${assignment.semester}
            </td>

            <td>
                ${assignment.deadline}
            </td>

            <td>
                ${assignment.marks}
            </td>

            <td class="${statusClass}">
                ${currentStatus}
            </td>

            <td>

                ${
                    currentStatus !== "Submitted"
                        ? `
                            <button
                                class="assignment-submit-btn"
                                onclick="submitAssignment('${assignment.id}')"
                            >
                                Submit
                            </button>
                          `
                        : ""
                }

                ${canDeleteEntries() ? `
                <button
                    class="assignment-delete-btn"
                    onclick="deleteAssignment('${assignment.id}')"
                >
                    Delete
                </button>` : ""}

            </td>

        </tr>

    `;

});


}

/* =====================================================
SUBMIT ASSIGNMENT
===================================================== */

function submitAssignment(id) {


const assignment =
    assignments.find(
        assignment =>
            assignment.id === id
    );


if (!assignment) {
    return;
}


if (
    getAssignmentStatus(
        assignment
    ) === "Overdue"
) {

    const confirmed = confirm(
        "This assignment is overdue. Mark it as submitted anyway?"
    );


    if (!confirmed) {
        return;
    }

}


assignment.status =
    "Submitted";


saveAssignments();

displayAssignments();

updateAssignmentSummary();


alert(
    "Assignment marked as submitted."
);


}

/* =====================================================
DELETE ASSIGNMENT
===================================================== */

function deleteAssignment(id) {
try { if (!requireDeleteAdmin()) return; } catch (e) { return; }


const assignment =
    assignments.find(
        assignment =>
            assignment.id === id
    );


if (!assignment) {
    return;
}


const confirmed = confirm(
    `Delete "${assignment.title}"?`
);


if (!confirmed) {
    return;
}


assignments =
    assignments.filter(
        assignment =>
            assignment.id !== id
    );


saveAssignments();

displayAssignments();

updateAssignmentSummary();


}

/* =====================================================
SEARCH ASSIGNMENTS
===================================================== */

function searchAssignments() {


const searchElement =
    document.getElementById(
        "assignmentSearch"
    );


const statusElement =
    document.getElementById(
        "assignmentStatusFilter"
    );


if (
    !searchElement ||
    !statusElement
) {
    return;
}


const search =
    searchElement.value
        .toLowerCase()
        .trim();


const selectedStatus =
    statusElement.value;


const filtered =
    assignments.filter(
        assignment => {

            const matchesSearch =
                assignment.title
                    .toLowerCase()
                    .includes(search) ||

                assignment.subject
                    .toLowerCase()
                    .includes(search) ||

                assignment.faculty
                    .toLowerCase()
                    .includes(search) ||

                assignment.semester
                    .toLowerCase()
                    .includes(search);


            const matchesStatus =
                selectedStatus === "All" ||
                getAssignmentStatus(
                    assignment
                ) === selectedStatus;


            return (
                matchesSearch &&
                matchesStatus
            );

        }
    );


displayAssignments(filtered);


}

/* =====================================================
ASSIGNMENT SUMMARY
===================================================== */

function updateAssignmentSummary() {


const totalElement =
    document.getElementById(
        "totalAssignments"
    );


if (!totalElement) {
    return;
}


let pending = 0;
let submitted = 0;
let overdue = 0;


assignments.forEach(
    assignment => {

        const status =
            getAssignmentStatus(
                assignment
            );


        if (status === "Pending") {
            pending++;
        }

        else if (
            status === "Submitted"
        ) {
            submitted++;
        }

        else if (
            status === "Overdue"
        ) {
            overdue++;
        }

    }
);


document.getElementById(
    "totalAssignments"
).textContent =
    assignments.length;


document.getElementById(
    "pendingAssignments"
).textContent =
    pending;


document.getElementById(
    "submittedAssignments"
).textContent =
    submitted;


document.getElementById(
    "overdueAssignments"
).textContent =
    overdue;


}

/* =====================================================
ADD STUDY MATERIAL
===================================================== */

function addStudyMaterial(event) {


event.preventDefault();

if (!confirm("Are you sure you want to add this study material?")) {
    return;
}


const title =
    document.getElementById(
        "materialTitle"
    ).value.trim();


const subject =
    document.getElementById(
        "materialSubject"
    ).value.trim();


const faculty =
    document.getElementById(
        "materialFaculty"
    ).value.trim();


const type =
    document.getElementById(
        "materialType"
    ).value;


const link =
    document.getElementById(
        "materialLink"
    ).value.trim();


const date =
    document.getElementById(
        "materialDate"
    ).value;


if (
    !title ||
    !subject ||
    !faculty ||
    !type ||
    !link ||
    !date
) {

    alert(
        "Please fill all study material fields."
    );

    return;

}


const newMaterial = {

    id: generateMaterialId(),

    title: title,

    subject: subject,

    faculty: faculty,

    type: type,

    link: link,

    date: date

};


studyMaterials.push(
    newMaterial
);


saveStudyMaterials();

displayStudyMaterials();


const forms =
    document.querySelectorAll(
        ".form-section form"
    );


if (forms.length > 1) {
    forms[1].reset();
}


alert(
    "Study material added successfully."
);


}

/* =====================================================
DISPLAY STUDY MATERIALS
===================================================== */

function displayStudyMaterials(
data = studyMaterials
) {


const tableBody =
    document.getElementById(
        "materialTableBody"
    );


if (!tableBody) {
    return;
}


tableBody.innerHTML = "";


if (data.length === 0) {

    tableBody.innerHTML = `
        <tr>
            <td colspan="7" style="text-align:center;">
                No study materials found.
            </td>
        </tr>
    `;

    return;

}


const typeOrder = [
    "PDF",
    "Video",
    "Notes",
    "Presentation",
    "Link"
];


function getMaterialTypeOrder(type) {

    const index =
        typeOrder.indexOf(type);

    return index === -1 ? typeOrder.length : index;

}


const sortedData = [...data].sort((a, b) => {

    const orderDiff =
        getMaterialTypeOrder(a.type) -
        getMaterialTypeOrder(b.type);

    if (orderDiff !== 0) {
        return orderDiff;
    }

    return String(b.date).localeCompare(String(a.date));

});


let currentGroup = null;

sortedData.forEach(material => {

    if (material.type !== currentGroup) {

        currentGroup = material.type;

        const groupCount =
            sortedData.filter(
                item => item.type === currentGroup
            ).length;

        tableBody.innerHTML += `

            <tr class="material-group-row" data-material-group="${currentGroup}">

                <td colspan="7" style="text-align:left;font-weight:600;background:var(--surface-alt, #f1f5f9);">

                    ${currentGroup} — ${groupCount} item${groupCount === 1 ? "" : "s"}

                </td>

            </tr>

        `;

    }

    tableBody.innerHTML += `

        <tr>

            <td>
                ${material.title}
            </td>

            <td>
                ${material.subject}
            </td>

            <td>
                ${material.faculty}
            </td>

            <td>
                ${material.type}
            </td>

            <td>
                ${material.date}
            </td>

            <td>

                <a
                    href="${material.link}"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="material-link"
                >
                    Open Resource
                </a>

            </td>

            <td>${canDeleteEntries() ? `

                <button
                    class="assignment-delete-btn"
                    onclick="deleteStudyMaterial('${material.id}')"
                >
                    Delete
                </button>` : "-"}

            </td>

        </tr>

    `;

});


}

/* =====================================================
SEARCH STUDY MATERIALS
===================================================== */

function searchStudyMaterials() {


const searchElement =
    document.getElementById(
        "materialSearch"
    );


const typeElement =
    document.getElementById(
        "materialTypeFilter"
    );


if (
    !searchElement ||
    !typeElement
) {
    return;
}


const search =
    searchElement.value
        .toLowerCase()
        .trim();


const selectedType =
    typeElement.value;


const filtered =
    studyMaterials.filter(
        material => {

            const matchesSearch =
                material.title
                    .toLowerCase()
                    .includes(search) ||

                material.subject
                    .toLowerCase()
                    .includes(search) ||

                material.faculty
                    .toLowerCase()
                    .includes(search);


            const matchesType =
                selectedType === "All" ||
                material.type === selectedType;


            return (
                matchesSearch &&
                matchesType
            );

        }
    );


displayStudyMaterials(filtered);


}

/* =====================================================
DELETE STUDY MATERIAL
===================================================== */

function deleteStudyMaterial(id) {
try { if (!requireDeleteAdmin()) return; } catch (e) { return; }


const material =
    studyMaterials.find(
        material =>
            material.id === id
    );


if (!material) {
    return;
}


const confirmed = confirm(
    `Delete "${material.title}"?`
);


if (!confirmed) {
    return;
}


studyMaterials =
    studyMaterials.filter(
        material =>
            material.id !== id
    );


saveStudyMaterials();

displayStudyMaterials();


}

/* =====================================================
REPORTS & ANALYTICS
===================================================== */

function generateReports() {


/* =========================
   STUDENTS
========================= */

const studentData = JSON.parse(
    localStorage.getItem("campusStudents")
) || students || [];

const facultyData = JSON.parse(
    localStorage.getItem("campusFaculty")
) || faculty || [];

const courseData = JSON.parse(
    localStorage.getItem("campusCourses")
) || courses || [];

const departmentData = JSON.parse(
    localStorage.getItem("campusDepartments")
) || departments || [];

document.getElementById("reportStudents").textContent =
    studentData.length;

document.getElementById("reportFaculty").textContent =
    facultyData.length;

document.getElementById("reportCourses").textContent =
    courseData.length;

document.getElementById("reportDepartments").textContent =
    departmentData.length;


/* =========================
   FEES
========================= */

const feeData = JSON.parse(
    localStorage.getItem("campusFees")
) || feeRecords || [];

let totalFees = 0;
let paidFees = 0;
let dueFees = 0;
let pendingStudents = 0;

feeData.forEach(fee => {

    const tuition = Number(fee.tuition ?? fee.tuitionFee) || 0;
    const hostel = Number(fee.hostel ?? fee.hostelFee) || 0;
    const examination = Number(fee.exam ?? fee.examination ?? fee.examinationFee) || 0;
    const paid = Number(fee.paid ?? fee.amountPaid) || 0;

    const total = tuition + hostel + examination;
    const due = Math.max(total - paid, 0);

    totalFees += total;
    paidFees += paid;
    dueFees += due;

    if (due > 0) {
        pendingStudents++;
    }
});

document.getElementById("reportTotalFees").textContent =
    "₹" + totalFees.toLocaleString("en-IN");

document.getElementById("reportPaidFees").textContent =
    "₹" + paidFees.toLocaleString("en-IN");

document.getElementById("reportDueFees").textContent =
    "₹" + dueFees.toLocaleString("en-IN");

document.getElementById("reportPendingStudents").textContent =
    pendingStudents;

const feePercentage = totalFees > 0
    ? Math.round((paidFees / totalFees) * 100)
    : 0;

document.getElementById("feePercentage").textContent =
    feePercentage + "%";

document.getElementById("feeProgress").style.width =
    Math.min(feePercentage, 100) + "%";


/* =========================
   EXAMINATIONS
========================= */

const examData = JSON.parse(
    localStorage.getItem("campusExaminations")
) || examinations || [];

const resultData = JSON.parse(
    localStorage.getItem("campusResults")
) || JSON.parse(
    localStorage.getItem("campusStudentResults")
) || studentResults || [];

let passed = 0;
let failed = 0;

resultData.forEach(result => {

    const marks = Number(result.marks) || 0;
    const totalMarks = Number(result.maxMarks ?? result.totalMarks) || 100;

    const percentage =
        totalMarks > 0
            ? (marks / totalMarks) * 100
            : 0;

    if (percentage >= 40) {
        passed++;
    } else {
        failed++;
    }
});

document.getElementById("reportTotalExams").textContent =
    examData.length;

document.getElementById("reportTotalResults").textContent =
    resultData.length;

document.getElementById("reportPassed").textContent =
    passed;

document.getElementById("reportFailed").textContent =
    failed;

const passPercentage = resultData.length > 0
    ? Math.round((passed / resultData.length) * 100)
    : 0;

document.getElementById("passPercentage").textContent =
    passPercentage + "%";

document.getElementById("passProgress").style.width =
    Math.min(passPercentage, 100) + "%";


/* =========================
   LIBRARY
========================= */

const bookData = JSON.parse(
    localStorage.getItem("campusLibraryBooks")
) || libraryBooks || [];

const issuedData = JSON.parse(
    localStorage.getItem("campusIssuedBooks")
) || issuedBooks || [];

let totalBooks = 0;
let availableBooks = 0;

bookData.forEach(book => {

    totalBooks += Number(book.quantity) || 0;
    availableBooks += Number(book.available) || 0;

});

let overdueBooks = 0;

issuedData.forEach(issue => {

    if (!issue.returned) {
        const daysOverdue = getDaysOverdue(issue.dueDate);

        if (daysOverdue > 0) {
            overdueBooks++;
        }
    }

});

document.getElementById("reportTotalBooks").textContent =
    totalBooks;

document.getElementById("reportAvailableBooks").textContent =
    availableBooks;

document.getElementById("reportIssuedBooks").textContent =
    issuedData.filter(book => !book.returned).length;

document.getElementById("reportOverdueBooks").textContent =
    overdueBooks;


/* =========================
   HOSTEL
========================= */

const roomData = JSON.parse(
    localStorage.getItem("campusHostelRooms")
) || hostelRooms || [];

const allocationData = JSON.parse(
    localStorage.getItem("campusHostelAllocations")
) || hostelAllocations || [];

let hostelCapacity = 0;

roomData.forEach(room => {
    hostelCapacity += Number(room.capacity) || 0;
});

const occupiedBeds = allocationData.length;

const availableBeds =
    Math.max(hostelCapacity - occupiedBeds, 0);

document.getElementById("reportTotalRooms").textContent =
    roomData.length;

document.getElementById("reportHostelCapacity").textContent =
    hostelCapacity;

document.getElementById("reportOccupiedBeds").textContent =
    occupiedBeds;

document.getElementById("reportAvailableBeds").textContent =
    availableBeds;


/* =========================
   TRANSPORT
========================= */

const busData = JSON.parse(
    localStorage.getItem("campusTransportBuses")
) || transportBuses || [];

const transportAllocationData = JSON.parse(
    localStorage.getItem("campusTransportAllocations")
) || transportAllocations || [];

let busCapacity = 0;

busData.forEach(bus => {
    busCapacity += Number(bus.capacity) || 0;
});

const occupiedSeats =
    transportAllocationData.length;

const availableSeats =
    Math.max(busCapacity - occupiedSeats, 0);

document.getElementById("reportTotalBuses").textContent =
    busData.length;

document.getElementById("reportBusCapacity").textContent =
    busCapacity;

document.getElementById("reportOccupiedSeats").textContent =
    occupiedSeats;

document.getElementById("reportAvailableSeats").textContent =
    availableSeats;


/* =========================
   ANNOUNCEMENTS
========================= */

const announcementData = JSON.parse(
    localStorage.getItem("campusAnnouncements")
) || announcements || [];

const studentAnnouncements =
    announcementData.filter(
        announcement =>
            announcement.audience === "Students" ||
            announcement.audience === "All"
    ).length;

const facultyAnnouncements =
    announcementData.filter(
        announcement =>
            announcement.audience === "Faculty" ||
            announcement.audience === "All"
    ).length;

const highAnnouncements =
    announcementData.filter(
        announcement =>
            announcement.priority === "High"
    ).length;

document.getElementById("reportAnnouncements").textContent =
    announcementData.length;

document.getElementById("reportStudentAnnouncements").textContent =
    studentAnnouncements;

document.getElementById("reportFacultyAnnouncements").textContent =
    facultyAnnouncements;

document.getElementById("reportHighAnnouncements").textContent =
    highAnnouncements;


}

/* ==========================================
STUDENT NOTIFICATIONS CENTER
========================================== */

let studentNotifications = JSON.parse(
localStorage.getItem("campusStudentNotifications")
) || [
{
id: "NOT001",
title: "Mid Semester Examination",
message: "Mid Semester Examination will begin from 15 October 2026.",
type: "Exam",
priority: "High",
date: "2026-10-02",
read: false
},
{
id: "NOT002",
title: "Data Structures Assignment",
message: "Your Data Structures Problem Set is due on 10 October 2026.",
type: "Assignment",
priority: "Important",
date: "2026-10-02",
read: false
},
{
id: "NOT003",
title: "Fee Payment Reminder",
message: "Your pending semester fee amount is ₹5,000.",
type: "Fee",
priority: "High",
date: "2026-10-01",
read: false
},
{
id: "NOT004",
title: "Attendance Alert",
message: "Your current attendance is 82%. Maintain regular attendance.",
type: "Attendance",
priority: "Normal",
date: "2026-10-01",
read: true
},
{
id: "NOT005",
title: "Library Book Reminder",
message: "Your issued book is due for return on 9 October 2026.",
type: "Library",
priority: "Important",
date: "2026-09-30",
read: true
},
{
id: "NOT006",
title: "Campus Maintenance",
message: "Campus maintenance work will be carried out this weekend.",
type: "Announcement",
priority: "Normal",
date: "2026-09-29",
read: false
}
];

/* Save notifications */

function saveStudentNotifications() {

localStorage.setItem(
    "campusStudentNotifications",
    JSON.stringify(studentNotifications)
);

}

/* Generate notification ID */

function generateStudentNotificationId() {

let maxNumber = 0;

studentNotifications.forEach(notification => {

    let number = parseInt(
        notification.id.replace("NOT", "")
    );

    if (!isNaN(number) && number > maxNumber) {
        maxNumber = number;
    }
});

return "NOT" + String(maxNumber + 1).padStart(3, "0");

}

/* Display notifications */

function displayStudentNotifications(data = studentNotifications) {


const container = document.getElementById(
    "studentNotificationList"
);

if (!container) return;

container.innerHTML = "";

if (data.length === 0) {

    container.innerHTML = `
        <div class="no-notifications">
            <h3>No notifications found</h3>
            <p>You're all caught up.</p>
        </div>
    `;

    updateStudentNotificationCount(0);
    return;
}

data.sort((a, b) => {

    return new Date(b.date) - new Date(a.date);

});

data.forEach(notification => {

    let priorityClass = "";

    if (notification.priority === "Important") {
        priorityClass = "important";
    }

    if (notification.priority === "High") {
        priorityClass = "high";
    }

    const readClass = notification.read
        ? ""
        : "unread";

    const statusHTML = notification.read
        ? `<span class="notification-read-label">✓ Read</span>`
        : `<span class="notification-unread-label">
                <span class="notification-unread-dot"></span>
                Unread
           </span>`;

    const actionButton = notification.read
        ? ""
        : `
            <button
                class="notification-read-btn"
                onclick="markStudentNotificationRead('${notification.id}')"
            >
                Mark as Read
            </button>
          `;

    container.innerHTML += `
        <div class="notification-card ${readClass} ${priorityClass}">

            <div class="notification-top">

                <div class="notification-title">
                    ${notification.title}
                </div>

                <span class="notification-type">
                    ${notification.type}
                </span>

            </div>

            <div class="notification-message">
                ${notification.message}
            </div>

            <div class="notification-meta">

                <span>
                    <svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg> ${notification.date}
                </span>

                <span>
                    Priority: ${notification.priority}
                </span>

                ${statusHTML}

            </div>

            <div class="notification-actions">

                ${actionButton}

                ${canDeleteEntries() ? `
                <button
                    class="notification-delete-btn"
                    onclick="deleteStudentNotification('${notification.id}')"
                >
                    Delete
                </button>` : ""}

            </div>

        </div>
    `;
});

updateStudentNotificationCount(data.length);


}

/* Mark one notification as read */

function markStudentNotificationRead(id) {


const notification = studentNotifications.find(
    item => item.id === id
);

if (!notification) return;

notification.read = true;

saveStudentNotifications();

displayStudentNotifications();
updateStudentNotificationSummary();


}

/* Mark all notifications as read */

function markAllStudentNotificationsRead() {


studentNotifications.forEach(notification => {
    notification.read = true;
});

saveStudentNotifications();

displayStudentNotifications();
updateStudentNotificationSummary();

alert("All notifications marked as read.");


}

/* Delete notification */

function deleteStudentNotification(id) {
try { if (!requireDeleteAdmin()) return; } catch (e) { return; }


if (!confirm("Delete this notification?")) {
    return;
}

studentNotifications =
    studentNotifications.filter(
        notification => notification.id !== id
    );

saveStudentNotifications();

displayStudentNotifications();
updateStudentNotificationSummary();


}

/* Search and filter */

function filterStudentNotifications() {


const searchInput =
    document.getElementById("notificationSearch");

const typeFilter =
    document.getElementById("notificationTypeFilter");

const statusFilter =
    document.getElementById("notificationStatusFilter");

if (!searchInput || !typeFilter || !statusFilter) {
    return;
}

const searchText =
    searchInput.value.toLowerCase();

const selectedType =
    typeFilter.value;

const selectedStatus =
    statusFilter.value;

const filtered =
    studentNotifications.filter(notification => {

        const matchesSearch =
            notification.title.toLowerCase().includes(searchText) ||
            notification.message.toLowerCase().includes(searchText) ||
            notification.type.toLowerCase().includes(searchText);

        const matchesType =
            selectedType === "All" ||
            notification.type === selectedType;

        const matchesStatus =
            selectedStatus === "All" ||
            (selectedStatus === "Read" && notification.read) ||
            (selectedStatus === "Unread" && !notification.read);

        return (
            matchesSearch &&
            matchesType &&
            matchesStatus
        );
    });

displayStudentNotifications(filtered);


}

/* Update summary cards */

function updateStudentNotificationSummary() {


const total =
    studentNotifications.length;

const unread =
    studentNotifications.filter(
        notification => !notification.read
    ).length;

const important =
    studentNotifications.filter(
        notification =>
            notification.priority === "Important" ||
            notification.priority === "High"
    ).length;

const today =
    new Date().toISOString().split("T")[0];

const todayCount =
    studentNotifications.filter(
        notification => notification.date === today
    ).length;

const totalElement =
    document.getElementById("notificationTotal");

const unreadElement =
    document.getElementById("notificationUnread");

const importantElement =
    document.getElementById("notificationImportant");

const todayElement =
    document.getElementById("notificationToday");

if (totalElement) {
    totalElement.textContent = total;
}

if (unreadElement) {
    unreadElement.textContent = unread;
}

if (importantElement) {
    importantElement.textContent = important;
}

if (todayElement) {
    todayElement.textContent = todayCount;
}


}

/* Update visible notification count */

function updateStudentNotificationCount(count) {


const label =
    document.getElementById("notificationCountLabel");

if (!label) return;

label.textContent =
    count === 1
        ? "1 notification"
        : `${count} notifications`;


}

/* Create notifications automatically from existing modules */

function generateAutomaticStudentNotifications() {


/*
   This connects the notification center
   with existing Campus ERP modules.
*/

const generated = [];


/* Assignment alerts */

if (typeof assignments !== "undefined") {

    assignments.forEach(assignment => {

        if (assignment.status === "Pending") {

            generated.push({
                id: "AUTO-" + assignment.id,
                title: assignment.title,
                message:
                    `${assignment.subject} assignment is due on ${assignment.dueDate}.`,
                type: "Assignment",
                priority: "Important",
                date: assignment.assignedDate,
                read: false
            });
        }
    });
}


/* Announcement alerts */

if (typeof announcements !== "undefined") {

    announcements.forEach(announcement => {

        generated.push({
            id: "AUTO-" + announcement.id,
            title: announcement.title,
            message: announcement.message,
            type: "Announcement",
            priority: announcement.priority,
            date: announcement.date,
            read: false
        });
    });
}


/* Add only notifications that do not already exist */

generated.forEach(newNotification => {

    const exists =
        studentNotifications.some(
            notification =>
                notification.id === newNotification.id
        );

    if (!exists) {
        studentNotifications.push(newNotification);
    }
});

saveStudentNotifications();


}

/* Initialize notification page */

document.addEventListener("DOMContentLoaded", function() {


if (
    document.getElementById(
        "studentNotificationList"
    )
) {

    generateAutomaticStudentNotifications();

    displayStudentNotifications();

    updateStudentNotificationSummary();
}


});

/* ==========================================
STUDENT PROFILE & SETTINGS
========================================== */

let currentStudentProfile =
JSON.parse(
localStorage.getItem("campusCurrentStudentProfile")
) || {
name: "Rahul Kumar",
studentId: "STU001",
email: "rahul@example.com",
department: "Computer Science",
semester: "3rd Semester",
password: "student123"
};

let studentPreferences =
JSON.parse(
localStorage.getItem("campusStudentPreferences")
) || {
announcements: true,
assignments: true,
exams: true,
fees: true
};

/* Save student profile */

function saveStudentProfile() {


localStorage.setItem(
    "campusCurrentStudentProfile",
    JSON.stringify(currentStudentProfile)
);


}

/* Display profile */

function displayStudentProfile() {


const name =
    document.getElementById("studentProfileName");

const studentId =
    document.getElementById("studentProfileId");

const email =
    document.getElementById("studentProfileEmail");

const department =
    document.getElementById("studentProfileDepartment");

const semester =
    document.getElementById("studentProfileSemester");

if (!name) return;

name.value = currentStudentProfile.name;
studentId.value = currentStudentProfile.studentId;
// Render plain email text: strip a markdown mailto link left
// by older stored data, e.g. "[a@b](mailto:a@b)" -> "a@b".
email.value = String(currentStudentProfile.email || "").replace(
    /^\[(.+?)\]\(mailto:[^)]+\)$/,
    "$1"
);
department.value = currentStudentProfile.department;
semester.value = currentStudentProfile.semester;


}

/* Update profile */

function updateStudentProfile(event) {


event.preventDefault();

currentStudentProfile.name =
    document.getElementById(
        "studentProfileName"
    ).value.trim();

currentStudentProfile.email =
    document.getElementById(
        "studentProfileEmail"
    ).value.trim();

currentStudentProfile.department =
    document.getElementById(
        "studentProfileDepartment"
    ).value.trim();

currentStudentProfile.semester =
    document.getElementById(
        "studentProfileSemester"
    ).value.trim();

saveStudentProfile();

alert("Profile updated successfully.");


}

/* Change password */

function changeStudentPassword(event) {


event.preventDefault();

const currentPassword =
    document.getElementById(
        "currentStudentPassword"
    ).value;

const newPassword =
    document.getElementById(
        "newStudentPassword"
    ).value;

const confirmPassword =
    document.getElementById(
        "confirmStudentPassword"
    ).value;


if (
    currentPassword !==
    currentStudentProfile.password
) {

    alert("Current password is incorrect.");
    return;
}


if (newPassword !== confirmPassword) {

    alert("New passwords do not match.");
    return;
}


if (newPassword.length < 6) {

    alert(
        "Password must contain at least 6 characters."
    );

    return;
}


currentStudentProfile.password =
    newPassword;

saveStudentProfile();


document.getElementById(
    "currentStudentPassword"
).value = "";

document.getElementById(
    "newStudentPassword"
).value = "";

document.getElementById(
    "confirmStudentPassword"
).value = "";


alert("Password changed successfully.");


}

/* Load notification preferences */

function loadStudentPreferences() {


const announcements =
    document.getElementById(
        "prefAnnouncements"
    );

const assignments =
    document.getElementById(
        "prefAssignments"
    );

const exams =
    document.getElementById(
        "prefExams"
    );

const fees =
    document.getElementById(
        "prefFees"
    );


if (!announcements) return;


announcements.checked =
    studentPreferences.announcements;

assignments.checked =
    studentPreferences.assignments;

exams.checked =
    studentPreferences.exams;

fees.checked =
    studentPreferences.fees;


}

/* Save preferences */

function saveStudentPreferences() {


const announcements =
    document.getElementById(
        "prefAnnouncements"
    );

const assignments =
    document.getElementById(
        "prefAssignments"
    );

const exams =
    document.getElementById(
        "prefExams"
    );

const fees =
    document.getElementById(
        "prefFees"
    );


if (!announcements) return;


studentPreferences = {

    announcements:
        announcements.checked,

    assignments:
        assignments.checked,

    exams:
        exams.checked,

    fees:
        fees.checked
};


localStorage.setItem(
    "campusStudentPreferences",
    JSON.stringify(studentPreferences)
);


}

/* Initialize settings page */

document.addEventListener(
"DOMContentLoaded",
function() 
{
    if (
        document.getElementById(
            "studentProfileName"
        )
    ) {

        displayStudentProfile();

        loadStudentPreferences();
    }

}


);
/* ==========================================
CAMPUS ERP AUTHENTICATION & SESSION
========================================== */

/*
Get currently logged-in user.
*/

function getCurrentUser() {

try {

    const raw =
        localStorage.getItem("campusSession");

    if (!raw) {
        return null;
    }

    return JSON.parse(raw);

} catch (e) {

    return null;
}

}

/* Role guard: only Admin may delete entries. Students (and Faculty)
   get view-only management tables: they may create their own
   requests/complaints/certificates/feedback/queries, but must never
   Delete/Approve/Reject/Issue/Resolve records. Vanilla JS, try/catch,
   never throws on a missing session. Admin flow unchanged. */
function getSessionRoleSafe() {
try {
    var session = null;
    try { session = getCurrentUser(); } catch (e) { session = null; }
    if (!session || typeof session !== "object") {
        try { session = JSON.parse(localStorage.getItem("campusSession")); } catch (e) { session = null; }
    }
    return (session && session.role) || "";
} catch (e) { return ""; }
}

/*
Role-aware Dashboard home links for static sidebars.
Dynamic pages (campus-sidebar.js placeholder) already render a
role-correct Dashboard href. Hardcoded asides (notifications, ...)
cannot: their Dashboard anchor is fixed markup,
so an Admin opening a co-allowed page (e.g. notifications.html)
would click Dashboard and land on the wrong
campus panel. Any anchor marked data-dashboard-home gets its href
rewritten to the current role's dashboard. Unknown/missing role:
markup default is kept, so no-JS and Guest behavior is unchanged.
Active-highlight classes are untouched.
*/

function dashboardHomeForRole(role) {

if (role === "Admin") {
    return "admin-dashboard.html";
}

if (role === "Faculty") {
    return "faculty-dashboard.html";
}

if (role === "Student") {
    return "student-dashboard.html";
}

return "";

}

function applyRoleDashboardLinks() {

try {

    var role = "";

    try {
        role = getSessionRoleSafe();
    } catch (e) {
        role = "";
    }

    var home = dashboardHomeForRole(role);

    if (!home) {
        return;
    }

    var links =
        document.querySelectorAll(
            "a[data-dashboard-home]"
        );

    for (var i = 0; i < links.length; i++) {
        try {
            links[i].setAttribute("href", home);
        } catch (e) {}
    }

} catch (e) {}

}
function canDeleteEntries() {
try { return getSessionRoleSafe() === "Admin"; } catch (e) { return false; }
}
/* Optional i18nKey lets a caller supply its own dictionary key so the
   denial alert follows the page language (see timetableMsg). Callers
   that pass nothing keep the original English text verbatim. */
function requireDeleteAdmin(i18nKey) {
try { if (canDeleteEntries()) return true; } catch (e) {}
try {
var msg = "Only Admin can delete.";
if (i18nKey && typeof timetableMsg === "function") msg = timetableMsg(i18nKey, msg);
alert(msg);
} catch (e) {}
return false;
}
/*
Check whether a user is logged in.
*/

function isLoggedIn() {

const session = getCurrentUser();

return session !== null;

}

/*
Protect a page by role.
*/

function requireRole(allowedRoles) {

const session = getCurrentUser();


/*
    No active session (or session without a role).
*/

if (
    !session ||
    typeof session !== "object" ||
    !session.role
) {

    window.location.href = "index.html";

    return false;
}


/*
    User does not have permission.
*/

if (
    !allowedRoles.includes(
        session.role
    )
) {

    alert(
        "You do not have permission to access this page."
    );


    if (session.role === "Admin") {

        window.location.href =
            "admin-dashboard.html";

    }

    else if (session.role === "Faculty") {

        window.location.href =
            "faculty-dashboard.html";

    }

    else {

        window.location.href =
            "student-dashboard.html";
    }


    return false;
}


return true;

}

/*
Logout.
*/

function logout() {

if (!confirm("Are you sure you want to log out?")) {
    return;
}

localStorage.removeItem(
    "campusSession"
);

window.location.href =
    "index.html";

}

/*
Protect all major pages automatically.
*/

function protectCurrentPage() {

const page =
    window.location.pathname
        .split("/")
        .pop()
        .toLowerCase();


/*
    Login page does not require authentication.
*/

if (
    page === "" ||
    page === "index.html"
) {

    return;
}


/*
    Role map: every protected page lists every role
    allowed to open it.

    Shared academic pages (timetable, attendance,
    assignments, fees, examinations, announcements)
    and hub pages (requests, certificates, complaints,
    mess) allow Admin, Faculty and Student, so no role
    is bounced to its dashboard when opening them.
*/

const pageRoles = {

    /* Admin-only pages. Students/courses stay readable by Faculty
       (faculty-dashboard links "My Students"/"My Subjects" here);
       all Delete actions on those pages remain Admin-gated via
       canDeleteEntries()/requireDeleteAdmin(). */
    "admin-dashboard.html": ["Admin"],
    "students.html": ["Admin", "Faculty"],
    "faculty.html": ["Admin"],
    "courses.html": ["Admin", "Faculty"],
    "users.html": ["Admin"],
    "reports.html": ["Admin"],
    "hostel.html": ["Admin"],
    "transport.html": ["Admin"],
    "library.html": ["Admin"],

    /* Read-only analytics view. Ops Insights is aggregate +
       non-mutating, and the Student/Faculty sidebars link to it
       (STUDENT_NAV -> ops-dashboard.html), so it must be
       openable by every role or those links bounce the user
       back to their own dashboard. Admin-only action controls
       inside the page are gated at render time instead. */
    "ops-dashboard.html": ["Admin", "Faculty", "Student"],

    /* Shared academic pages. */
    "timetable.html": ["Admin", "Faculty", "Student"],
    "attendance.html": ["Admin", "Faculty", "Student"],
    "assignments.html": ["Admin", "Faculty", "Student"],
    "fees.html": ["Admin", "Faculty", "Student"],
    "examinations.html": ["Admin", "Faculty", "Student"],
    "announcements.html": ["Admin", "Faculty", "Student"],

    /* Hub / service pages. */
    "requests.html": ["Admin", "Faculty", "Student"],
    "certificates.html": ["Admin", "Faculty", "Student"],
    "complaints.html": ["Admin", "Faculty", "Student"],
    "mess.html": ["Admin", "Faculty", "Student"],

    /* Dashboards / personal pages. */
    "faculty-dashboard.html": ["Faculty", "Admin"],
    "student-dashboard.html": ["Student", "Admin"],
    "student-settings.html": ["Student", "Admin"],
    "notifications.html": ["Student", "Admin"],
    "notifications.htm": ["Student", "Admin"]

};


const allowedRoles = pageRoles[page];

if (allowedRoles) {

    requireRole(allowedRoles);

    return;
}


/*
    Fallback: any other app page requires a login
    (any role), so newly added pages are never
    accidentally public.
*/

if (
    page.endsWith(".html") ||
    page.endsWith(".htm")
) {

    requireRole(["Admin", "Faculty", "Student"]);

    return;
}

}

/*
Display current user information
wherever elements exist.
*/

function displayCurrentUser() {

const session =
    getCurrentUser();


if (!session) {
    return;
}


const nameElements =
    document.querySelectorAll(
        ".current-user-name"
    );


nameElements.forEach(element => {

    element.textContent =
        session.name;

});


const roleElements =
    document.querySelectorAll(
        ".current-user-role"
    );


roleElements.forEach(element => {

    element.textContent =
        session.role;

});


const idElements =
    document.querySelectorAll(
        ".current-user-id"
    );


idElements.forEach(element => {

    element.textContent =
        session.userId;

});

}

/*
Automatically protect pages.
*/

document.addEventListener(
"DOMContentLoaded",
function() {


    protectCurrentPage();

    displayCurrentUser();

    applyRoleDashboardLinks();

}


);

/* ==========================================
SIDEBAR SCROLL PRESERVATION (admin + dashboards)
Root cause: sidebar nav is multi-page (each link
loads a new document), so .admin-menu scrollTop
naturally resets to 0 and bottom items (Reports /
User Management) arrive out of view. No JS was
calling window.scrollTo/focus; courses.html
scrollIntoView only targets main sections.
Fix: persist the menu scrollTop in sessionStorage
(per tab) and, on load, restore it then nudge the
active entry into view with menu-only math (never
window scroll, so the page position is untouched).
Vanilla only. IDs/handlers untouched.
========================================== */

(function () {

var SCROLL_KEY = "campusSidebarScrollTop";

var MENU_SELECTOR = ".admin-menu, .dashboard-menu, .faculty-menu";

function getMenu() {
    return document.querySelector(MENU_SELECTOR);
}

function readSaved() {
    try {
        var raw = sessionStorage.getItem(SCROLL_KEY);
        if (raw === null) return null;
        var value = parseInt(raw, 10);
        return isNaN(value) ? null : value;
    } catch (e) {
        return null;
    }
}

function saveScrollTop(value) {
    try {
        sessionStorage.setItem(SCROLL_KEY, String(value));
    } catch (e) {
    }
}

/*
Keep the active entry visible using only the
menu's own scrollTop. getBoundingClientRect math
avoids offsetParent pitfalls and never moves
window.scrollY.
*/

function ensureActiveVisible(menu) {
    var active =
        menu.querySelector("li.active") ||
        menu.querySelector("a.active") ||
        menu.querySelector("a[aria-current='page']");

    if (!active) return;

    var menuRect = menu.getBoundingClientRect();
    var elRect = active.getBoundingClientRect();

    if (elRect.top < menuRect.top) {
        menu.scrollTop -= (menuRect.top - elRect.top + 8);
    } else if (elRect.bottom > menuRect.bottom) {
        menu.scrollTop += (elRect.bottom - menuRect.bottom + 8);
    }
}

document.addEventListener("DOMContentLoaded", function () {

    var menu = getMenu();

    if (!menu) return;

    var saved = readSaved();

    if (saved !== null && saved >= 0) {
        menu.scrollTop = saved;
    }

    ensureActiveVisible(menu);

    var ticking = false;

    menu.addEventListener("scroll", function () {
        if (ticking) return;
        ticking = true;

        var update = function () {
            saveScrollTop(menu.scrollTop);
            ticking = false;
        };

        if (typeof requestAnimationFrame === "function") {
            requestAnimationFrame(update);
        } else {
            update();
        }
    }, { passive: true });

    menu.addEventListener("click", function () {
        saveScrollTop(menu.scrollTop);
    });

});

function persistOnLeave() {
    var menu = getMenu();
    if (menu) saveScrollTop(menu.scrollTop);
}

window.addEventListener("pagehide", persistOnLeave);
window.addEventListener("beforeunload", persistOnLeave);

})();



/* =====================================
   TYPE/A11Y fallback (vanilla, additive)
   1. setLanguage fallback for pages without campus-hub.js:
      sets document.documentElement.lang (en/hi) so the
      :lang(hi) font/line-height rules pick correctly.
      Same localStorage key ("campusLang") as campus-hub.js;
      hub pages overwrite this with the full i18n version.
   2. Escape: closes the open <details> containing focus
      (e.g. Backend connection) and returns focus safely.
      Tab/Enter remain native (links/buttons/selects).
   IDs/handlers untouched.
   ===================================== */
(function () {
    "use strict";
    if (typeof window.setLanguage !== "function") {
        window.setLanguage = function (lang) {
            lang = (lang === "hi") ? "hi" : "en";
            // Same bare-string shape as campus-hub.js ("campusLang").
            try { localStorage.setItem("campusLang", lang); } catch (e) {}
            try { document.documentElement.lang = lang; } catch (e) {}
            try {
                var s = document.getElementById("langSelect");
                if (s && s.value !== lang) s.value = lang;
            } catch (e) {}
        };
    }
    function applyStoredLang() {
        var lang = "en";
        try {
            var raw = localStorage.getItem("campusLang");
            if (raw) {
                try { lang = JSON.parse(raw); } catch (e) { lang = raw; }
                lang = String(lang).replace(/[^a-z]/gi, "").toLowerCase() === "hi" ? "hi" : "en";
            }
        } catch (e) {}
        try { document.documentElement.lang = lang; } catch (e) {}
        try {
            var s = document.getElementById("langSelect");
            if (s && !s.value) s.value = lang;
        } catch (e) {}
    }
    document.addEventListener("keydown", function (ev) {
        if (!ev || ev.key !== "Escape") return;
        var active = document.activeElement;
        var open = active && active.closest
            ? active.closest("details[open]")
            : null;
        if (open) {
            open.removeAttribute("open");
            if (active && active.blur) { try { active.blur(); } catch (e) {} }
            try {
                var sum = open.querySelector("summary");
                if (sum && sum.focus) sum.focus({ preventScroll: true });
            } catch (e) {}
        } else if (active && active.blur && active !== document.body) {
            try { active.blur(); } catch (e) {}
        }
    });
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", applyStoredLang);
    } else {
        applyStoredLang();
    }
})();

/* =====================================
   THEME fallback (vanilla, additive)
   getTheme/applyTheme/toggleTheme for pages without campus-hub.js.
   Same localStorage key ("campusTheme") and same semantics as
   campus-hub.js: stored choice wins, else OS prefers-color-scheme,
   else light. Sets body.dark-mode / body.light-mode so the
   prefers-color-scheme: dark blocks in style.css cannot keep a
   light-mode page dark. campus-hub.js loads after script.js and
   overwrites these with its identical versions on hub pages.
   IDs/handlers untouched.
   ===================================== */
(function () {
    "use strict";
    function readStoredTheme() {
        try {
            var s = localStorage.getItem("campusTheme");
            if (s === "dark" || s === "light") return s;
        } catch (e) {}
        return null;
    }
    if (typeof window.getTheme !== "function") {
        window.getTheme = function () {
            var stored = readStoredTheme();
            if (stored) return stored;
            try {
                if (window.matchMedia &&
                    window.matchMedia("(prefers-color-scheme: dark)").matches) {
                    return "dark";
                }
            } catch (e) {}
            return "light";
        };
    }
    if (typeof window.applyTheme !== "function") {
        window.applyTheme = function () {
            var dark = window.getTheme() === "dark";
            try {
                document.body.classList.toggle("dark-mode", dark);
                document.body.classList.toggle("light-mode", !dark);
            } catch (e) {}
            try {
                var b = document.getElementById("themeToggle");
                var MOON_SVG = '<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>'; var SUN_SVG = '<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41"/></svg>';
                if (b) b.innerHTML = dark ? SUN_SVG + "<span>Light</span>" : MOON_SVG + "<span>Dark</span>";
            } catch (e) {}
        };
    }
    if (typeof window.toggleTheme !== "function") {
        window.toggleTheme = function () {
            var next = window.getTheme() === "dark" ? "light" : "dark";
            try { localStorage.setItem("campusTheme", next); } catch (e) {}
            window.applyTheme();
        };
    }
    if (typeof window.applyLiteMode !== "function") {
        window.applyLiteMode = function () {
            try { window.applyTheme(); } catch (e) {}
        };
    }
    if (typeof window.toggleLiteMode !== "function") {
        window.toggleLiteMode = function () {
            try { window.toggleTheme(); } catch (e) {}
        };
    }
    function applyStoredTheme() {
        try { window.applyTheme(); } catch (e) {}
    }
    try {
        if (document.body) applyStoredTheme();
    } catch (e) {}
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", applyStoredTheme);
    } else {
        applyStoredTheme();
    }
})();

/* =========================
   PAGE-OPEN ANIM STAGGER (additive, guarded)
   Sets --rise-delay per card index (capped) so
   .management-card / .admin-card rise in sequence.
   IDs/handlers untouched; reduced-motion respected.
   ========================= */
(function () {
    if (window.__campusPageAnimDone) return;
    window.__campusPageAnimDone = true;
    function initPageAnim() {
        try {
            if (
                window.matchMedia &&
                window.matchMedia("(prefers-reduced-motion: reduce)").matches
            ) {
                return;
            }
            var cards = document.querySelectorAll(
                ".management-card, .admin-card, .admin-section"
            );
            if (!cards || !cards.length) return;
            var seenParents = [];
            cards.forEach(function (el) {
                try {
                    var parent = el.parentElement;
                    var idx = seenParents.indexOf(parent);
                    var group = 0;
                    if (idx === -1) {
                        seenParents.push(parent);
                    }
                    var siblings = parent
                        ? parent.querySelectorAll(
                              ":scope > .management-card, :scope > .admin-card, :scope > .admin-section"
                          )
                        : [];
                    for (var i = 0; i < siblings.length; i++) {
                        if (siblings[i] === el) {
                            group = i;
                            break;
                        }
                    }
                    var delay = Math.min(group * 45, 135);
                    el.style.setProperty("--rise-delay", delay + "ms");
                } catch (e) {}
            });
        } catch (e) {}
    }
    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initPageAnim);
    } else {
        initPageAnim();
    }
})();

/* =========================
   Reports refresh feedback (additive, guarded)
   Wraps generateReports(): button loading state
   (spinner/disabled + "Refreshing..." ~600ms),
   then cards flash + "Reports updated" toast.
   IDs/handlers untouched; reduced-motion respected.
   ========================= */
(function () {
    if (window.__reportsRefreshFeedbackDone) return;
    window.__reportsRefreshFeedbackDone = true;
    var orig = window.generateReports;
    if (typeof orig !== "function") return;
    var firstRun = true;
    function reducedMotion() {
        try {
            return (
                window.matchMedia &&
                window.matchMedia(
                    "(prefers-reduced-motion: reduce)"
                ).matches
            );
        } catch (e) {
            return false;
        }
    }
    function ensureToast() {
        var t = document.getElementById("reportsToast");
        if (t) return t;
        t = document.createElement("div");
        t.id = "reportsToast";
        t.setAttribute("role", "status");
        t.setAttribute("aria-live", "polite");
        document.body.appendChild(t);
        return t;
    }
    function showToast(msg) {
        try {
            var t = ensureToast();
            t.textContent = msg;
            t.classList.add("show");
            clearTimeout(t.__hideTimer);
            t.__hideTimer = setTimeout(function () {
                t.classList.remove("show");
            }, 2000);
        } catch (e) {}
    }
    window.generateReports = function () {
        var ctx = this;
        var args = arguments;
        if (firstRun) {
            firstRun = false;
            return orig.apply(ctx, args);
        }
        var btn = document.querySelector(".report-refresh button");
        if (!btn || btn.disabled || btn.dataset.refreshing === "1") {
            if (btn && btn.dataset.refreshing === "1") return;
            return orig.apply(ctx, args);
        }
        btn.dataset.refreshing = "1";
        var originalHTML = btn.innerHTML;
        var reduced = reducedMotion();
        var duration = reduced ? 60 : 600;
        btn.disabled = true;
        btn.setAttribute("aria-busy", "true");
        btn.classList.add("is-refreshing");
        btn.innerHTML =
            '<span class="btn-spinner" aria-hidden="true"></span>' +
            "<span>Refreshing...</span>";
        setTimeout(function () {
            try {
                orig.apply(ctx, args);
            } finally {
                btn.disabled = false;
                btn.removeAttribute("aria-busy");
                btn.classList.remove("is-refreshing");
                btn.innerHTML = originalHTML;
                delete btn.dataset.refreshing;
                if (!reduced) {
                    try {
                        var cards = document.querySelectorAll(
                            ".report-card, .analytics-card"
                        );
                        cards.forEach(function (c) {
                            c.classList.remove("reports-flash");
                            void c.offsetWidth;
                            c.classList.add("reports-flash");
                        });
                        setTimeout(function () {
                            cards.forEach(function (c) {
                                c.classList.remove("reports-flash");
                            });
                        }, 650);
                    } catch (e) {}
                }
                showToast("Reports updated");
            }
        }, duration);
    };
})();
