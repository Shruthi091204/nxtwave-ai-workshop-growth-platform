"use client"
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { motion } from 'framer-motion';

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

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { 
      opacity: 1, 
      y: 0, 
      transition: { duration: 0.6, ease: "easeOut", staggerChildren: 0.1 } 
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  return (
    <section id="register" className="py-20 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto relative">
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="bg-card/40 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 sm:p-12 shadow-[0_0_50px_rgba(0,0,0,0.5)] relative overflow-hidden group"
      >
        {/* Animated Background Gradients */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-[100px] -mr-32 -mt-32 transition-transform duration-1000 group-hover:scale-110 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/20 rounded-full blur-[100px] -ml-32 -mb-32 transition-transform duration-1000 group-hover:scale-110 pointer-events-none"></div>
        
        <div className="relative z-10 text-center mb-10">
          <motion.h2 variants={itemVariants} className="text-3xl sm:text-5xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white to-white/60">
            Secure Your Spot
          </motion.h2>
          <motion.p variants={itemVariants} className="text-muted text-lg">Takes less than 30 seconds. No credit card required.</motion.p>
        </div>

        <form onSubmit={handleSubmit} className="relative z-10 space-y-6">
          <motion.div variants={itemVariants}>
            <label htmlFor="name" className="block text-sm font-bold text-muted mb-2 ml-1">Full Name</label>
            <div className="relative">
              <input 
                required type="text" id="name" name="name" value={formData.name} onChange={handleChange}
                className="w-full bg-bg-dark/50 border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all backdrop-blur-sm peer"
                placeholder="John Doe"
              />
              <div className="absolute inset-0 rounded-xl border border-primary/0 peer-focus:border-primary/50 pointer-events-none transition-colors"></div>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <motion.div variants={itemVariants}>
              <label htmlFor="email" className="block text-sm font-bold text-muted mb-2 ml-1">Email Address</label>
              <input 
                required type="email" id="email" name="email" value={formData.email} onChange={handleChange}
                className="w-full bg-bg-dark/50 border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all backdrop-blur-sm"
                placeholder="john@example.com"
              />
            </motion.div>
            <motion.div variants={itemVariants}>
              <label htmlFor="whatsapp" className="block text-sm font-bold text-muted mb-2 ml-1">WhatsApp Number</label>
              <input 
                required type="tel" id="whatsapp" name="whatsapp" pattern="[0-9]{10}" title="Please enter a 10-digit mobile number" value={formData.whatsapp} onChange={handleChange}
                className="w-full bg-bg-dark/50 border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all backdrop-blur-sm"
                placeholder="9876543210"
              />
            </motion.div>
          </div>

          <motion.div variants={itemVariants}>
            <label htmlFor="college" className="block text-sm font-bold text-muted mb-2 ml-1">College Name</label>
            <input 
              required type="text" id="college" name="college" value={formData.college} onChange={handleChange}
              className="w-full bg-bg-dark/50 border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all backdrop-blur-sm"
              placeholder="Your Engineering College"
            />
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <motion.div variants={itemVariants}>
              <label htmlFor="branch" className="block text-sm font-bold text-muted mb-2 ml-1">Branch</label>
              <select 
                required id="branch" name="branch" value={formData.branch} onChange={handleChange}
                className="w-full bg-bg-dark/50 border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all appearance-none backdrop-blur-sm cursor-pointer"
              >
                <option value="" disabled className="bg-bg-dark text-muted">Select Branch</option>
                <option value="CSE/IT" className="bg-bg-dark">CSE / IT</option>
                <option value="ECE" className="bg-bg-dark">ECE</option>
                <option value="Mechanical" className="bg-bg-dark">Mechanical</option>
                <option value="Civil" className="bg-bg-dark">Civil</option>
                <option value="Other" className="bg-bg-dark">Other</option>
              </select>
            </motion.div>
            <motion.div variants={itemVariants}>
              <label htmlFor="grad_year" className="block text-sm font-bold text-muted mb-2 ml-1">Graduation Year</label>
              <select 
                required id="grad_year" name="grad_year" value={formData.grad_year} onChange={handleChange}
                className="w-full bg-bg-dark/50 border border-white/10 rounded-xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all appearance-none backdrop-blur-sm cursor-pointer"
              >
                <option value="2024" className="bg-bg-dark">2024 (Final Year)</option>
                <option value="2025" className="bg-bg-dark">2025</option>
                <option value="2026" className="bg-bg-dark">2026</option>
                <option value="other" className="bg-bg-dark">Other</option>
              </select>
            </motion.div>
          </div>

          {errorMsg && (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm font-medium text-center">
              {errorMsg}
            </motion.div>
          )}

          <motion.button 
            variants={itemVariants}
            type="submit" 
            disabled={isSubmitting}
            className="w-full relative group/btn overflow-hidden rounded-xl mt-6 p-[2px]"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-primary via-accent to-primary rounded-xl opacity-70 group-hover/btn:opacity-100 transition-opacity duration-300"></span>
            <div className="relative bg-bg-darker px-8 py-5 rounded-xl transition-all duration-300 group-hover/btn:bg-transparent flex justify-center items-center gap-3">
              {isSubmitting ? (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <span className="font-bold text-lg text-white group-hover/btn:text-white transition-colors">Complete Registration</span>
              )}
            </div>
          </motion.button>
        </form>
      </motion.div>
    </section>
  );
}
