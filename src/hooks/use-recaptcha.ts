import { useEffect, useCallback, useRef } from 'react';

declare global {
  interface Window {
    grecaptcha: {
      ready: (callback: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
    };
  }
}

const RECAPTCHA_SITE_KEY = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

export function useRecaptcha() {
  const isLoaded = useRef(false);

  useEffect(() => {
    if (isLoaded.current || !RECAPTCHA_SITE_KEY) return;

    // Check if script is already loaded
    if (document.querySelector(`script[src*="recaptcha"]`)) {
      isLoaded.current = true;
      return;
    }

    const script = document.createElement('script');
    script.src = `https://www.google.com/recaptcha/api.js?render=${RECAPTCHA_SITE_KEY}`;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);
    isLoaded.current = true;

    return () => {
      // Cleanup is optional since reCAPTCHA script persists
    };
  }, []);

  const executeRecaptcha = useCallback(async (action: string): Promise<string | null> => {
    if (!RECAPTCHA_SITE_KEY) {
      console.warn('reCAPTCHA site key not configured');
      return null;
    }

    return new Promise((resolve) => {
      if (!window.grecaptcha) {
        console.warn('reCAPTCHA not loaded yet');
        resolve(null);
        return;
      }

      window.grecaptcha.ready(async () => {
        try {
          const token = await window.grecaptcha.execute(RECAPTCHA_SITE_KEY, { action });
          resolve(token);
        } catch (error) {
          console.error('reCAPTCHA execution error:', error);
          resolve(null);
        }
      });
    });
  }, []);

  return { executeRecaptcha };
}
