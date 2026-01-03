import { useEffect, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

// Generate or retrieve session ID
function getSessionId(): string {
  const key = 'fenix_session_id';
  let sessionId = sessionStorage.getItem(key);
  
  if (!sessionId) {
    sessionId = crypto.randomUUID();
    sessionStorage.setItem(key, sessionId);
  }
  
  return sessionId;
}

// Parse UTM parameters from URL
function getUtmParams(): Record<string, string | null> {
  const params = new URLSearchParams(window.location.search);
  
  return {
    utm_source: params.get('utm_source'),
    utm_medium: params.get('utm_medium'),
    utm_campaign: params.get('utm_campaign'),
    utm_term: params.get('utm_term'),
    utm_content: params.get('utm_content'),
  };
}

// Store UTM params in session for persistence across pages
function persistUtmParams() {
  const utmParams = getUtmParams();
  const hasUtm = Object.values(utmParams).some(v => v !== null);
  
  if (hasUtm) {
    sessionStorage.setItem('fenix_utm_params', JSON.stringify(utmParams));
  }
}

// Get stored UTM params
function getStoredUtmParams(): Record<string, string | null> {
  const stored = sessionStorage.getItem('fenix_utm_params');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return { utm_source: null, utm_medium: null, utm_campaign: null, utm_term: null, utm_content: null };
    }
  }
  return getUtmParams();
}

export function usePageTracking() {
  const location = useLocation();
  const currentVisitId = useRef<string | null>(null);
  const pageEntryTime = useRef<number>(Date.now());
  const trackedPaths = useRef<Set<string>>(new Set());

  // Track page exit
  const trackExit = useCallback(async () => {
    if (!currentVisitId.current) return;
    
    const timeOnPage = Math.round((Date.now() - pageEntryTime.current) / 1000);
    
    try {
      await supabase.rpc('track_page_exit', {
        p_visit_id: currentVisitId.current,
        p_time_on_page: timeOnPage
      });
    } catch (err) {
      // Silent fail for exit tracking
    }
  }, []);

  useEffect(() => {
    // Persist UTM params on first load
    persistUtmParams();
    
    const trackVisit = async () => {
      const path = location.pathname;
      
      // Track exit from previous page
      if (currentVisitId.current) {
        await trackExit();
      }
      
      // Reset entry time for new page
      pageEntryTime.current = Date.now();
      
      const sessionId = getSessionId();
      const utmParams = getStoredUtmParams();
      
      try {
        const { data, error } = await supabase.rpc('track_detailed_visit', {
          p_session_id: sessionId,
          p_page_path: path,
          p_referrer: document.referrer || null,
          p_utm_source: utmParams.utm_source,
          p_utm_medium: utmParams.utm_medium,
          p_utm_campaign: utmParams.utm_campaign,
          p_utm_term: utmParams.utm_term,
          p_utm_content: utmParams.utm_content,
          p_user_agent: navigator.userAgent,
          p_screen_width: window.screen.width,
          p_screen_height: window.screen.height,
          p_language: navigator.language
        });

        if (error) {
          return;
        }

        currentVisitId.current = data as string;
        trackedPaths.current.add(path);
      } catch (err) {
        // Silent fail
      }
    };

    trackVisit();

    // Track exit on page unload
    const handleBeforeUnload = () => {
      if (currentVisitId.current) {
        const timeOnPage = Math.round((Date.now() - pageEntryTime.current) / 1000);
        
        // Use sendBeacon for reliable exit tracking
        const payload = JSON.stringify({
          p_visit_id: currentVisitId.current,
          p_time_on_page: timeOnPage
        });
        
        navigator.sendBeacon(
          `${import.meta.env.VITE_SUPABASE_URL}/rest/v1/rpc/track_page_exit`,
          new Blob([payload], { type: 'application/json' })
        );
      }
    };

    // Track visibility change (tab switch/minimize)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        handleBeforeUnload();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [location.pathname, trackExit]);
}
