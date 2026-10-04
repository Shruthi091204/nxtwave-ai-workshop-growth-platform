"use client"
import { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { submitProject } from '@/app/actions';

export default function SubmitPage() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  
  const [formData, setFormData] = useState({
    email: '',
    title: '',
    url: '',
    description: '',
    is_public: true
  });

  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    const savedEmail = localStorage.getItem('workshop_email');
    if (savedEmail) setFormData(prev => ({ ...prev, email: savedEmail }));
  }, []);

  const handleEvaluate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    try {
      // 1. Evaluate via AI API
      const aiRes = await fetch('/api/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const aiData = await aiRes.json();
      if (!aiRes.ok || !aiData.score) {
        throw new Error(aiData.error || "Failed to analyze project");
      }

      // 2. Save to database
      const saveRes = await submitProject({
        ...formData,
        score_data: aiData.score
      });

      if (!saveRes.success) {
        throw new Error(saveRes.error || "Failed to save submission");
      }

      setResult(aiData.score);
      setStep(2);
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  const downloadCertificate = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-bg-dark flex flex-col">
      <div className="print:hidden"><Navbar /></div>
      
      <main className="flex-grow pt-24 pb-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
        
        {step === 1 && (
          <div className="bg-card border border-border p-6 md:p-10 rounded-2xl shadow-xl print:hidden">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold mb-2">Project Evaluator</h1>
              <p className="text-muted">Submit your AI project to get instant feedback and your certificate.</p>
            </div>

            <form onSubmit={handleEvaluate} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-muted mb-1">Registered Email</label>
                <input 
                  required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
                  className="w-full bg-bg-darker border border-border rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-primary outline-none"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-muted mb-1">Project Title</label>
                <input 
                  required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})}
                  className="w-full bg-bg-darker border border-border rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-primary outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-muted mb-1">Live Demo or GitHub URL</label>
                <input 
                  required type="url" placeholder="https://" value={formData.url} onChange={e => setFormData({...formData, url: e.target.value})}
                  className="w-full bg-bg-darker border border-border rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-primary outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-muted mb-1">Short Description (max 3 lines)</label>
                <textarea 
                  required rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}
                  className="w-full bg-bg-darker border border-border rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-primary outline-none resize-none"
                ></textarea>
              </div>

              <div className="flex items-center gap-3 bg-bg-darker p-4 rounded-lg border border-border">
                <input 
                  type="checkbox" id="public" checked={formData.is_public} onChange={e => setFormData({...formData, is_public: e.target.checked})}
                  className="w-5 h-5 accent-primary"
                />
                <label htmlFor="public" className="text-sm font-medium cursor-pointer">
                  Showcase my project in the public gallery
                </label>
              </div>

              {errorMsg && <div className="p-3 bg-red-500/10 border border-red-500/50 text-red-400 rounded text-sm text-center">{errorMsg}</div>}

              <button 
                type="submit" disabled={loading}
                className="w-full bg-primary hover:bg-primary-hover disabled:bg-primary/50 text-white font-bold py-4 rounded-xl transition-colors flex justify-center items-center gap-2"
              >
                {loading ? "Analyzing Project..." : "Submit & Evaluate"}
              </button>
            </form>
          </div>
        )}

        {step === 2 && result && (
          <div className="space-y-8">
            <div className="print:hidden text-center mb-8">
              <h1 className="text-3xl font-bold mb-2">Evaluation Complete!</h1>
              <p className="text-muted">Here is your AI-generated feedback and certificate.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 print:hidden">
              <div className="md:col-span-1 bg-card border border-border p-6 rounded-2xl flex flex-col items-center justify-center text-center">
                <div className="relative w-40 h-40 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="10" fill="transparent" className="text-bg-darker" />
                    <circle cx="80" cy="80" r="70" stroke="currentColor" strokeWidth="10" fill="transparent" strokeDasharray="439.8" strokeDashoffset={439.8 - (439.8 * result.total) / 100} className="text-primary transition-all duration-1000 ease-out" />
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="text-4xl font-bold">{result.total}</span>
                    <span className="text-xs text-muted">/ 100</span>
                  </div>
                </div>
                <div className="mt-6 text-xl font-bold text-accent">
                  {result.total >= 90 ? 'Top Builder Badge 🏆' : result.total >= 70 ? 'Shipper Badge 🚀' : 'Builder Badge 🛠️'}
                </div>
              </div>

              <div className="md:col-span-2 bg-card border border-border p-6 rounded-2xl">
                <h3 className="text-lg font-bold mb-4">Detailed Feedback</h3>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-bg-darker p-3 rounded-lg border border-border">
                    <div className="text-xs text-muted">Idea & Originality</div>
                    <div className="font-bold">{result.idea} / 20</div>
                  </div>
                  <div className="bg-bg-darker p-3 rounded-lg border border-border">
                    <div className="text-xs text-muted">Working Demo</div>
                    <div className="font-bold">{result.working_demo} / 25</div>
                  </div>
                  <div className="bg-bg-darker p-3 rounded-lg border border-border">
                    <div className="text-xs text-muted">Use of AI</div>
                    <div className="font-bold">{result.use_of_AI} / 25</div>
                  </div>
                  <div className="bg-bg-darker p-3 rounded-lg border border-border">
                    <div className="text-xs text-muted">UI/UX Quality</div>
                    <div className="font-bold">{result.UI_quality} / 15</div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="text-sm font-bold text-success flex items-center gap-2"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg> Strengths</h4>
                    <ul className="text-sm text-gray-300 list-disc list-inside mt-1">
                      {result.strengths?.map((s:string, i:number) => <li key={i}>{s}</li>)}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-accent flex items-center gap-2"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg> Next Step</h4>
                    <p className="text-sm text-gray-300 mt-1">{result.next_step}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-center print:hidden">
              <button onClick={downloadCertificate} className="bg-bg-darker border border-primary hover:bg-primary text-white font-bold py-3 px-8 rounded-xl transition-colors">
                Download Certificate PDF
              </button>
            </div>

            {/* Printable Certificate (Hidden on screen, visible on print) */}
            <div className="hidden print:block border-8 border-border p-16 text-center m-10 outline outline-4 outline-offset-4 outline-primary">
              <h1 className="text-5xl font-serif mb-6 text-black">Certificate of Completion</h1>
              <p className="text-xl mb-4 text-gray-700">This certifies that</p>
              <h2 className="text-4xl font-bold mb-4 text-black border-b-2 border-gray-300 inline-block pb-2">{formData.email.split('@')[0]}</h2>
              <p className="text-xl mb-8 text-gray-700">has successfully built and deployed an AI project:</p>
              <h3 className="text-2xl font-bold mb-12 text-primary">{formData.title}</h3>
              <p className="text-lg mb-16 text-gray-600">During the NxtWave "Build Your First AI Project in 60 Minutes" Workshop</p>
              
              <div className="flex justify-between items-end px-20">
                <div className="text-center">
                  <div className="border-t border-black pt-2 w-48 mx-auto font-bold text-black">Instructor</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-black mb-2">{result.total} / 100</div>
                  <div className="text-sm text-gray-500">AI Evaluation Score</div>
                </div>
                <div className="text-center">
                  <div className="border-t border-black pt-2 w-48 mx-auto font-bold text-black">Date</div>
                  <div className="text-black">{new Date().toLocaleDateString()}</div>
                </div>
              </div>
            </div>

          </div>
        )}
      </main>
      <div className="print:hidden"><Footer /></div>

      <style jsx global>{`
        @media print {
          body { background: white; color: black; }
          .print\\:hidden { display: none !important; }
          .print\\:block { display: block !important; }
        }
      `}</style>
    </div>
  );
}
