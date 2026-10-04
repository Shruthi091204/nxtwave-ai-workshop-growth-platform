"use client"
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export function RegistrationForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    whatsapp: '',
    college: '',
    branch: '',
    grad_year: '2024'
  });

  const [errorMsg, setErrorMsg] = useState('');
  const [hasStarted, setHasStarted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');
    
    // Import action dynamically to avoid client-server boundary issues if needed, or just import at top
    const { registerStudent } = await import('@/app/actions');

    const result = await registerStudent({
      ...formData,
      source: 'web',
      utm_source: localStorage.getItem('utm_source'),
      utm_medium: localStorage.getItem('utm_medium'),
      utm_campaign: localStorage.getItem('utm_campaign'),
      referred_by: localStorage.getItem('ref'),
    });

    setIsSubmitting(false);

    if (result.success) {
      supabase.from('events').insert([{ type: 'form_submit', meta: { email: formData.email } }]).then(({ error }) => { if (error) console.error(error); });
      // Store our own code to show on thank you page
      if (result.referralCode) {
        localStorage.setItem('my_referral_code', result.referralCode);
      }
      router.push('/thank-you');
    } else {
      setErrorMsg(result.error || 'Failed to register. Please try again.');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (!hasStarted) {
      setHasStarted(true);
      supabase.from('events').insert([{ type: 'form_start', meta: { field: e.target.name } }]).then(({ error }) => { if (error) console.error(error); });
    }
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <section id="register" className="py-16 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
      <div className="bg-card border border-border rounded-2xl p-6 sm:p-10 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
        
        <div className="relative z-10 text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold mb-2">Secure Your Spot</h2>
          <p className="text-muted">Takes less than 30 seconds to register.</p>
        </div>

        <form onSubmit={handleSubmit} className="relative z-10 space-y-5">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-muted mb-1">Full Name</label>
            <input 
              required
              type="text" 
              id="name" 
              name="name" 
              value={formData.name}
              onChange={handleChange}
              className="w-full bg-bg-darker border border-border rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              placeholder="John Doe"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-muted mb-1">Email Address</label>
              <input 
                required
                type="email" 
                id="email" 
                name="email" 
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-bg-darker border border-border rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                placeholder="john@example.com"
              />
            </div>
            <div>
              <label htmlFor="whatsapp" className="block text-sm font-medium text-muted mb-1">WhatsApp Number</label>
              <input 
                required
                type="tel" 
                id="whatsapp" 
                name="whatsapp" 
                pattern="[0-9]{10}"
                title="Please enter a 10-digit mobile number"
                value={formData.whatsapp}
                onChange={handleChange}
                className="w-full bg-bg-darker border border-border rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                placeholder="9876543210"
              />
            </div>
          </div>

          <div>
            <label htmlFor="college" className="block text-sm font-medium text-muted mb-1">College Name</label>
            <input 
              required
              type="text" 
              id="college" 
              name="college" 
              value={formData.college}
              onChange={handleChange}
              className="w-full bg-bg-darker border border-border rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              placeholder="Your Engineering College"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label htmlFor="branch" className="block text-sm font-medium text-muted mb-1">Branch</label>
              <select 
                required
                id="branch" 
                name="branch" 
                value={formData.branch}
                onChange={handleChange}
                className="w-full bg-bg-darker border border-border rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all appearance-none"
              >
                <option value="">Select Branch</option>
                <option value="CSE/IT">CSE / IT</option>
                <option value="ECE">ECE</option>
                <option value="Mechanical">Mechanical</option>
                <option value="Civil">Civil</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label htmlFor="grad_year" className="block text-sm font-medium text-muted mb-1">Graduation Year</label>
              <select 
                required
                id="grad_year" 
                name="grad_year" 
                value={formData.grad_year}
                onChange={handleChange}
                className="w-full bg-bg-darker border border-border rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all appearance-none"
              >
                <option value="2024">2024 (Final Year)</option>
                <option value="2025">2025</option>
                <option value="2026">2026</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          {errorMsg && (
            <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-500 text-sm text-center">
              {errorMsg}
            </div>
          )}

          <button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-primary hover:bg-primary-hover disabled:bg-primary/50 text-white font-bold py-4 rounded-xl mt-4 transition-colors flex justify-center items-center gap-2"
          >
            {isSubmitting ? (
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            ) : "Complete Registration"}
          </button>
        </form>
      </div>
    </section>
  );
}
