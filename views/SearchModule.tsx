
import React, { useState } from 'react';
import { NoteContent, User } from '../types.ts';
import { webSearchNotes } from '../services/geminiService.ts';
import { Search, Sparkles, Globe, Loader2, History, ArrowRight, ShieldCheck, Clock, Layers, Bookmark } from 'lucide-react';

interface SearchModuleProps {
  user: User;
  onNoteGenerated: (note: NoteContent) => void;
}

const SearchModule: React.FC<SearchModuleProps> = ({ user, onNoteGenerated }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<'Academic' | 'Latest' | 'Tutorials'>('Academic');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    try {
      const { notes } = await webSearchNotes(`${filter} focus: ${query}`);
      const historyKey = `edugenius_history_${user.id}`;
      const history = JSON.parse(localStorage.getItem(historyKey) || '[]');
      localStorage.setItem(historyKey, JSON.stringify([notes, ...history].slice(0, 20)));
      onNoteGenerated(notes);
    } catch (err) {
      alert("AI explorer encountered an error. Try a specific research query.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-20 py-10">
      <section className="text-center space-y-8 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-3 px-6 py-2 bg-indigo-50/50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-indigo-100 dark:border-indigo-800 animate-fade-up">
          <Layers className="w-4 h-4" /> Global Knowledge Explorer
        </div>
        <h2 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white tracking-tight leading-[1.1] animate-fade-up" style={{ animationDelay: '0.1s' }}>
          Uncover Deep <br/>
          <span className="text-gradient">Grounding Truth.</span>
        </h2>
        <p className="text-lg text-slate-500 dark:text-slate-400 font-medium leading-relaxed max-w-2xl mx-auto animate-fade-up" style={{ animationDelay: '0.2s' }}>
          Explore high-density study materials generated from peer-reviewed journals and high-trust academic archives.
        </p>
      </section>

      <div className="bg-white dark:bg-slate-900/50 rounded-[4rem] p-4 sm:p-8 shadow-premium border border-slate-200/50 dark:border-white/5 max-w-4xl mx-auto backdrop-blur-3xl animate-fade-up" style={{ animationDelay: '0.3s' }}>
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-5 items-center">
          <div className="flex-1 w-full relative group">
            <Search className="absolute left-8 top-1/2 -translate-y-1/2 w-7 h-7 text-slate-400 transition-colors group-focus-within:text-brand-600" />
            <input 
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="What are we researching today?"
              className="w-full bg-slate-50 dark:bg-slate-950/80 border-none rounded-[3rem] px-10 py-8 pl-20 focus:outline-none focus:ring-4 focus:ring-brand-500/10 transition-all font-bold text-xl text-slate-900 dark:text-white shadow-inner"
            />
          </div>
          <button 
            type="submit"
            disabled={loading || !query}
            className="w-full sm:w-auto bg-gradient-to-br from-brand-600 to-indigo-600 hover:scale-105 text-white px-14 py-8 rounded-[3rem] font-black text-sm flex items-center justify-center gap-4 shadow-2xl shadow-brand-500/30 disabled:opacity-30 transition-all active:scale-95"
          >
            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Sparkles className="w-6 h-6" />}
            Generate Insights
          </button>
        </form>
        
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {['Academic', 'Latest', 'Tutorials'].map((f, i) => (
            <button 
              key={f}
              onClick={() => setFilter(f as any)}
              className={`px-8 py-3 rounded-full font-black text-[11px] uppercase tracking-widest transition-all ${
                filter === f 
                ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-xl scale-105' 
                : 'bg-slate-100/50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {f} Focus
            </button>
          ))}
        </div>
      </div>

      <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto animate-fade-up" style={{ animationDelay: '0.5s' }}>
        <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-[3.5rem] border border-slate-100 dark:border-white/5 p-12 space-y-10">
           <div className="flex items-center justify-between">
             <h4 className="text-xs font-black text-slate-400 uppercase tracking-[0.3em] flex items-center gap-3">
               <History className="w-5 h-5" /> Global Research Pulse
             </h4>
             <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse"></span>
           </div>
           <div className="grid sm:grid-cols-2 gap-4">
             {['Vector Embeddings in LLMs', 'Neural Plasticity basics', 'Black-Scholes Model', 'Graph Neural Networks'].map((item, i) => (
               <button 
                 key={i} 
                 onClick={() => setQuery(item)}
                 className="w-full flex items-center justify-between p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl hover:bg-white dark:hover:bg-slate-800 hover:shadow-xl hover:-translate-y-1 transition-all group border border-transparent hover:border-brand-500/20"
               >
                 <div className="flex items-center gap-4 overflow-hidden">
                   <Bookmark className="w-5 h-5 text-slate-300 group-hover:text-brand-500 shrink-0" />
                   <span className="text-sm font-black text-slate-700 dark:text-slate-300 truncate">{item}</span>
                 </div>
                 <ArrowRight className="w-5 h-5 text-slate-200 group-hover:text-brand-600 transition-all shrink-0" />
               </button>
             ))}
           </div>
        </div>

        <div className="bg-gradient-to-br from-brand-600 to-accent-600 p-12 rounded-[3.5rem] flex flex-col justify-center items-center text-center space-y-8 shadow-premium relative overflow-hidden group">
           <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
           <div className="w-20 h-20 bg-white dark:bg-slate-900 rounded-3xl flex items-center justify-center text-brand-600 shadow-2xl group-hover:scale-110 transition-transform">
             <ShieldCheck className="w-10 h-10" />
           </div>
           <div className="space-y-4 relative">
             <h4 className="text-2xl font-black text-white tracking-tight">Grounded IQ</h4>
             <p className="text-sm text-brand-50 font-medium leading-relaxed">
               Every insight is cross-referenced with verified research data to ensure absolute accuracy.
             </p>
           </div>
           <div className="pt-4 relative">
             <div className="px-6 py-2 bg-white/20 backdrop-blur-md rounded-full text-[10px] font-black text-white uppercase tracking-widest border border-white/20">
               Accuracy Shield Active
             </div>
           </div>
        </div>
      </section>
    </div>
  );
};

export default SearchModule;
