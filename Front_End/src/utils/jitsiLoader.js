/**
 * Utility to dynamically and safely load the Jitsi Meet External API script once.
 * 
 * @param {string} [domain='meet.jit.si']
 * @returns {Promise<any>} Resolves with window.JitsiMeetExternalAPI constructor
 */
let loadPromise = null;

export function loadJitsiScript(domain = 'meet.jit.si') {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('Window is undefined (SSR environment)'));
  }

  if (window.JitsiMeetExternalAPI) {
    return Promise.resolve(window.JitsiMeetExternalAPI);
  }

  if (loadPromise) {
    return loadPromise;
  }

  const scriptId = 'jitsi-external-api-script';
  const existingScript = document.getElementById(scriptId);

  if (existingScript) {
    loadPromise = new Promise((resolve, reject) => {
      existingScript.addEventListener('load', () => {
        if (window.JitsiMeetExternalAPI) {
          resolve(window.JitsiMeetExternalAPI);
        } else {
          reject(new Error('JitsiMeetExternalAPI not found on window after script load'));
        }
      });
      existingScript.addEventListener('error', () => {
        reject(new Error('Failed to load Jitsi Meet script'));
      });
    });
    return loadPromise;
  }

  loadPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.id = scriptId;
    script.src = `https://${domain}/external_api.js`;
    script.async = true;

    script.onload = () => {
      if (window.JitsiMeetExternalAPI) {
        resolve(window.JitsiMeetExternalAPI);
      } else {
        reject(new Error('JitsiMeetExternalAPI is undefined on window'));
      }
    };

    script.onerror = () => {
      loadPromise = null;
      script.remove();
      reject(new Error(`Failed to load Jitsi External API from https://${domain}/external_api.js`));
    };

    document.body.appendChild(script);
  });

  return loadPromise;
}
