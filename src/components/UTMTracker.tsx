"use client"
import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export function UTMTracker() {
  const searchParams = useSearchParams();

  useEffect(() => {
    // Run once on mount
    const utmSource = searchParams.get('utm_source');
    const utmMedium = searchParams.get('utm_medium');
    const utmCampaign = searchParams.get('utm_campaign');
    const ref = searchParams.get('ref');

    // Save to localStorage if present and not already saved
    if (utmSource && !localStorage.getItem('utm_source')) localStorage.setItem('utm_source', utmSource);
    if (utmMedium && !localStorage.getItem('utm_medium')) localStorage.setItem('utm_medium', utmMedium);
    if (utmCampaign && !localStorage.getItem('utm_campaign')) localStorage.setItem('utm_campaign', utmCampaign);
    if (ref && !localStorage.getItem('ref')) localStorage.setItem('ref', ref);

    // Track page_view event
    supabase.from('events').insert([
      { 
        type: 'page_view', 
        meta: { 
          path: window.location.pathname,
          utm_source: utmSource || localStorage.getItem('utm_source'),
          ref: ref || localStorage.getItem('ref')
        } 
      }
    ]).then(({ error }) => {
      // Supabase sometimes returns an empty object {} on fetch failures (like when not configured)
      if (error && Object.keys(error).length > 0) {
        console.error("Supabase tracking error:", error);
      }
    });

  }, [searchParams]);

  return null;
}
