"use client"
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Hero } from '@/components/sections/Hero';
import { IdeaGenerator } from '@/components/sections/IdeaGenerator';
import { RegistrationForm } from '@/components/forms/RegistrationForm';
import { motion } from 'framer-motion';
import { useState } from 'react';

export default function Home() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
  };

  return (
    <div className="min-h-screen flex flex-col bg-bg-dark text-white selection:bg-primary/30 selection:text-primary">
      <Navbar />
      
      <main className="flex-grow flex flex-col overflow-hidden">
        <Hero />
        
        {/* Why Attend Section */}
        <section className="py-32 bg-bg-darker border-y border-white/5 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
          {/* Subtle Grid Background */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:32px_32px]"></div>
          
          {/* Glowing Orbs */}
          <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[500px] w-[500px] rounded-full bg-primary/20 blur-[150px] pointer-events-none"></div>
          
          <div className="max-w-7xl mx-auto relative z-10">
            <motion.div 
              initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }}
              variants={fadeInUp}
              className="text-center mb-20"
            >
              <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">Why you should attend</h2>
              <p className="text-xl text-muted max-w-2xl mx-auto">Stop watching tutorials and start building. This is what you'll walk away with.</p>
            </motion.div>

            <motion.div 
              variants={staggerContainer}
              initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
            >
              {[
                { title: 'Build a real project', icon: 'M13 10V3L4 14h7v7l9-11h-7z' },
                { title: 'Use AI tools effectively', icon: 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
                { title: 'Resume-ready portfolio', icon: 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
                { title: 'Verifiable Certificate', icon: 'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z' }
              ].map((item, i) => (
                <motion.div 
                  variants={fadeInUp}
                  key={i} 
                  className="bg-card/40 backdrop-blur-xl p-8 rounded-3xl border border-white/10 flex flex-col items-center text-center hover:bg-card hover:border-primary/50 transition-all group duration-500 transform hover:-translate-y-4 hover:shadow-[0_20px_40px_rgba(0,229,255,0.15)] relative overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/30 to-primary/5 text-primary flex items-center justify-center mb-8 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-500 relative z-10">
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon}></path></svg>
                  </div>
                  <h3 className="font-bold text-2xl text-white relative z-10 leading-tight">{item.title}</h3>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        <IdeaGenerator />

        {/* Timeline */}
        <section className="py-32 px-4 sm:px-6 lg:px-8 relative bg-bg-dark">
          <div className="max-w-4xl mx-auto relative z-10">
            <motion.div 
              initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }}
              variants={fadeInUp}
              className="text-center mb-20"
            >
              <h2 className="text-4xl md:text-6xl font-black mb-6 text-white tracking-tight">60-Minute Timeline</h2>
              <p className="text-xl text-muted">A fast-paced, no-fluff workshop designed to maximize your time.</p>
            </motion.div>
            
            <motion.div 
              variants={staggerContainer}
              initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }}
              className="space-y-6 relative"
            >
              <div className="absolute left-8 md:left-24 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-primary/50 to-transparent hidden sm:block"></div>
              
              {[
                { time: '0-10 min', title: 'Setup & Introduction', desc: 'Get your environment ready and understand the core concepts.' },
                { time: '10-30 min', title: 'Build the Core AI Features', desc: 'Write code alongside the instructor to integrate AI capabilities.' },
                { time: '30-50 min', title: 'Polish & Deploy', desc: 'Refine the UI and push your live project to the web.' },
                { time: '50-60 min', title: 'Showcase & Q&A', desc: 'Show off what you built and get answers to your questions.' },
              ].map((step, i) => (
                <motion.div 
                  variants={fadeInUp}
                  key={i} 
                  className="flex flex-col sm:flex-row gap-6 p-8 bg-card/40 backdrop-blur-md rounded-3xl border border-white/5 hover:border-primary/30 transition-colors shadow-2xl relative group"
                >
                  <div className="sm:w-48 flex-shrink-0 relative z-10">
                    <span className="inline-block bg-primary text-bg-darker font-black text-lg px-6 py-2 rounded-xl shadow-[0_0_20px_rgba(0,229,255,0.3)]">{step.time}</span>
                  </div>
                  <div className="relative z-10">
                    <h3 className="font-bold text-2xl text-white mb-2 group-hover:text-primary transition-colors">{step.title}</h3>
                    <p className="text-muted text-lg">{step.desc}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-32 bg-bg-darker border-y border-white/5 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
          <div className="absolute right-0 bottom-0 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[200px] pointer-events-none translate-x-1/3 translate-y-1/3"></div>
          
          <div className="max-w-3xl mx-auto relative z-10">
            <motion.div 
              initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }}
              variants={fadeInUp}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-6xl font-black mb-6 text-white tracking-tight">Got Questions?</h2>
            </motion.div>

            <motion.div 
              variants={staggerContainer}
              initial="hidden" whileInView="show" viewport={{ once: true, margin: "-100px" }}
              className="space-y-4"
            >
              {[
                { q: 'Is it really free?', a: 'Yes, 100% free for college students. We believe in democratizing access to high-quality tech education.' },
                { q: 'Do I need prior coding experience?', a: 'Basic understanding of HTML/CSS and any programming language will help, but we will guide you step-by-step.' },
                { q: 'Do I need a laptop?', a: 'Yes, you need a laptop and a stable internet connection to code along with the instructor.' },
                { q: 'Will I get a certificate?', a: 'Yes, you will receive a verifiable certificate upon successful completion and submission of your project.' }
              ].map((faq, i) => (
                <motion.div 
                  variants={fadeInUp}
                  key={i} 
                  className={`bg-card/40 backdrop-blur-xl rounded-2xl border transition-all duration-300 overflow-hidden cursor-pointer ${activeFaq === i ? 'border-primary/50 shadow-[0_10px_30px_rgba(0,229,255,0.1)]' : 'border-white/10 hover:border-white/30'}`}
                  onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                >
                  <div className="p-6 md:p-8 flex justify-between items-center">
                    <h3 className="font-bold text-xl text-white pr-8">{faq.q}</h3>
                    <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-300 ${activeFaq === i ? 'bg-primary text-bg-darker' : 'bg-white/5 text-white'}`}>
                      <svg className={`w-5 h-5 transition-transform duration-300 ${activeFaq === i ? 'rotate-45' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4"></path></svg>
                    </div>
                  </div>
                  <motion.div 
                    initial={false}
                    animate={{ height: activeFaq === i ? 'auto' : 0, opacity: activeFaq === i ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <p className="px-6 md:px-8 pb-6 md:pb-8 text-muted text-lg leading-relaxed border-t border-white/5 pt-4 mt-2">
                      {faq.a}
                    </p>
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Registration form section */}
        <div className="py-20 relative bg-bg-dark">
          <RegistrationForm />
        </div>

      </main>
      <Footer />
    </div>
  );
}
