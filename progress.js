/* ============================================================
   progress.js : vanilla JS progress / loading helpers (no libs)
   - window.setProgress(elOrSelector, percent)
   - window.startButtonSpinner(btnOrSelector) /
     window.stopButtonSpinner(btnOrSelector)
   - window.showSkeleton(containerSelector, rows) /
     window.hideSkeleton(containerSelector)
   - Duration rules: window.progressModeFor(expectedMs),
     window.runWithProgress(options, taskFn), window.formatEta(ms)
   - Additive wiring: generateReports() fee/pass bars get
     width + aria updates via setProgress. IDs/handlers kept.
   ============================================================ */
(function () {
    "use strict";

    /* ---------- tiny DOM resolver (selector or element) ---------- */
    function resolveEl(elOrSelector) {
        if (typeof elOrSelector === "string") {
            try {
                return document.querySelector(elOrSelector);
            } catch (e) {
                return document.getElementById(
                    String(elOrSelector).replace(/^#/, "")
                );
            }
        }
        if (
            elOrSelector &&
            (elOrSelector.nodeType === 1 || elOrSelector instanceof Element)
        ) {
            return elOrSelector;
        }
        return null;
    }

    function clampPct(n) {
        n = Math.round(Number(n));
        if (isNaN(n)) return 0;
        if (n < 0) return 0;
        if (n > 100) return 100;
        return n;
    }

    /* ---------- minimal styles (only if page lacks them) ---------- */
    function ensureProgressStyles() {
        if (document.getElementById("progressHelperStyles")) return;
        var css =
            ".btn-spinner{display:inline-block;width:14px;height:14px;" +
            "border:2px solid currentColor;border-top-color:transparent;" +
            "border-radius:50%;vertical-align:-2px;margin-right:8px;" +
            "animation:progressHelperSpin .7s linear infinite}" +
            "@keyframes progressHelperSpin{to{transform:rotate(360deg)}}" +
            ".progress-bar.is-indeterminate,.is-indeterminate{" +
            "position:relative;overflow:hidden}" +
            ".progress-bar.is-indeterminate > div{position:absolute;top:0;" +
            "left:-40%;width:40%!important;" +
            "animation:progressHelperSlide 1.2s ease-in-out infinite}" +
            "@keyframes progressHelperSlide{" +
            "0%{left:-40%}100%{left:100%}}" +
            ".skeleton-row{border-radius:8px;margin:8px 0}" +
            ".skeleton-line{height:14px;border-radius:6px;margin:8px 0;" +
            "background:linear-gradient(90deg,#e5e7eb 25%,#f3f4f6 50%,#e5e7eb 75%);" +
            "background-size:200% 100%;" +
            "animation:progressHelperShimmer 1.2s ease-in-out infinite}" +
            "@keyframes progressHelperShimmer{" +
            "0%{background-position:200% 0}100%{background-position:-200% 0}}" +
            "@media (prefers-reduced-motion: reduce){" +
            ".btn-spinner,.progress-bar.is-indeterminate > div,.skeleton-line" +
            "{animation:none}}" +
            ".btn-loading{opacity:.75;cursor:wait}";
        var style = document.createElement("style");
        style.id = "progressHelperStyles";
        style.textContent = css;
        document.head.appendChild(style);
    }

    /* ============================================================
       setProgress(elOrSelector, percent)
       - percent 0..100 : determinate (width%, aria-valuenow,
         aria-valuetext "Loading... X%", .progress-label updated)
       - percent null/undefined/NaN : indeterminate mode
       ============================================================ */
    function setProgress(elOrSelector, percent) {
        var el = resolveEl(elOrSelector);
        if (!el) return null;
        try {
            ensureProgressStyles();
        } catch (e) {}
        if (percent === null || percent === undefined || isNaN(Number(percent))) {
            el.classList.add("is-indeterminate");
            el.setAttribute("role", "progressbar");
            if (!el.hasAttribute("aria-valuemin")) {
                el.setAttribute("aria-valuemin", "0");
            }
            if (!el.hasAttribute("aria-valuemax")) {
                el.setAttribute("aria-valuemax", "100");
            }
            el.removeAttribute("aria-valuenow");
            el.setAttribute("aria-valuetext", "Loading...");
            return el;
        }
        var pct = clampPct(percent);
        el.classList.remove("is-indeterminate");
        el.style.width = pct + "%";
        el.setAttribute("role", "progressbar");
        el.setAttribute("aria-valuemin", "0");
        el.setAttribute("aria-valuemax", "100");
        el.setAttribute("aria-valuenow", String(pct));
        el.setAttribute("aria-valuetext", "Loading... " + pct + "%");
        /* Adjacent .progress-label: next / prev sibling, else
           first .progress-label inside the shared parent. */
        var label = null;
        try {
            var next = el.nextElementSibling;
            var prev = el.previousElementSibling;
            if (next && next.classList && next.classList.contains("progress-label")) {
                label = next;
            } else if (prev && prev.classList && prev.classList.contains("progress-label")) {
                label = prev;
            } else if (el.parentElement) {
                label = el.parentElement.querySelector(".progress-label");
            }
            if (label) label.textContent = pct + "%";
        } catch (e) {}
        return el;
    }

    /* ============================================================
       startButtonSpinner(btn) / stopButtonSpinner(btn)
       - start: disables, stores original HTML, prepends spinner,
         sets aria-busy=true. Safe to call twice (no-op).
       - stop: restores original HTML, re-enables, clears aria-busy.
       ============================================================ */
    var SPINNER_CLASS = "progress-helper-spinner";

    function startButtonSpinner(btnOrSelector) {
        var btn = resolveEl(btnOrSelector);
        if (!btn) return null;
        try {
            ensureProgressStyles();
        } catch (e) {}
        if (btn.dataset && btn.dataset.progressSpinning === "1") return btn;
        try {
            btn.dataset.progressSpinning = "1";
            if (btn.dataset.progressOrigHtml === undefined) {
                btn.dataset.progressOrigHtml = btn.innerHTML;
                btn.dataset.progressWasDisabled = btn.disabled ? "1" : "";
            }
            btn.disabled = true;
            btn.setAttribute("aria-busy", "true");
            btn.classList.add("btn-loading");
            var spin = document.createElement("span");
            spin.className = "btn-spinner " + SPINNER_CLASS;
            spin.setAttribute("aria-hidden", "true");
            btn.insertBefore(spin, btn.firstChild);
        } catch (e) {}
        return btn;
    }

    function stopButtonSpinner(btnOrSelector) {
        var btn = resolveEl(btnOrSelector);
        if (!btn) return null;
        try {
            if (!btn.dataset || btn.dataset.progressSpinning !== "1") return btn;
            var stray = btn.querySelector("." + SPINNER_CLASS);
            if (stray && stray.parentNode === btn) {
                btn.removeChild(stray);
            } else if (btn.dataset.progressOrigHtml !== undefined) {
                /* Fallback: full restore (also clears double-spinners). */
                btn.innerHTML = btn.dataset.progressOrigHtml;
            }
            if (btn.dataset.progressWasDisabled !== "1") {
                btn.disabled = false;
            }
            btn.removeAttribute("aria-busy");
            btn.classList.remove("btn-loading");
            delete btn.dataset.progressSpinning;
        } catch (e) {}
        return btn;
    }

    /* ============================================================
       showSkeleton(containerSelector, rows) / hideSkeleton(...)
       - show: stashes original HTML, injects N .skeleton rows,
         sets aria-busy=true. No-op if already showing.
       - hide: restores stashed HTML, clears aria-busy.
       ============================================================ */
    var skeletonStore = new Map();

    function showSkeleton(containerSelector, rows) {
        var box = resolveEl(containerSelector);
        if (!box) return null;
        try {
            ensureProgressStyles();
        } catch (e) {}
        if (box.dataset && box.dataset.progressSkeleton === "1") return box;
        var n = Math.max(1, Math.min(20, parseInt(rows, 10) || 3));
        try {
            skeletonStore.set(box, box.innerHTML);
            box.dataset.progressSkeleton = "1";
            box.setAttribute("aria-busy", "true");
            box.innerHTML = "";
            for (var i = 0; i < n; i++) {
                var row = document.createElement("div");
                row.className = "skeleton-row";
                row.setAttribute("aria-hidden", "true");
                var line = document.createElement("div");
                line.className = "skeleton skeleton-line";
                row.appendChild(line);
                box.appendChild(row);
            }
        } catch (e) {}
        return box;
    }

    function hideSkeleton(containerSelector) {
        var box = resolveEl(containerSelector);
        if (!box) return null;
        try {
            if (!box.dataset || box.dataset.progressSkeleton !== "1") return box;
            if (skeletonStore.has(box)) {
                box.innerHTML = skeletonStore.get(box);
                skeletonStore.delete(box);
            }
            delete box.dataset.progressSkeleton;
            box.removeAttribute("aria-busy");
        } catch (e) {}
        return box;
    }

    /* ============================================================
       Duration rules
       <1s    -> "none"          (no indicator, avoids flicker)
       1s-9s -> "indeterminate"  (spinner / sliding bar / skeleton)
       10s+  -> "determinate"    (percent bar + ETA text)
       ============================================================ */
    function progressModeFor(expectedMs) {
        var ms = Number(expectedMs);
        if (isNaN(ms) || ms < 0) ms = 0;
        if (ms < 1000) return "none";
        if (ms < 10000) return "indeterminate";
        return "determinate";
    }

    function formatEta(msRemaining) {
        var s = Math.max(0, Math.ceil(Number(msRemaining) / 1000) || 0);
        if (s < 60) return "About " + s + "s remaining";
        var m = Math.floor(s / 60);
        var rest = s % 60;
        return "About " + m + "m " + rest + "s remaining";
    }

    function setEtaText(etaElOrSelector, msRemaining) {
        var el = resolveEl(etaElOrSelector);
        if (!el) return null;
        el.textContent = formatEta(msRemaining);
        return el;
    }

    /* ============================================================
       runWithProgress(options, taskFn)
       options: { expectedMs, bar, button, container, skeletonRows,
                  etaEl, label, onDone }
       - picks mode via progressModeFor(expectedMs)
       - "none": runs taskFn directly, no indicator
       - "indeterminate": spinner on button (if given), sliding bar
         (if given), skeleton in container (if given)
       - "determinate": animated 0->90% bar + ETA text; 100% on done
       - taskFn may return a value or a Promise; cleanup always runs
       ============================================================ */
    function runWithProgress(options, taskFn) {
        if (typeof options === "function") {
            taskFn = options;
            options = {};
        }
        options = options || {};
        var mode = progressModeFor(options.expectedMs || 0);
        var bar = options.bar ? resolveEl(options.bar) : null;
        var btn = options.button ? resolveEl(options.button) : null;
        var container = options.container ? resolveEl(options.container) : null;
        var etaEl = options.etaEl
            ? resolveEl(options.etaEl)
            : bar && bar.parentElement
              ? bar.parentElement.querySelector(".progress-label, [data-eta]")
              : null;
        var timer = null;
        var startedAt = Date.now();
        var expected = Number(options.expectedMs) || 0;

        function cleanup() {
            if (timer) {
                clearInterval(timer);
                timer = null;
            }
            if (btn) stopButtonSpinner(btn);
            if (bar && mode !== "none") {
                bar.classList.remove("is-indeterminate");
            }
            if (container) hideSkeleton(container);
        }

        function finish(result, isError) {
            try {
                if (bar && mode === "determinate") {
                    setProgress(bar, 100);
                    if (etaEl) etaEl.textContent = "";
                    if (options.label) {
                        var lab = resolveEl(options.label);
                        if (lab) lab.textContent = "Done";
                    }
                }
            } catch (e) {}
            cleanup();
            try {
                if (typeof options.onDone === "function") {
                    options.onDone(isError ? null : result, isError || null);
                }
            } catch (e) {}
            if (isError) throw result;
            return result;
        }

        if (mode === "none") {
            var out;
            try {
                out = taskFn();
            } catch (err) {
                throw err;
            }
            if (out && typeof out.then === "function") {
                return out.then(
                    function (v) {
                        try {
                            if (typeof options.onDone === "function") options.onDone(v, null);
                        } catch (e) {}
                        return v;
                    },
                    function (err) {
                        try {
                            if (typeof options.onDone === "function") options.onDone(null, err);
                        } catch (e) {}
                        throw err;
                    }
                );
            }
            try {
                if (typeof options.onDone === "function") options.onDone(out, null);
            } catch (e) {}
            return out;
        }

        if (btn) startButtonSpinner(btn);
        if (container) showSkeleton(container, options.skeletonRows || 3);
        if (bar) {
            if (mode === "indeterminate") {
                setProgress(bar, null);
            } else {
                setProgress(bar, 0);
                if (etaEl) setEtaText(etaEl, expected);
                /* Ease 0 -> 90% over the expected duration; the
                   final 10% lands when taskFn settles. */
                timer = setInterval(function () {
                    try {
                        var elapsed = Date.now() - startedAt;
                        var pct = Math.min(90, Math.round((elapsed / expected) * 90));
                        setProgress(bar, pct);
                        if (etaEl) setEtaText(etaEl, Math.max(0, expected - elapsed));
                    } catch (e) {}
                }, 250);
            }
        }

        var result;
        try {
            result = taskFn();
        } catch (err) {
            cleanup();
            try {
                if (typeof options.onDone === "function") options.onDone(null, err);
            } catch (e) {}
            throw err;
        }
        if (result && typeof result.then === "function") {
            return result.then(
                function (v) {
                    return finish(v, null);
                },
                function (err) {
                    cleanup();
                    try {
                        if (typeof options.onDone === "function") options.onDone(null, err);
                    } catch (e) {}
                    throw err;
                }
            );
        }
        return finish(result, null);
    }

    /* ============================================================
       Additive wiring (trivial, non-breaking)
       - generateReports(): after the original runs, route the
         fee/pass bar widths through setProgress so width%,
         aria-valuenow, aria-valuetext stay in sync. IDs, markup,
         and the existing refresh-feedback wrapper are untouched.
       - Fee collection calc (updateFeeSummary/displayFees) and
         attendance calc (markAttendance/displayAttendance) are
         synchronous local ops (<1s -> "none" per duration rules),
         so no spinner/skeleton is wired there; crews can call
         runWithProgress explicitly for slower future flows.
       ============================================================ */
    function readPctFromLabel(selector, fallback) {
        try {
            var el = document.querySelector(selector);
            if (!el) return fallback;
            var m = String(el.textContent || "").match(/(\d+)/);
            return m ? clampPct(parseInt(m[1], 10)) : fallback;
        } catch (e) {
            return fallback;
        }
    }

    function syncReportBars() {
        try {
            var feeBar = document.getElementById("feeProgress");
            if (feeBar) {
                setProgress(feeBar, readPctFromLabel("#feePercentage", 0));
            }
            var passBar = document.getElementById("passProgress");
            if (passBar) {
                setProgress(passBar, readPctFromLabel("#passPercentage", 0));
            }
        } catch (e) {}
    }

    function wireReportProgress() {
        if (window.__reportProgressWired) return;
        if (typeof window.generateReports !== "function") return;
        window.__reportProgressWired = true;
        var orig = window.generateReports;
        window.generateReports = function () {
            var out = orig.apply(this, arguments);
            syncReportBars();
            return out;
        };
    }

    function wireWhenReady() {
        wireReportProgress();
        /* First paint (reports.html calls generateReports on
           DOMContentLoaded): sync bars even if nothing wrapped. */
        try {
            if (document.getElementById("feeProgress") ||
                document.getElementById("passProgress")) {
                syncReportBars();
            }
        } catch (e) {}
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", wireWhenReady);
    } else {
        wireWhenReady();
    }
    /* Late catch: if script order puts progress.js before the file
       that defines generateReports, pick it up on window load. */
    window.addEventListener("load", wireReportProgress);

    /* ============================================================
       renderSegmented(container)
       - container: Element | selector string | undefined (all)
       - Reads data-done (fallback data-count) / data-total,
         renders total .segment divs with first done .filled.
       - Contract: <div class="progress-segmented"
           data-done="5" data-total="20"> -> 20 .segment, 5 .filled.
       - Accessible: role=progressbar, aria-valuemin/max/now,
         aria-valuetext "5 of 20". Segments aria-hidden.
       - Idempotent, vanilla, preserves IDs/handlers.
       ============================================================ */
    function ensureSegmentedStyles() {
        if (document.getElementById("segmentedGradientStyles")) return;
        try { ensureProgressStyles(); } catch (e) {}
        var css =
            ".progress-segmented{display:flex;gap:3px;background:transparent;" +
            "height:10px;width:100%;border-radius:999px;overflow:hidden}" +
            ".progress-segmented .segment{flex:1;min-width:0;border-radius:3px;" +
            "background:#e5e7eb;background-color:#e5e7eb}" +
            ".progress-segmented .segment.filled{background:#2563eb;" +
            "background-color:#2563eb}" +
            ".progress-gradient{width:100%;height:8px;border-radius:999px;" +
            "overflow:hidden;background:#e2e8f0;background-color:#e2e8f0}" +
            ".progress-gradient .progress-bar{display:block;height:100%;" +
            "width:0%;border-radius:inherit;" +
            "background:linear-gradient(90deg,#2563eb,#7c3aed)}" +
            ".maint-progress{display:grid;gap:10px;margin-top:12px}" +
            ".maint-row{display:grid;gap:6px}" +
            ".maint-head{display:flex;justify-content:space-between;" +
            "align-items:baseline;gap:8px;font-size:13px}" +
            ".maint-count{font-variant-numeric:tabular-nums;font-weight:700}" +
            "@media(max-width:600px){.progress-segmented{gap:2px;height:10px}}";
        var style = document.createElement("style");
        style.id = "segmentedGradientStyles";
        style.textContent = css;
        document.head.appendChild(style);
    }

    function parseSegmentedNumbers(el) {
        var doneRaw = el.getAttribute("data-done");
        if (doneRaw === null || doneRaw === "") {
            doneRaw = el.getAttribute("data-count");
        }
        var totalRaw = el.getAttribute("data-total");
        var total = parseInt(totalRaw, 10);
        if (isNaN(total) || total < 0) total = 0;
        if (total > 100) total = 100;
        var done = parseInt(doneRaw, 10);
        if (isNaN(done) || done < 0) done = 0;
        if (done > total) done = total;
        return { done: done, total: total };
    }

    function renderOneSegmented(el) {
        if (!el || el.nodeType !== 1) return null;
        try { ensureSegmentedStyles(); } catch (e) {}
        var nums = parseSegmentedNumbers(el);
        var done = nums.done;
        var total = nums.total;
        el.innerHTML = "";
        for (var i = 0; i < total; i++) {
            var seg = document.createElement("div");
            seg.className = "segment" + (i < done ? " filled" : "");
            seg.setAttribute("aria-hidden", "true");
            el.appendChild(seg);
        }
        el.setAttribute("role", "progressbar");
        el.setAttribute("aria-valuemin", "0");
        el.setAttribute("aria-valuemax", String(total));
        el.setAttribute("aria-valuenow", String(done));
        el.setAttribute("aria-valuetext", done + " of " + total);
        if (!el.hasAttribute("aria-label")) {
            el.setAttribute("aria-label", "Progress " + done + " of " + total);
        }
        return el;
    }

    function renderSegmented(container) {
        try { ensureSegmentedStyles(); } catch (e) {}
        var targets = [];
        try {
            if (container === null || container === undefined || container === "") {
                targets = Array.prototype.slice.call(
                    document.querySelectorAll(".progress-segmented")
                );
            } else if (typeof container === "string") {
                try {
                    targets = Array.prototype.slice.call(
                        document.querySelectorAll(container)
                    );
                } catch (e) {
                    var byId = document.getElementById(
                        String(container).replace(/^#/, "")
                    );
                    if (byId) targets = [byId];
                }
                /* Bare selector that is itself a wrapper: also catch
                   descendants if the selector matched a parent. */
                if (!targets.length) {
                    var single = document.querySelector(container);
                    if (single && single.querySelectorAll) {
                        targets = Array.prototype.slice.call(
                            single.querySelectorAll(".progress-segmented")
                        );
                    }
                }
            } else if (container.nodeType === 1) {
                if (container.classList &&
                    container.classList.contains("progress-segmented")) {
                    targets = [container];
                } else if (container.querySelectorAll) {
                    targets = Array.prototype.slice.call(
                        container.querySelectorAll(".progress-segmented")
                    );
                }
            } else if (container.length !== undefined) {
                targets = Array.prototype.slice.call(container);
            }
        } catch (e) { targets = []; }
        targets.forEach(function (el) {
            try { renderOneSegmented(el); } catch (e) {}
        });
        return targets;
    }

    function initSegmentedBars() {
        try { renderSegmented(); } catch (e) {}
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initSegmentedBars);
    } else {
        initSegmentedBars();
    }
    /* Late catch: markup injected by campus-hub.js after DOM ready. */
    window.addEventListener("load", initSegmentedBars);

    /* ---------- public API ---------- */
    window.setProgress = setProgress;
    window.startButtonSpinner = startButtonSpinner;
    window.stopButtonSpinner = stopButtonSpinner;
    window.showSkeleton = showSkeleton;
    window.hideSkeleton = hideSkeleton;
    window.progressModeFor = progressModeFor;
    window.formatEta = formatEta;
    window.setEtaText = setEtaText;
    window.runWithProgress = runWithProgress;
    window.renderSegmented = renderSegmented;
})();
