/* Web Push subscription client for Campus Hub (vanilla JS, no build step).
   Global fns: getPushPublicKey, isPushSubscribed, setPushEnabled, togglePush.
   All failures resolve {ok:false, reason} and never throw to the caller. */
(function () {
  "use strict";

  function apiBase() {
    try {
      var el = document.getElementById("apiBase");
      var v = el && el.value ? String(el.value).trim() : "";
      if (v) return v.replace(/\/+$/, "");
    } catch (e) {}
    try {
      var s = localStorage.getItem("campusApiBase");
      if (s && String(s).trim()) return String(s).trim().replace(/\/+$/, "");
    } catch (e) {}
    try {
      if (window.location && window.location.origin && window.location.origin !== "null")
        return String(window.location.origin).replace(/\/+$/, "");
    } catch (e) {}
    return "http://localhost:5000";
  }

  function urlBase64ToUint8Array(base64) {
    var s = String(base64 || "").trim();
    var padding = "=".repeat((4 - (s.length % 4)) % 4);
    var b64 = (s + padding).replace(/-/g, "+").replace(/_/g, "/");
    var raw = window.atob(b64);
    var out = new Uint8Array(raw.length);
    for (var i = 0; i < raw.length; i++) out[i] = raw.charCodeAt(i);
    return out;
  }

  function supported() {
    return ("serviceWorker" in navigator) && ("PushManager" in window) && ("Notification" in window);
  }

  function getReg() {
    if (navigator.serviceWorker.controller) return navigator.serviceWorker.ready;
    return navigator.serviceWorker.register("sw.js").then(function () { return navigator.serviceWorker.ready; });
  }

  function profileBits() {
    var department = "", semester = "";
    try {
      var p = JSON.parse(localStorage.getItem("campusCurrentStudentProfile") || "null") ||
              JSON.parse(localStorage.getItem("campusSession") || "null") || {};
      department = p.department || "";
      semester = p.semester || "";
    } catch (e) {}
    return { department: department, semester: semester };
  }

  function fail(err) {
    return { ok: false, reason: String((err && err.message) || err || "failed") };
  }

  window.getPushPublicKey = function () {
    try {
      return fetch(apiBase() + "/api/push/public-key").then(function (r) {
        if (!r.ok) return { ok: false, reason: "http-" + r.status };
        return r.json().then(function (j) {
          var key = (j && (j.publicKey || j.key)) || (j && j.data && (j.data.publicKey || j.data.key)) || "";
          if (!key) return { ok: false, reason: "no-key" };
          return { ok: true, publicKey: key };
        }, fail);
      }, fail);
    } catch (err) { return Promise.resolve(fail(err)); }
  };

  window.isPushSubscribed = function () {
    if (!supported()) return Promise.resolve(false);
    try {
      return getReg().then(function (reg) {
        return reg.pushManager.getSubscription().then(function (sub) { return !!sub; }, function () { return false; });
      }, function () { return false; });
    } catch (err) { return Promise.resolve(false); }
  };

  window.setPushEnabled = function (on) {
    if (!supported()) {
      try { localStorage.setItem("campusPushEnabled", "0"); } catch (e) {}
      return Promise.resolve({ ok: false, reason: "unsupported" });
    }
    if (!on) {
      try {
        return getReg().then(function (reg) {
          return reg.pushManager.getSubscription();
        }).then(function (sub) {
          var endpoint = sub ? sub.endpoint : "";
          var post = endpoint
            ? fetch(apiBase() + "/api/push/unsubscribe", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ endpoint: endpoint })
              }).catch(function () {})
            : Promise.resolve();
          return post.then(function () {
            if (sub) return sub.unsubscribe().catch(function () {});
          }).then(function () {
            try { localStorage.setItem("campusPushEnabled", "0"); } catch (e) {}
            return { ok: true };
          });
        }, fail);
      } catch (err) { return Promise.resolve(fail(err)); }
    }
    try {
      return window.getPushPublicKey().then(function (k) {
        if (!k || !k.ok) return k || { ok: false, reason: "no-key" };
        if (Notification.permission === "denied") return { ok: false, reason: "denied" };
        return Notification.requestPermission().then(function (perm) {
          if (perm !== "granted") return { ok: false, reason: "denied" };
          return getReg().then(function (reg) {
            return reg.pushManager.subscribe({ userVisibleOnly: true, applicationServerKey: urlBase64ToUint8Array(k.publicKey) });
          }).then(function (sub) {
            var bits = profileBits();
            var body = {
              endpoint: sub.endpoint,
              keys: (sub.toJSON() && sub.toJSON().keys) || {},
              audience: "Students",
              department: bits.department,
              semester: bits.semester
            };
            return fetch(apiBase() + "/api/push/subscribe", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(body)
            }).then(function (r) {
              if (!r.ok) return { ok: false, reason: "http-" + r.status };
              try { localStorage.setItem("campusPushEnabled", "1"); } catch (e) {}
              return { ok: true };
            }, fail);
          }, fail);
        }, fail);
      }, fail);
    } catch (err) { return Promise.resolve(fail(err)); }
  };

  /* Settings-toggle glue: <input id="prefPush" onchange="togglePush(this)"> */
  window.togglePush = function (el) {
    var on = !!(el && el.checked);
    var status = document.getElementById("pushStatus");
    if (status) status.textContent = on ? "Enabling…" : "Disabling…";
    try {
      return window.setPushEnabled(on).then(function (res) {
        if (!res || !res.ok) {
          if (el) el.checked = false;
          try { localStorage.setItem("campusPushEnabled", "0"); } catch (e) {}
          if (status) status.textContent = "Off" + (res && res.reason ? " (" + res.reason + ")" : "");
          return res;
        }
        if (el) el.checked = on;
        if (status) status.textContent = on ? "On" : "Off";
        return res;
      }, function (err) {
        if (el) el.checked = false;
        if (status) status.textContent = "Off (" + String((err && err.message) || err) + ")";
        return fail(err);
      });
    } catch (err) {
      if (el) el.checked = false;
      if (status) status.textContent = "Off";
      return Promise.resolve(fail(err));
    }
  };

  document.addEventListener("DOMContentLoaded", function () {
    var box = document.getElementById("prefPush");
    if (!box) return;
    var status = document.getElementById("pushStatus");
    try {
      window.isPushSubscribed().then(function (yes) {
        box.checked = !!yes;
        if (status) status.textContent = yes ? "On" : "Off";
      });
    } catch (e) {}
  });
})();
