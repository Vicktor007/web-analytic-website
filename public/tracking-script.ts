(() => {
    "use strict";
  
    const location = window.location;
    const document = window.document;
    const scriptElement = document.currentScript as HTMLScriptElement | null;
    const dataDomain = scriptElement?.getAttribute("data-domain") ?? "unknown";
  
    const queryString = location.search;
    const params = new URLSearchParams(queryString);
    const source =
      params.get("utm_source") ||
      params.get("utm") ||
      params.get("source") ||
      document.referrer ||
      "unknown";
  
    const endpoint = "http://localhost:3000/api/track";
  
    function generateSessionId(): string {
      return "session-" + Math.random().toString(36).substring(2, 9);
    }
  
    function initializeSession(): { sessionId: string; expirationTimeStamp: number } {
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
  
    function isSessionExpired(expirationTimeStamp: number): boolean {
      return Date.now() >= expirationTimeStamp;
    }
  
    function checkSessionStatus(): void {
      const session = initializeSession();
      if (isSessionExpired(session.expirationTimeStamp)) {
        localStorage.removeItem("session_id");
        localStorage.removeItem("session_expiration_timestamp");
        initializeSession();
      }
    }
  
    checkSessionStatus();
  
    function trigger(eventName: string, options?: { callback?: () => void }): void {
      const payload = {
        event: eventName,
        url: location.href,
        domain: dataDomain,
        source,
      };
  
      sendRequest(payload, options);
    }
  
    function sendRequest(payload: object, options?: { callback?: () => void }): void {
      const request = new XMLHttpRequest();
      request.open("POST", endpoint, true);
      request.setRequestHeader("Content-Type", "application/json");
  
      request.onreadystatechange = () => {
        if (request.readyState === 4) {
          options?.callback?.();
        }
      };
  
      request.send(JSON.stringify(payload));
    }
  
    const queue = (window as any).your_tracking?.q || [];
    (window as any).your_tracking = trigger;
    queue.forEach(function (this: Window, event: any) {
        trigger.apply(this, event);
    });
    
    
  
    function trackPageView(): void {
      trigger("pageview");
    }
  
    function trackSessionStart(): void {
      trigger("session_start");
    }
  
    function trackSessionEnd(): void {
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
  