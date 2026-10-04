import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Hero } from '@/components/sections/Hero';
import { IdeaGenerator } from '@/components/sections/IdeaGenerator';
import { RegistrationForm } from '@/components/forms/RegistrationForm';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow flex flex-col">
        <Hero />
        
        {/* Why Attend Section */}
        <section className="py-24 bg-bg-dark border-y border-border/40 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
          <div className="absolute left-0 right-0 top-0 -z-10 m-auto h-[310px] w-[310px] rounded-full bg-primary opacity-20 blur-[100px]"></div>
          
          <div className="max-w-7xl mx-auto relative z-10">
            <h2 className="text-4xl font-extrabold text-center mb-16 text-white">Why you should attend</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {['Build a real project', 'Use AI tools effectively', 'Resume-ready portfolio piece', 'Verifiable Certificate'].map((title, i) => (
                <div key={i} className="bg-card/40 backdrop-blur-md p-8 rounded-2xl border border-border/50 flex flex-col items-center text-center hover:bg-card hover:border-primary/50 hover:shadow-[0_0_30px_rgba(0,229,255,0.15)] transition-all group duration-300 transform hover:-translate-y-2">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 text-primary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <span className="text-2xl font-black">{i + 1}</span>
                  </div>
                  <h3 className="font-bold text-xl text-white">{title}</h3>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="py-24 px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-3xl mx-auto relative z-10">
            <h2 className="text-4xl font-extrabold text-center mb-16 text-white">60-Minute Timeline</h2>
            <div className="space-y-6">
              {[
                { time: '0-10 min', title: 'Setup & Intro' },
                { time: '10-30 min', title: 'Build the Core AI Features' },
                { time: '30-50 min', title: 'Polish & Deploy' },
                { time: '50-60 min', title: 'Showcase & Q&A' },
              ].map((step, i) => (
                <div key={i} className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 p-6 bg-card/60 backdrop-blur-sm rounded-2xl border border-border hover:border-primary/30 transition-colors shadow-lg">
                  <span className="text-primary font-mono text-xl font-bold whitespace-nowrap bg-primary/10 px-4 py-2 rounded-lg">{step.time}</span>
                  <div className="hidden sm:block h-px bg-border flex-grow"></div>
                  <span className="font-bold text-xl text-white">{step.title}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-24 bg-bg-darker border-y border-border/40 px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-4xl font-extrabold text-center mb-16 text-white">Frequently Asked Questions</h2>
            <div className="space-y-6">
              {[
                { q: 'Is it really free?', a: 'Yes, 100% free for college students.' },
                { q: 'Do I need a laptop?', a: 'Yes, you need a laptop and internet connection to build along.' },
                { q: 'Will I get a certificate?', a: 'Yes, upon successful project submission.' }
              ].map((faq, i) => (
                <details key={i} className="bg-card/40 backdrop-blur-md p-6 rounded-2xl border border-border/50 group hover:border-primary/30 transition-colors">
                  <summary className="font-bold text-lg cursor-pointer list-none flex justify-between items-center text-white">
                    {faq.q}
                    <span className="text-primary font-bold text-2xl group-open:rotate-45 transition-transform duration-300 flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">+</span>
                  </summary>
                  <p className="mt-6 text-muted text-base leading-relaxed border-t border-border pt-4">{faq.a}</p>
                </details>
              ))}
            </div>
          </div>
        </section>

        <IdeaGenerator />

        {/* Registration form section */}
        <div className="py-8">
          <RegistrationForm />
        </div>

      </main>
      <Footer />
    </div>
  );
}
