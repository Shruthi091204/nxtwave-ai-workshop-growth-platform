"use server"
import { getServiceSupabase } from '@/lib/supabase';

export async function registerStudent(formData: {
  name: string;
  email: string;
  whatsapp: string;
  college: string;
  branch: string;
  grad_year: string;
  source: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  referred_by: string | null;
}) {
  try {
    // We are mocking this if environment variables are not set for smooth testing
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.warn("MOCK REGISTRATION: Supabase not configured");
      const mockReferralCode = Math.random().toString(36).substring(2, 8).toUpperCase();
      return { success: true, referralCode: mockReferralCode };
    }

    const supabase = getServiceSupabase();

    // Generate unique referral code
    const referralCode = Math.random().toString(36).substring(2, 8).toUpperCase();

    // Check if email exists
    const { data: existingUser } = await supabase
      .from('registrations')
      .select('referral_code')
      .eq('email', formData.email)
      .single();

    if (existingUser) {
      // Return existing referral code instead of failing, to let them view the thank you page again
      return { success: true, referralCode: existingUser.referral_code };
    }

    const { data, error } = await supabase
      .from('registrations')
      .insert([{
        name: formData.name,
        email: formData.email,
        whatsapp: formData.whatsapp,
        college: formData.college,
        branch: formData.branch,
        grad_year: formData.grad_year,
        source: formData.source || 'direct',
        utm_source: formData.utm_source,
        utm_medium: formData.utm_medium,
        utm_campaign: formData.utm_campaign,
        referred_by: formData.referred_by,
        referral_code: referralCode
      }])
      .select()
      .single();

    if (error) {
      console.error("Supabase insert error:", error);
      return { success: false, error: "Database error occurred." };
    }

    // Trigger n8n webhook (Phase G - non blocking)
    if (process.env.N8N_WEBHOOK_URL) {
      fetch(process.env.N8N_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event: 'registration',
          data: { ...formData, referralCode }
        })
      }).catch(err => console.error("Webhook error:", err));
    }

    return { success: true, referralCode };

  } catch (err: any) {
    console.error("Registration error:", err);
    return { success: false, error: err.message || "An unexpected error occurred." };
  }
}

export async function getReferralStats(referralCode: string) {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return { success: true, count: 0 }; // Mock if no DB
    }
    const supabase = getServiceSupabase();
    
    // Count how many registrations have this code as referred_by
    const { count, error } = await supabase
      .from('registrations')
      .select('*', { count: 'exact', head: true })
      .eq('referred_by', referralCode);

    if (error) {
      console.error("Error fetching referrals:", error);
      return { success: false, count: 0 };
    }

    return { success: true, count: count || 0 };
  } catch (e) {
    return { success: false, count: 0 };
  }
}

export async function getLeaderboardStats() {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return { topColleges: [], topReferrers: [] };
    }
    const supabase = getServiceSupabase();
    
    // Fetch all registrations (lightweight enough for 500-1000 rows)
    const { data, error } = await supabase.from('registrations').select('college, referred_by');
    if (error || !data) return { topColleges: [], topReferrers: [] };

    const collegeCounts: Record<string, number> = {};
    const referrerCounts: Record<string, number> = {};

    data.forEach(reg => {
      if (reg.college) {
        collegeCounts[reg.college] = (collegeCounts[reg.college] || 0) + 1;
      }
      if (reg.referred_by) {
        referrerCounts[reg.referred_by] = (referrerCounts[reg.referred_by] || 0) + 1;
      }
    });

    const topColleges = Object.entries(collegeCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([name, count]) => ({ name, count }));

    const topReferrers = Object.entries(referrerCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([code, count]) => ({ code, count }));

    return { topColleges, topReferrers };
  } catch (e) {
    return { topColleges: [], topReferrers: [] };
  }
}

export async function getAdminStats() {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return { registrations: [], events: [] };
    }
    const supabase = getServiceSupabase();
    const { data: registrations } = await supabase.from('registrations').select('*').order('created_at', { ascending: true });
    const { data: events } = await supabase.from('events').select('*');
    
    return { registrations: registrations || [], events: events || [] };
  } catch (e) {
    return { registrations: [], events: [] };
  }
}

export async function verifyAdminPassword(password: string) {
  const correctPassword = process.env.ADMIN_PASSWORD || 'admin123';
  return password === correctPassword;
}

export async function submitProject(formData: {
  email: string;
  title: string;
  url: string;
  description: string;
  is_public: boolean;
  score_data: any;
}) {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return { success: true }; // Mock
    }
    const supabase = getServiceSupabase();

    // 1. Verify email exists in registrations
    const { data: user } = await supabase.from('registrations').select('email').eq('email', formData.email).single();
    if (!user) {
      return { success: false, error: "Email not found. You must be registered to submit." };
    }

    // 2. Check submission limit (max 3)
    const { count } = await supabase.from('submissions').select('*', { count: 'exact', head: true }).eq('email', formData.email);
    if (count !== null && count >= 3) {
      return { success: false, error: "Maximum limit of 3 submissions reached." };
    }

    // 3. Insert submission
    const { error } = await supabase.from('submissions').insert([{
      email: formData.email,
      title: formData.title,
      url: formData.url,
      description: formData.description,
      is_public: formData.is_public,
      score_data: formData.score_data
    }]);

    if (error) throw error;
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to save submission." };
  }
}

export async function getShowcaseProjects() {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return []; 
    }
    const supabase = getServiceSupabase();
    const { data } = await supabase
      .from('submissions')
      .select('*')
      .eq('is_public', true)
      .order('created_at', { ascending: false })
      .limit(50);
      
    if (!data) return [];
    
    // Sort by total score from JSONB using JS (or we could do an RPC, but JS is fine for 50 records)
    return data.sort((a, b) => {
      const scoreA = a.score_data?.total || 0;
      const scoreB = b.score_data?.total || 0;
      return scoreB - scoreA;
    });
  } catch (e) {
    return [];
  }
}





