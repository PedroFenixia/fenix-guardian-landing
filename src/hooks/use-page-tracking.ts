import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

export function usePageTracking() {
  const location = useLocation();
  const trackedPaths = useRef<Set<string>>(new Set());

  useEffect(() => {
    const trackVisit = async () => {
      const path = location.pathname;
      
      // Only track each path once per session to avoid inflating counts
      if (trackedPaths.current.has(path)) {
        return;
      }

      try {
        const { error } = await supabase.rpc('track_page_visit', {
          p_page_path: path
        });

        if (error) {
          console.error('Error tracking page visit:', error);
          return;
        }

        trackedPaths.current.add(path);
      } catch (err) {
        console.error('Failed to track page visit:', err);
      }
    };

    trackVisit();
  }, [location.pathname]);
}
