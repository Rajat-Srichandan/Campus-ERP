/* =====================================================
   SEED 05 - LIBRARY + HOSTEL + TRANSPORT
   Vanilla IIFE. Keeps existing localStorage entries and
   tops collections up to target counts. Safe to re-run.
   Keys/shapes mirror script.js:
     campusLibraryBooks      [{id,title,author,isbn,category,quantity,available}]
     campusIssuedBooks        [{id,bookId,bookTitle,studentName,studentId,issueDate,dueDate,returned}]
     campusHostelRooms        [{id,block,room,type,capacity}]
     campusHostelAllocations  [{id,roomId,studentName,studentId,department,allocationDate}]
     campusTransportBuses     [{id,number,registration,route,capacity,driver,phone}]
     campusTransportRoutes    [{id,name,start,stops,end}]
     campusTransportAllocations [{studentName,studentId,department,busId,pickup}]
   ===================================================== */
(function () {
    "use strict";

    function load(key) {
        try {
            var raw = localStorage.getItem(key);
            if (!raw) return null;
            var val = JSON.parse(raw);
            return Array.isArray(val) ? val : null;
        } catch (e) {
            return null;
        }
    }

    function save(key, val) {
        try {
            localStorage.setItem(key, JSON.stringify(val));
        } catch (e) { /* storage full/blocked: keep in-memory */ }
    }

    function hasId(list, id) {
        return list.some(function (x) { return x && x.id === id; });
    }

    function nextNumericId(list, startAt) {
        var max = startAt - 1;
        list.forEach(function (x) {
            if (x && typeof x.id === "number" && x.id >= max) max = x.id + 1;
        });
        return max;
    }

    /* ================= LIBRARY: BOOKS (target 30) ================= */

    var defaultBooks = [
        { id: "BK001", title: "Data Structures and Algorithms", author: "Narasimha Karumanchi", isbn: "9788193245279", category: "Computer Science", quantity: 5, available: 4 },
        { id: "BK002", title: "Database System Concepts", author: "Abraham Silberschatz", isbn: "9780078022159", category: "Database", quantity: 4, available: 4 },
        { id: "BK003", title: "Engineering Mechanics", author: "R.K. Bansal", isbn: "9788131808296", category: "Engineering", quantity: 6, available: 6 }
    ];

    var extraBooks = [
        { id: "BK004", title: "Operating System Concepts", author: "Abraham Silberschatz", isbn: "9781118063330", category: "Computer Science", quantity: 6, available: 6 },
        { id: "BK005", title: "Computer Networks", author: "Andrew S. Tanenbaum", isbn: "9780132126953", category: "Computer Science", quantity: 5, available: 5 },
        { id: "BK006", title: "Introduction to Algorithms", author: "Thomas H. Cormen", isbn: "9780262033848", category: "Computer Science", quantity: 4, available: 3 },
        { id: "BK007", title: "Artificial Intelligence: A Modern Approach", author: "Stuart Russell", isbn: "9780136042594", category: "Computer Science", quantity: 3, available: 2 },
        { id: "BK008", title: "Machine Learning", author: "Tom M. Mitchell", isbn: "9780070428072", category: "Computer Science", quantity: 4, available: 4 },
        { id: "BK009", title: "Compilers: Principles, Techniques and Tools", author: "Alfred V. Aho", isbn: "9780321486813", category: "Computer Science", quantity: 3, available: 3 },
        { id: "BK010", title: "Database Management Systems", author: "Raghu Ramakrishnan", isbn: "9780072465631", category: "Information Technology", quantity: 5, available: 4 },
        { id: "BK011", title: "Software Engineering: A Practitioner's Approach", author: "Roger S. Pressman", isbn: "9780073375977", category: "Information Technology", quantity: 5, available: 5 },
        { id: "BK012", title: "Cloud Computing: Principles and Paradigms", author: "Rajkumar Buyya", isbn: "9780470887998", category: "Information Technology", quantity: 4, available: 3 },
        { id: "BK013", title: "Cryptography and Network Security", author: "William Stallings", isbn: "9780134444284", category: "Information Technology", quantity: 4, available: 4 },
        { id: "BK014", title: "Data Mining: Concepts and Techniques", author: "Jiawei Han", isbn: "9780123814791", category: "Information Technology", quantity: 3, available: 3 },
        { id: "BK015", title: "Thermodynamics: An Engineering Approach", author: "Yunus Cengel", isbn: "9780073398174", category: "Mechanical", quantity: 6, available: 6 },
        { id: "BK016", title: "Fluid Mechanics", author: "Frank White", isbn: "9780073398273", category: "Mechanical", quantity: 5, available: 4 },
        { id: "BK017", title: "Theory of Machines", author: "S. S. Rattan", isbn: "9780070144774", category: "Mechanical", quantity: 4, available: 4 },
        { id: "BK018", title: "Manufacturing Science", author: "Amitabha Ghosh", isbn: "9788120307083", category: "Mechanical", quantity: 4, available: 4 },
        { id: "BK019", title: "Heat and Mass Transfer", author: "C. P. Kothandaraman", isbn: "9788122428751", category: "Mechanical", quantity: 3, available: 3 },
        { id: "BK020", title: "Electrical Machines", author: "P. S. Bimbhra", isbn: "9788174091734", category: "Electrical", quantity: 5, available: 5 },
        { id: "BK021", title: "Power System Engineering", author: "D. P. Kothari", isbn: "9788120336470", category: "Electrical", quantity: 4, available: 3 },
        { id: "BK022", title: "Control Systems Engineering", author: "Norman Nise", isbn: "9781118170519", category: "Electrical", quantity: 3, available: 3 },
        { id: "BK023", title: "Digital Design", author: "M. Morris Mano", isbn: "9780132774208", category: "Electrical", quantity: 5, available: 5 },
        { id: "BK024", title: "Structural Analysis", author: "R. C. Hibbeler", isbn: "9780134552238", category: "Civil", quantity: 5, available: 4 },
        { id: "BK025", title: "Concrete Technology", author: "M. S. Shetty", isbn: "9788122600083", category: "Civil", quantity: 4, available: 4 },
        { id: "BK026", title: "Surveying (Vol. 1)", author: "B. C. Punmia", isbn: "9788170088530", category: "Civil", quantity: 4, available: 4 },
        { id: "BK027", title: "Principles of Management", author: "Harold Koontz", isbn: "9780070581428", category: "Management", quantity: 5, available: 4 },
        { id: "BK028", title: "Marketing Management", author: "Philip Kotler", isbn: "9780134086467", category: "Management", quantity: 4, available: 4 },
        { id: "BK029", title: "Financial Accounting", author: "S. N. Maheshwari", isbn: "9788125931485", category: "Management", quantity: 5, available: 5 },
        { id: "BK030", title: "Business Statistics", author: "Richard Levin", isbn: "9780130717460", category: "Management", quantity: 3, available: 3 }
    ];

    var books = load("campusLibraryBooks");
    var booksWasMissing = !books || books.length === 0;
    if (booksWasMissing) books = defaultBooks.slice();
    var booksAdded = 0;
    extraBooks.forEach(function (b) {
        if (!hasId(books, b.id)) { books.push(b); booksAdded++; }
    });
    /* Perf: skip rewrite when nothing changed (was unconditional). */
    if (booksWasMissing || booksAdded > 0) save("campusLibraryBooks", books);

    /* ================= LIBRARY: ISSUED (some copies out) ================= */

    var defaultIssues = [
        { id: 1, bookId: "BK001", bookTitle: "Data Structures and Algorithms", studentName: "Rahul Kumar", studentId: "STU001", issueDate: "2026-09-25", dueDate: "2026-10-09", returned: false }
    ];

    var extraIssues = [
        { bookId: "BK006", bookTitle: "Introduction to Algorithms", studentName: "Anjali Patel", studentId: "STU006", issueDate: "2026-09-26", dueDate: "2026-10-10", returned: false },
        { bookId: "BK007", bookTitle: "Artificial Intelligence: A Modern Approach", studentName: "Rahul Kumar", studentId: "STU001", issueDate: "2026-09-26", dueDate: "2026-10-10", returned: false },
        { bookId: "BK010", bookTitle: "Database Management Systems", studentName: "Priya Sharma", studentId: "STU002", issueDate: "2026-09-27", dueDate: "2026-10-11", returned: false },
        { bookId: "BK012", bookTitle: "Cloud Computing: Principles and Paradigms", studentName: "Pooja Nayak", studentId: "STU008", issueDate: "2026-09-27", dueDate: "2026-10-11", returned: false },
        { bookId: "BK016", bookTitle: "Fluid Mechanics", studentName: "Aman Das", studentId: "STU003", issueDate: "2026-09-28", dueDate: "2026-10-12", returned: false },
        { bookId: "BK021", bookTitle: "Power System Engineering", studentName: "Sneha Mishra", studentId: "STU004", issueDate: "2026-09-28", dueDate: "2026-10-12", returned: false },
        { bookId: "BK024", bookTitle: "Structural Analysis", studentName: "Vikash Singh", studentId: "STU005", issueDate: "2026-09-29", dueDate: "2026-10-13", returned: false },
        { bookId: "BK027", bookTitle: "Principles of Management", studentName: "Rohit Verma", studentId: "STU007", issueDate: "2026-09-29", dueDate: "2026-10-13", returned: false }
    ];

    var issues = load("campusIssuedBooks");
    var issuesWasMissing = !issues || issues.length === 0;
    if (issuesWasMissing) issues = defaultIssues.slice();
    var issueId = nextNumericId(issues, 2);
    var issuesAdded = 0;
    extraIssues.forEach(function (rec) {
        var dup = issues.some(function (x) {
            return x && x.bookId === rec.bookId && x.studentId === rec.studentId && !x.returned;
        });
        if (dup) return;
        var book = null;
        books.forEach(function (b) { if (b.id === rec.bookId) book = b; });
        if (!book || book.available <= 0) return;
        issues.push({
            id: issueId++,
            bookId: rec.bookId,
            bookTitle: book.title,
            studentName: rec.studentName,
            studentId: rec.studentId,
            issueDate: rec.issueDate,
            dueDate: rec.dueDate,
            returned: false
        });
        issuesAdded++;
        book.available -= 1;
    });
    /* Perf: skip rewrite when nothing changed (was unconditional).
       Second books save persists the decremented `available` counts. */
    if (issuesWasMissing || issuesAdded > 0) save("campusIssuedBooks", issues);
    if (booksWasMissing || booksAdded > 0 || issuesAdded > 0) save("campusLibraryBooks", books);

    /* ================= HOSTEL: ROOMS (target 20) ================= */

    var defaultRooms = [
        { id: "ROOM001", block: "Block A", room: "101", type: "Double", capacity: 2 },
        { id: "ROOM002", block: "Block A", room: "102", type: "Triple", capacity: 3 },
        { id: "ROOM003", block: "Block B", room: "201", type: "Double", capacity: 2 },
        { id: "ROOM004", block: "Block B", room: "202", type: "Four Bed", capacity: 4 }
    ];

    var extraRooms = [
        { id: "ROOM005", block: "BH-1", room: "101", type: "Double", capacity: 2 },
        { id: "ROOM006", block: "BH-1", room: "102", type: "Triple", capacity: 3 },
        { id: "ROOM007", block: "BH-1", room: "103", type: "Double", capacity: 2 },
        { id: "ROOM008", block: "BH-1", room: "104", type: "Four Bed", capacity: 4 },
        { id: "ROOM009", block: "BH-1", room: "105", type: "Single", capacity: 1 },
        { id: "ROOM010", block: "BH-1", room: "106", type: "Double", capacity: 2 },
        { id: "ROOM011", block: "BH-2", room: "201", type: "Triple", capacity: 3 },
        { id: "ROOM012", block: "BH-2", room: "202", type: "Double", capacity: 2 },
        { id: "ROOM013", block: "BH-2", room: "203", type: "Single", capacity: 1 },
        { id: "ROOM014", block: "BH-2", room: "204", type: "Four Bed", capacity: 4 },
        { id: "ROOM015", block: "BH-2", room: "205", type: "Double", capacity: 2 },
        { id: "ROOM016", block: "GH-1", room: "101", type: "Double", capacity: 2 },
        { id: "ROOM017", block: "GH-1", room: "102", type: "Triple", capacity: 3 },
        { id: "ROOM018", block: "GH-1", room: "103", type: "Single", capacity: 1 },
        { id: "ROOM019", block: "GH-1", room: "104", type: "Double", capacity: 2 },
        { id: "ROOM020", block: "GH-1", room: "105", type: "Triple", capacity: 3 }
    ];

    var rooms = load("campusHostelRooms");
    var roomsWasMissing = !rooms || rooms.length === 0;
    if (roomsWasMissing) rooms = defaultRooms.slice();
    var roomsAdded = 0;
    extraRooms.forEach(function (r) {
        if (!hasId(rooms, r.id)) { rooms.push(r); roomsAdded++; }
    });
    /* Perf: skip rewrite when nothing changed (was unconditional). */
    if (roomsWasMissing || roomsAdded > 0) save("campusHostelRooms", rooms);

    /* ================= HOSTEL: ALLOCATIONS ================= */

    var defaultHostelAllocs = [
        { id: 1, roomId: "ROOM001", studentName: "Rahul Kumar", studentId: "STU001", department: "Computer Science", allocationDate: "2026-09-20" },
        { id: 2, roomId: "ROOM001", studentName: "Aman Das", studentId: "STU003", department: "Mechanical Engineering", allocationDate: "2026-09-21" }
    ];

    var extraHostelAllocs = [
        { roomId: "ROOM002", studentName: "Priya Sharma", studentId: "STU002", department: "Information Technology", allocationDate: "2026-09-21" },
        { roomId: "ROOM002", studentName: "Sneha Mishra", studentId: "STU004", department: "Electrical Engineering", allocationDate: "2026-09-22" },
        { roomId: "ROOM002", studentName: "Anjali Patel", studentId: "STU006", department: "Computer Science", allocationDate: "2026-09-22" },
        { roomId: "ROOM003", studentName: "Vikash Singh", studentId: "STU005", department: "Civil Engineering", allocationDate: "2026-09-23" },
        { roomId: "ROOM003", studentName: "Rohit Verma", studentId: "STU007", department: "Management", allocationDate: "2026-09-23" },
        { roomId: "ROOM004", studentName: "Pooja Nayak", studentId: "STU008", department: "Information Technology", allocationDate: "2026-09-24" },
        { roomId: "ROOM004", studentName: "Karan Malhotra", studentId: "STU009", department: "Mechanical Engineering", allocationDate: "2026-09-24" },
        { roomId: "ROOM004", studentName: "Divya Reddy", studentId: "STU010", department: "Electrical Engineering", allocationDate: "2026-09-25" },
        { roomId: "ROOM004", studentName: "Suresh Yadav", studentId: "STU011", department: "Civil Engineering", allocationDate: "2026-09-25" },
        { roomId: "ROOM005", studentName: "Neha Gupta", studentId: "STU012", department: "Computer Science", allocationDate: "2026-09-26" },
        { roomId: "ROOM005", studentName: "Arjun Nair", studentId: "STU013", department: "Management", allocationDate: "2026-09-26" },
        { roomId: "ROOM006", studentName: "Kavya Iyer", studentId: "STU014", department: "Information Technology", allocationDate: "2026-09-27" },
        { roomId: "ROOM006", studentName: "Mohit Joshi", studentId: "STU015", department: "Mechanical Engineering", allocationDate: "2026-09-27" }
    ];

    var hostelAllocs = load("campusHostelAllocations");
    var hostelWasMissing = !hostelAllocs || hostelAllocs.length === 0;
    if (hostelWasMissing) hostelAllocs = defaultHostelAllocs.slice();
    var allocId = nextNumericId(hostelAllocs, 3);
    var hostelAdded = 0;
    extraHostelAllocs.forEach(function (rec) {
        var already = hostelAllocs.some(function (a) { return a && a.studentId === rec.studentId; });
        if (already) return;
        var room = null;
        rooms.forEach(function (r) { if (r.id === rec.roomId) room = r; });
        if (!room) return;
        var occupied = hostelAllocs.filter(function (a) { return a && a.roomId === rec.roomId; }).length;
        if (occupied >= room.capacity) return;
        hostelAllocs.push({
            id: allocId++,
            roomId: rec.roomId,
            studentName: rec.studentName,
            studentId: rec.studentId,
            department: rec.department,
            allocationDate: rec.allocationDate
        });
        hostelAdded++;
    });
    /* Perf: skip rewrite when nothing changed (was unconditional). */
    if (hostelWasMissing || hostelAdded > 0) save("campusHostelAllocations", hostelAllocs);

    /* ================= TRANSPORT: BUSES (target 8) ================= */

    var defaultBuses = [
        { id: "BUS001", number: "Bus 01", registration: "OD02AB1234", route: "Route A", capacity: 50, driver: "Ramesh Kumar", phone: "9876543210" },
        { id: "BUS002", number: "Bus 02", registration: "OD02CD5678", route: "Route B", capacity: 40, driver: "Suresh Das", phone: "9876543211" },
        { id: "BUS003", number: "Bus 03", registration: "OD02EF9012", route: "Route C", capacity: 45, driver: "Amit Singh", phone: "9876543212" }
    ];

    var extraBuses = [
        { id: "BUS004", number: "Bus 04", registration: "OD02GH3456", route: "Route D", capacity: 45, driver: "Prakash Jena", phone: "9876543213" },
        { id: "BUS005", number: "Bus 05", registration: "OD02JK7890", route: "Route E", capacity: 50, driver: "Bijaya Mohanty", phone: "9876543214" },
        { id: "BUS006", number: "Bus 06", registration: "OD02LM1122", route: "Route F", capacity: 40, driver: "Santosh Sahoo", phone: "9876543215" },
        { id: "BUS007", number: "Bus 07", registration: "OD02NP3344", route: "Route G", capacity: 55, driver: "Dilip Patra", phone: "9876543216" },
        { id: "BUS008", number: "Bus 08", registration: "OD02QR5566", route: "Route H", capacity: 35, driver: "Manoj Behera", phone: "9876543217" }
    ];

    var buses = load("campusTransportBuses");
    var busesWasMissing = !buses || buses.length === 0;
    if (busesWasMissing) buses = defaultBuses.slice();
    var busesAdded = 0;
    extraBuses.forEach(function (b) {
        if (!hasId(buses, b.id)) { buses.push(b); busesAdded++; }
    });
    /* Perf: skip rewrite when nothing changed (was unconditional). */
    if (busesWasMissing || busesAdded > 0) save("campusTransportBuses", buses);

    /* ================= TRANSPORT: ROUTES (target 8) ================= */

    var defaultRoutes = [
        { id: "ROUTE001", name: "Route A", start: "Main Gate", stops: "City Center, Market, College Road", end: "Campus" },
        { id: "ROUTE002", name: "Route B", start: "Railway Station", stops: "Bus Stand, University Road", end: "Campus" },
        { id: "ROUTE003", name: "Route C", start: "Airport Road", stops: "Mall, Hospital, Central Park", end: "Campus" }
    ];

    var extraRoutes = [
        { id: "ROUTE004", name: "Route D", start: "Patia", stops: "KIIT Square, Chandrasekharpur, Infocity", end: "Campus" },
        { id: "ROUTE005", name: "Route E", start: "Khandagiri", stops: "Barmunda, Nayapalli, CRP Square", end: "Campus" },
        { id: "ROUTE006", name: "Route F", start: "Badambadi, Cuttack", stops: "Rasulgarh, Vani Vihar, Master Canteen", end: "Campus" },
        { id: "ROUTE007", name: "Route G", start: "Khordha", stops: "Uttara Chhak, Kalinga Vihar, AIIMS", end: "Campus" },
        { id: "ROUTE008", name: "Route H", start: "Saheed Nagar", stops: "Satya Nagar, Forest Park, Kalpana", end: "Campus" }
    ];

    var routes = load("campusTransportRoutes");
    var routesWasMissing = !routes || routes.length === 0;
    if (routesWasMissing) routes = defaultRoutes.slice();
    var routesAdded = 0;
    extraRoutes.forEach(function (r) {
        if (!hasId(routes, r.id)) { routes.push(r); routesAdded++; }
    });
    /* Perf: skip rewrite when nothing changed (was unconditional). */
    if (routesWasMissing || routesAdded > 0) save("campusTransportRoutes", routes);

    /* ================= TRANSPORT: ALLOCATIONS (target 10) ================= */

    var defaultTransportAllocs = [
        { studentName: "Rahul Kumar", studentId: "STU001", department: "Computer Science", busId: "BUS001", pickup: "City Center" },
        { studentName: "Priya Sharma", studentId: "STU002", department: "Information Technology", busId: "BUS002", pickup: "Railway Station" },
        { studentName: "Aman Das", studentId: "STU003", department: "Mechanical Engineering", busId: "BUS001", pickup: "Market" }
    ];

    var extraTransportAllocs = [
        { studentName: "Sneha Mishra", studentId: "STU004", department: "Electrical Engineering", busId: "BUS003", pickup: "Mall" },
        { studentName: "Vikash Singh", studentId: "STU005", department: "Civil Engineering", busId: "BUS002", pickup: "Bus Stand" },
        { studentName: "Anjali Patel", studentId: "STU006", department: "Computer Science", busId: "BUS004", pickup: "KIIT Square" },
        { studentName: "Rohit Verma", studentId: "STU007", department: "Management", busId: "BUS005", pickup: "Nayapalli" },
        { studentName: "Pooja Nayak", studentId: "STU008", department: "Information Technology", busId: "BUS006", pickup: "Vani Vihar" },
        { studentName: "Karan Malhotra", studentId: "STU009", department: "Mechanical Engineering", busId: "BUS007", pickup: "AIIMS" },
        { studentName: "Divya Reddy", studentId: "STU010", department: "Electrical Engineering", busId: "BUS008", pickup: "Satya Nagar" }
    ];

    var transportAllocs = load("campusTransportAllocations");
    var transportWasMissing = !transportAllocs || transportAllocs.length === 0;
    if (transportWasMissing) transportAllocs = defaultTransportAllocs.slice();
    var transportAdded = 0;
    extraTransportAllocs.forEach(function (rec) {
        var already = transportAllocs.some(function (a) { return a && a.studentId === rec.studentId; });
        if (already) return;
        var bus = null;
        buses.forEach(function (b) { if (b.id === rec.busId) bus = b; });
        if (!bus) return;
        var occupied = transportAllocs.filter(function (a) { return a && a.busId === rec.busId; }).length;
        if (occupied >= Number(bus.capacity)) return;
        transportAllocs.push(rec);
        transportAdded++;
    });
    /* Perf: skip rewrite when nothing changed (was unconditional). */
    if (transportWasMissing || transportAdded > 0) save("campusTransportAllocations", transportAllocs);

    console.log("[seed-05] books=" + books.length +
        " issued=" + issues.length +
        " rooms=" + rooms.length +
        " hostelAllocs=" + hostelAllocs.length +
        " buses=" + buses.length +
        " routes=" + routes.length +
        " transportAllocs=" + transportAllocs.length);
})();
