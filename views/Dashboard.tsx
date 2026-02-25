
import React, { useState, useEffect } from 'react';
import { User, NoteContent, Quiz } from '../types.ts';
import { webSearchNotes } from '../services/geminiService.ts';
import { 
  Zap, 
  Sparkles, 
  Search, 
  FileText, 
  BrainCircuit, 
  Clock, 
  ArrowRight,
  Loader2,
  Globe,
  ShieldCheck,
  Rocket,
  Briefcase,
  PenTool,
  Cpu,
  Trophy
} from 'lucide-react';

interface DashboardProps {
  user: User;
  onViewNote: (note: NoteContent) => void;
  onStartQuiz: (quiz: Quiz) => void;
  onSwitchTab: (tab: string) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onViewNote, onStartQuiz, onSwitchTab }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [recentWork, setRecentWork] = useState<NoteContent[]>([]);

  useEffect(() => {
    const history = JSON.parse(localStorage.getItem(`edugenius_history_${user.id}`) || '[]');
    setRecentWork(history.slice(0, 3));
  }, [user.id]);

  const handleSmartSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    try {
      const { notes } = await webSearchNotes(query);
      const historyKey = `edugenius_history_${user.id}`;
      const history = JSON.parse(localStorage.getItem(historyKey) || '[]');
      localStorage.setItem(historyKey, JSON.stringify([notes, ...history].slice(0, 20)));
      onViewNote(notes);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col space-y-16 sm:space-y-24 py-16 md:py-20">
      <section className="relative flex flex-col items-center text-center space-y-6 px-4 animate-fade-up">
        <div className="space-y-6 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 text-indigo-500 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-6">
             <Zap className="w-4 h-4" /> Universal Intelligence Protocol Active
          </div>
          <h1 className="font-black tracking-tight text-slate-900 dark:text-white leading-[0.9] sm:leading-[0.9]">
            <span className="text-4xl md:text-5xl lg:text-6xl block">Scale Your</span>
            <span className="text-5xl md:text-6xl lg:text-7xl bg-gradient-to-r from-indigo-500 via-rose-500 to-emerald-500 bg-clip-text text-transparent">Greatest Mind.</span>
          </h1>
          <p className="text-base md:text-lg text-slate-500 dark:text-slate-400 font-medium max-w-2xl mx-auto leading-relaxed">
            The ultimate studio for synthesizing complex data into high-performance insights for business, engineering, and the creative arts.
          </p>
        </div>

        <div className="w-full max-w-4xl px-4">
          <div className="p-3 sm:p-4 bg-white dark:bg-slate-900 rounded-[3rem] sm:rounded-[4.5rem] shadow-premium border border-slate-200/50 dark:border-white/5 backdrop-blur-2xl relative group transition-all hover:shadow-indigo-500/20">
            <form onSubmit={handleSmartSearch} className="relative flex items-center">
              <div className="absolute left-6 sm:left-10 text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                <Search className="w-6 sm:w-10 h-6 sm:h-10" />
              </div>
              <input 
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Synthesize any domain or paste raw data..."
                className="w-full bg-transparent border-none py-8 sm:py-12 pl-16 sm:pl-28 pr-28 sm:pr-40 text-xl sm:text-3xl font-black outline-none placeholder:text-slate-300 dark:text-white transition-all"
              />
              <button 
                type="submit"
                disabled={loading || !query.trim()}
                className="absolute right-3 sm:right-4 w-16 sm:w-24 h-16 sm:h-24 bg-gradient-to-br from-indigo-600 to-rose-600 hover:scale-105 text-white rounded-full flex items-center justify-center transition-all shadow-2xl active:scale-95 disabled:opacity-30"
              >
                {loading ? <Loader2 className="w-8 sm:w-10 h-8 sm:h-10 animate-spin" /> : <Rocket className="w-8 sm:w-10 h-8 sm:h-10" />}
              </button>
            </form>
          </div>

          <div className="mt-12 flex flex-wrap justify-center gap-4 px-2">
            {[
              { id: 'business', label: 'Business Strategy', icon: Briefcase, color: 'text-emerald-500' },
              { id: 'tech', label: 'Technical Logic', icon: Cpu, color: 'text-indigo-500' },
              { id: 'creative', label: 'Creative Design', icon: PenTool, color: 'text-rose-500' },
              { id: 'mastery', label: 'Universal Mastery', icon: Trophy, color: 'text-amber-500' }
            ].map(tool => (
              <button 
                key={tool.id}
                onClick={() => setQuery(`Synthesize ${tool.label} for: `)}
                className="px-6 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/5 rounded-3xl flex items-center gap-4 text-base font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest hover:text-slate-900 dark:hover:text-white hover:border-slate-400 transition-all shadow-sm active:scale-95"
              >
                <tool.icon className={`w-5 h-5 ${tool.color}`} />
                {tool.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="grid md:grid-cols-3 gap-8 px-4 animate-fade-up" style={{ animationDelay: '0.4s' }}>
        {[
          { title: 'Cross-Domain Synthesis', desc: 'Connect disparate data points into cohesive, logical architectures.', icon: BrainCircuit, color: 'text-indigo-600', bg: 'bg-indigo-50 dark:bg-indigo-900/20' },
          { title: 'Grounding Verification', desc: 'Real-time validation against high-authority global databases.', icon: ShieldCheck, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-900/20' },
          { title: 'Actionable Intelligence', desc: 'Automated task extraction and strategic "What-If" modeling.', icon: Zap, color: 'text-rose-600', bg: 'bg-rose-50 dark:bg-rose-900/20' },
        ].map((f, i) => (
          <div key={i} className="group p-12 bg-white dark:bg-slate-900 rounded-[3.5rem] border border-slate-100 dark:border-white/5 shadow-premium hover:shadow-2xl transition-all">
            <div className={`w-16 h-16 ${f.bg} ${f.color} rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform`}>
              <f.icon className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-4 tracking-tight">{f.title}</h3>
            <p className="text-base text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </section>

      {recentWork.length > 0 && (
        <section className="space-y-12 animate-fade-up" style={{ animationDelay: '0.6s' }}>
          <div className="flex items-center justify-between px-4">
            <div className="flex items-center gap-5">
              <div className="p-3 bg-slate-900 dark:bg-white rounded-2xl text-white dark:text-slate-900 shadow-xl">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Active Synthesis Nodes</h3>
            </div>
            <button onClick={() => onSwitchTab('library')} className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest hover:underline flex items-center gap-2">
              The Vault <ArrowRight className="w-4 h-4" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
            {recentWork.map((note) => (
              <div key={note.id} onClick={() => onViewNote(note)} className="group p-10 bg-white dark:bg-slate-900 rounded-[3.5rem] border border-slate-100 dark:border-white/5 cursor-pointer hover:shadow-2xl hover:-translate-y-2 transition-all relative overflow-hidden">
                <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-500/5 rounded-full blur-3xl -mr-20 -mt-20"></div>
                <div className="w-14 h-14 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-400 mb-8 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                  <FileText className="w-7 h-7" />
                </div>
                <h4 className="text-2xl font-black text-slate-900 dark:text-white truncate mb-4 tracking-tight">{note.title}</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 font-medium leading-relaxed mb-10">{note.summary}</p>
                <div className="flex items-center justify-between pt-8 border-t border-slate-50 dark:border-white/5">
                  <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${
                    note.category === 'Business' ? 'bg-emerald-500/10 text-emerald-500' :
                    note.category === 'Technical' ? 'bg-indigo-500/10 text-indigo-500' :
                    note.category === 'Creative' ? 'bg-rose-500/10 text-rose-500' : 'bg-slate-500/10 text-slate-500'
                  }`}>
                    {note.category}
                  </span>
                  <ArrowRight className="w-6 h-6 text-slate-200 group-hover:text-indigo-600 group-hover:translate-x-3 transition-all" />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default Dashboard;
