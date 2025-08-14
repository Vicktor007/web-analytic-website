(() => {
    "use strict";
    var _a, _b;
    const location = window.location;
    const document = window.document;
    const scriptElement = document.currentScript;
    const dataDomain = (_a = scriptElement === null || scriptElement === void 0 ? void 0 : scriptElement.getAttribute("data-domain")) !== null && _a !== void 0 ? _a : "unknown";
    const queryString = location.search;
    const params = new URLSearchParams(queryString);
    const source = params.get("utm_source") ||
        params.get("utm") ||
        params.get("source") ||
        document.referrer ||
        "unknown";
    // ✅ Priority:
    // 1. Build-time injected env var from Next.js
    // 2. Runtime browser global variable
    // 3. Current page origin
    // 4. Default localhost
    const endpointBase = process.env.NEXT_PUBLIC_APP_URL ||
        window.NEXT_PUBLIC_APP_URL ||
        window.location.origin ||
        "http://localhost:3000";
    const endpoint = `${endpointBase}/api/track`;
    function generateSessionId() {
        return "session-" + Math.random().toString(36).substring(2, 9);
    }
    function initializeSession() {
        let sessionId = localStorage.getItem("session_id");
        let expirationTimeStamp = localStorage.getItem("session_expiration_timestamp");
        if (!sessionId || !expirationTimeStamp) {
            sessionId = generateSessionId();
            expirationTimeStamp = (Date.now() + 10 * 60 * 1000).toString(); // 10 minutes
            localStorage.setItem("session_id", sessionId);
            localStorage.setItem("session_expiration_timestamp", expirationTimeStamp);
        }
        return {
            sessionId,
            expirationTimeStamp: parseInt(expirationTimeStamp, 10),
        };
    }
    function isSessionExpired(expirationTimeStamp) {
        return Date.now() >= expirationTimeStamp;
    }
    function checkSessionStatus() {
        const session = initializeSession();
        if (isSessionExpired(session.expirationTimeStamp)) {
            localStorage.removeItem("session_id");
            localStorage.removeItem("session_expiration_timestamp");
            initializeSession();
        }
    }
    checkSessionStatus();
    function trigger(eventName, options) {
        const payload = {
            event: eventName,
            url: location.href,
            domain: dataDomain,
            source,
        };
        sendRequest(payload, options);
    }
    function sendRequest(payload, options) {
        const request = new XMLHttpRequest();
        request.open("POST", endpoint, true);
        request.setRequestHeader("Content-Type", "application/json");
        request.onreadystatechange = () => {
            var _a;
            if (request.readyState === 4) {
                (_a = options === null || options === void 0 ? void 0 : options.callback) === null || _a === void 0 ? void 0 : _a.call(options);
            }
        };
        request.send(JSON.stringify(payload));
    }
    const queue = ((_b = window.your_tracking) === null || _b === void 0 ? void 0 : _b.q) || [];
    window.your_tracking = trigger;
    queue.forEach(function (event) {
        trigger.apply(this, event);
    });
    function trackPageView() {
        trigger("pageview");
    }
    function trackSessionStart() {
        trigger("session_start");
    }
    function trackSessionEnd() {
        trigger("session_end");
    }
    trackPageView();
    let initialPathname = window.location.pathname;
    window.addEventListener("popstate", trackPageView);
    window.addEventListener("hashchange", trackPageView);
    document.addEventListener("click", () => {
        setTimeout(() => {
            if (window.location.pathname !== initialPathname) {
                trackPageView();
                initialPathname = window.location.pathname;
            }
        }, 3000);
    });
})();
export {};
