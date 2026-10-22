      // Register service worker
      if ("serviceWorker" in navigator) {
        navigator.serviceWorker
          .register("./service-worker.js", { updateViaCache: "none" })
          .then((reg) => {
            reg.addEventListener("updatefound", () => {
              const newWorker = reg.installing;
              newWorker.addEventListener("statechange", () => {
                if (
                  newWorker.state === "installed" &&
                  navigator.serviceWorker.controller
                ) {
                  if (window.portfolioApp && window.portfolioApp.notifyUpdate) {
                    window.portfolioApp.notifyUpdate();
                  }
                }
              });
            });
          });
      }

      window.portfolioApp = {
        _updateCallback: null,
        _dotnetScrollRef: null,

        initServiceWorkerWatcher: function (dotnetRef) {
          window.portfolioApp._updateCallback = dotnetRef;
        },

        notifyUpdate: function () {
          if (window.portfolioApp._updateCallback) {
            window.portfolioApp._updateCallback.invokeMethodAsync(
              "NotifyUpdateAvailable",
            );
          }
        },

        initScrollWatcher: function (dotnetRef) {
          window.portfolioApp._dotnetScrollRef = dotnetRef;
          window.addEventListener(
            "scroll",
            () => {
              const scrolled = window.scrollY > 60;
              dotnetRef.invokeMethodAsync("OnScroll", scrolled);
            },
            { passive: true },
          );
        },
      };