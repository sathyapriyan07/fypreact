
import React, { useState, useMemo, useEffect } from 'react';
import { NoteContent, User, ActionItem } from '../types.ts';
import MermaidRenderer from '../components/MermaidRenderer.tsx';
import ReactMarkdown from 'react-markdown';
import { 
  ChevronLeft, 
  Bookmark, 
  Download, 
  FileText, 
  Zap,
  Sparkles,
  BookOpen,
  HelpCircle,
  ArrowRight,
  ListChecks,
  CheckCircle2,
  Circle,
  Clock,
  Briefcase,
  Cpu,
  PenTool,
  Share2,
  ShieldCheck,
  Plus
} from 'lucide-react';

interface WorkspaceProps {
  note: NoteContent;
  user: User;
  onBack: () => void;
}

const Workspace: React.FC<WorkspaceProps> = ({ note, user, onBack }) => {
  const [isSaved, setIsSaved] = useState(false);
  const [actions, setActions] = useState<ActionItem[]>(note.actionItems || []);
  const [scenarios, setScenarios] = useState<string[]>(note.whatIfScenarios || []);

  // Check if note is already saved in vault
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem(`edugenius_saved_${user.id}`) || '[]');
    setIsSaved(saved.some((s: any) => s.id === note.id));
  }, [note.id, user.id]);

  // Update local storage whenever actions or scenarios change to ensure persistence
  useEffect(() => {
    const updateStorage = (key: string) => {
      const items = JSON.parse(localStorage.getItem(key) || '[]');
      const updatedItems = items.map((item: any) => {
        if (item.id === note.id) {
          return { ...item, actionItems: actions, whatIfScenarios: scenarios };
        }
        return item;
      });
      localStorage.setItem(key, JSON.stringify(updatedItems));
    };

    updateStorage(`edugenius_history_${user.id}`);
    updateStorage(`edugenius_saved_${user.id}`);
  }, [actions, scenarios, note.id, user.id]);

  const handleToggleSave = () => {
    const key = `edugenius_saved_${user.id}`;
    const saved = JSON.parse(localStorage.getItem(key) || '[]');
    if (isSaved) {
      const filtered = saved.filter((s: any) => s.id !== note.id);
      localStorage.setItem(key, JSON.stringify(filtered));
      setIsSaved(false);
    } else {
      localStorage.setItem(key, JSON.stringify([...saved, { ...note, actionItems: actions, whatIfScenarios: scenarios }]));
      setIsSaved(true);
    }
  };

  const toggleAction = (id: string) => {
    setActions(prev => prev.map(a => a.id === id ? { ...a, completed: !a.completed } : a));
  };

  const handleAddScenario = () => {
    const newScenario = window.prompt("Enter the speculative 'What-If' scenario to simulate:");
    if (newScenario && newScenario.trim()) {
      setScenarios(prev => [...prev, newScenario.trim()]);
    }
  };

  const MemoizedMarkdown = useMemo(() => (
    <article className="prose prose-slate dark:prose-invert prose-lg max-w-none prose-headings:font-black prose-headings:tracking-tight prose-p:leading-relaxed prose-strong:text-indigo-600 dark:prose-strong:text-indigo-400">
      <ReactMarkdown>{note.structuredNotes}</ReactMarkdown>
    </article>
  ), [note.structuredNotes]);

  const domainConfig = useMemo(() => {
    switch(note.category) {
      case 'Business': return { color: 'text-emerald-500', bg: 'bg-emerald-500/5', icon: Briefcase, border: 'border-emerald-500' };
      case 'Technical': return { color: 'text-indigo-500', bg: 'bg-indigo-500/5', icon: Cpu, border: 'border-indigo-500' };
      case 'Creative': return { color: 'text-rose-500', bg: 'bg-rose-500/5', icon: PenTool, border: 'border-rose-500' };
      default: return { color: 'text-amber-500', bg: 'bg-amber-500/5', icon: BookOpen, border: 'border-amber-500' };
    }
  }, [note.category]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#020617] animate-fade-up">
      <header className="h-24 sm:h-28 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 sm:px-12 sticky top-0 z-50 glass">
        <div className="flex items-center gap-6 sm:gap-10">
          <button onClick={onBack} className="p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl text-slate-400 hover:text-indigo-600 transition-all active:scale-95 shadow-sm">
            <ChevronLeft className="w-7 h-7" />
          </button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">{note.title}</h1>
            <div className="flex items-center gap-3 mt-1">
              <domainConfig.icon className={`w-4 h-4 ${domainConfig.color}`} />
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{note.category} Synthesis Result</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <button className="hidden sm:flex p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl text-slate-400 hover:text-indigo-600 transition-all">
            <Share2 className="w-6 h-6" />
          </button>
          <button onClick={handleToggleSave} className={`p-4 rounded-2xl transition-all shadow-sm ${isSaved ? 'bg-indigo-600 text-white' : 'bg-slate-50 dark:bg-slate-800 text-slate-400'}`}>
            <Bookmark className={`w-6 h-6 ${isSaved ? 'fill-current' : ''}`} />
          </button>
          <button className="bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center gap-3 shadow-xl hover:opacity-90 active:scale-95 transition-all">
            Export Data <Download className="w-5 h-5" />
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-8 sm:p-12 lg:p-20 space-y-16 sm:space-y-24">
        <section className="bg-white dark:bg-slate-900 rounded-[4rem] p-12 sm:p-20 shadow-premium border border-slate-100 dark:border-slate-800 relative overflow-hidden group">
           <div className={`absolute top-0 left-0 w-2 h-full ${domainConfig.color.replace('text', 'bg')}`}></div>
           
           <div className="space-y-12">
              <div className="space-y-6">
                <div className="flex items-center gap-3 text-indigo-600 dark:text-indigo-400">
                  <Sparkles className="w-6 h-6" />
                  <span className="text-xs font-black uppercase tracking-[0.3em]">Executive Digest</span>
                </div>
                <div className="prose prose-slate dark:prose-invert max-w-none prose-p:text-2xl sm:prose-p:text-3xl prose-p:font-medium prose-p:text-slate-700 dark:prose-p:text-slate-200 prose-p:leading-relaxed prose-p:italic prose-li:text-xl sm:prose-li:text-2xl prose-li:font-medium prose-li:text-slate-700 dark:prose-li:text-slate-200 prose-li:leading-relaxed prose-li:italic">
                  <ReactMarkdown>
                    {note.summary.includes('*') || note.summary.includes('-') 
                      ? note.summary 
                      : note.summary.split('. ').map(s => `* ${s.trim()}${s.endsWith('.') ? '' : '.'}`).join('\n')}
                  </ReactMarkdown>
                </div>
              </div>

             <div className="pt-16 border-t border-slate-100 dark:border-slate-800 space-y-10">
               <div className="flex items-center justify-between">
                 <div className="flex items-center gap-4">
                   <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-2xl">
                     <ListChecks className="w-7 h-7" />
                   </div>
                   <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Project Objectives</h3>
                 </div>
                 <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 dark:bg-slate-800 px-4 py-2 rounded-full">
                   {actions.filter(a => a.completed).length}/{actions.length} Completed
                 </div>
               </div>
               {actions.length > 0 ? (
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   {actions.map((action) => (
                     <button 
                       key={action.id} 
                       onClick={() => toggleAction(action.id)} 
                       className={`p-6 rounded-3xl border text-left flex items-center gap-5 transition-all ${
                         action.completed 
                         ? 'bg-emerald-500/5 border-emerald-500/20 opacity-60' 
                         : 'bg-slate-50 dark:bg-slate-800/50 border-transparent hover:border-indigo-500/30 shadow-sm'
                       }`}
                     >
                       <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${action.completed ? 'bg-emerald-500 border-emerald-500' : 'border-slate-200 dark:border-slate-700'}`}>
                         {action.completed && <CheckCircle2 className="w-5 h-5 text-white" />}
                       </div>
                       <span className={`text-base font-bold flex-1 ${action.completed ? 'line-through text-slate-500' : 'text-slate-800 dark:text-slate-100'}`}>
                         {action.task}
                       </span>
                     </button>
                   ))}
                 </div>
               ) : (
                 <div className="py-12 text-center bg-slate-50 dark:bg-slate-800/20 rounded-[2.5rem] border border-dashed border-slate-200 dark:border-slate-800">
                    <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">No objectives defined.</p>
                 </div>
               )}
             </div>

             <div className="pt-16 border-t border-slate-100 dark:border-slate-800 space-y-10">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-indigo-500/10 text-indigo-500 rounded-2xl">
                    <FileText className="w-7 h-7" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Structured Analysis</h3>
                </div>
                <div className="bg-slate-50/50 dark:bg-slate-950/30 rounded-[3rem] p-10 sm:p-14 border border-slate-100 dark:border-white/5">
                  {MemoizedMarkdown}
                </div>
             </div>

             {note.visualData && (
               <div className="pt-16 border-t border-slate-100 dark:border-slate-800 space-y-10">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-rose-500/10 text-rose-500 rounded-2xl">
                      <Zap className="w-7 h-7" />
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Logical Architecture</h3>
                  </div>
                  <MermaidRenderer chart={note.visualData} />
               </div>
             )}

             <div className="pt-16 border-t border-slate-100 dark:border-slate-800 space-y-10">
               <div className="flex items-center justify-between">
                 <div className="flex items-center gap-4">
                   <div className="p-3 bg-amber-500/10 text-amber-500 rounded-2xl">
                     <HelpCircle className="w-7 h-7" />
                   </div>
                   <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Speculative Scenarios</h3>
                 </div>
                 <button 
                  onClick={handleAddScenario}
                  className="px-6 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-full text-[10px] font-black uppercase tracking-widest transition-all active:scale-95 flex items-center gap-2 shadow-lg shadow-amber-500/20"
                 >
                   <Plus className="w-3.5 h-3.5" /> Simulate New Path
                 </button>
               </div>
               
               {scenarios.length > 0 ? (
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   {scenarios.map((scenario, i) => (
                     <div key={i} className="group p-8 bg-white dark:bg-slate-800/50 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 hover:border-amber-500/30 transition-all flex items-start gap-6 shadow-sm">
                       <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0 font-black text-lg">{i + 1}</div>
                       <div className="space-y-2">
                         <p className="text-lg font-bold text-slate-800 dark:text-slate-100 group-hover:text-amber-500 transition-colors leading-snug">{scenario}</p>
                         <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                           <Clock className="w-3.5 h-3.5" /> Simulation Result
                         </div>
                       </div>
                     </div>
                   ))}
                 </div>
               ) : (
                 <div className="py-12 text-center bg-slate-50 dark:bg-slate-800/20 rounded-[2.5rem] border border-dashed border-slate-200 dark:border-slate-800">
                    <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">No scenarios simulated for this node yet.</p>
                 </div>
               )}
             </div>
           </div>
        </section>

        {note.sources && note.sources.length > 0 && (
          <section className="space-y-10 px-4">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-emerald-500/10 text-emerald-500 rounded-2xl">
                <ShieldCheck className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">Grounding Verification</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {note.sources.map((source, i) => (
                <a 
                  key={i} 
                  href={source.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-8 bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-100 dark:border-slate-800 hover:shadow-2xl hover:scale-105 transition-all group"
                >
                  <div className="flex items-center justify-between mb-6">
                    <p className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">Source Verified</p>
                    <ArrowRight className="w-5 h-5 text-slate-200 group-hover:text-indigo-600 transition-all" />
                  </div>
                  <h4 className="text-xl font-black text-slate-900 dark:text-white mb-2 truncate leading-tight">{source.siteName}</h4>
                  <p className="text-sm text-slate-400 font-medium line-clamp-2 leading-relaxed">{source.snippet}</p>
                </a>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default Workspace;
