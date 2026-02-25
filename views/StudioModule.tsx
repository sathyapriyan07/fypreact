
import React, { useState, useRef } from 'react';
import { NoteContent, User } from '../types.ts';
import { generateNotesFromText } from '../services/geminiService.ts';
import { 
  Sparkles, 
  FileText, 
  Loader2, 
  Zap, 
  FileUp, 
  Clipboard, 
  X,
  Type,
  Link as LinkIcon,
  Settings2,
  CheckCircle,
  HelpCircle,
  List,
  AlignLeft,
  BrainCircuit,
  ChevronDown,
  ShieldCheck,
  Briefcase,
  Cpu,
  PenTool,
  Boxes,
  Code2,
  Network
} from 'lucide-react';

interface StudioModuleProps {
  user: User;
  onNoteGenerated: (note: NoteContent) => void;
}

const StudioModule: React.FC<StudioModuleProps> = ({ user, onNoteGenerated }) => {
  const [text, setText] = useState('');
  const [activeInput, setActiveInput] = useState<'text' | 'file' | 'url'>('text');
  const [loading, setLoading] = useState(false);
  
  const [category, setCategory] = useState<'Business' | 'Technical' | 'Creative' | 'General'>('General');
  const [length, setLength] = useState<'Short' | 'Medium' | 'Long'>('Medium');
  const [format, setFormat] = useState<'Structured' | 'Flowchart' | 'Executive' | 'JSONSpec'>('Structured');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleProcess = async () => {
    if (!text.trim()) return;
    setLoading(true);
    try {
      const options = { 
        category, 
        length, 
        visualFormat: format,
        instruction: `Format the output primarily as a ${format === 'JSONSpec' ? 'JSON schema and data object' : format === 'Flowchart' ? 'Mermaid logical diagram' : 'structured text document'}`
      };
      const notes = await generateNotesFromText(text, options);
      
      const historyKey = `edugenius_history_${user.id}`;
      const history = JSON.parse(localStorage.getItem(historyKey) || '[]');
      localStorage.setItem(historyKey, JSON.stringify([notes, ...history].slice(0, 20)));
      onNoteGenerated(notes);
    } catch (err) {
      alert("Intelligence synthesis failed. Refine your input and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => setText(event.target?.result as string);
    reader.readAsText(file);
  };

  const handlePaste = async () => {
    try {
      const t = await navigator.clipboard.readText();
      setText(t);
    } catch(err) {
      console.error("Paste failed", err);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 items-start">
      <div className="lg:col-span-8 space-y-8 animate-fade-up">
        <div className="glass rounded-[3rem] sm:rounded-[4.5rem] p-8 sm:p-14 shadow-premium border border-white/20 relative overflow-hidden">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-6">
            <div className="flex w-full sm:w-auto p-1.5 bg-slate-200/30 dark:bg-slate-800/50 rounded-[1.5rem] border border-white/10 shadow-inner overflow-x-auto no-scrollbar">
              {[
                { id: 'text', icon: Type, label: 'Raw Text' },
                { id: 'file', icon: FileUp, label: 'Upload' },
                { id: 'url', icon: LinkIcon, label: 'Intelligence URL' },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveInput(tab.id as any)}
                  className={`flex items-center justify-center gap-3 px-8 py-3.5 rounded-[1.25rem] font-black text-[10px] sm:text-[11px] uppercase tracking-widest transition-all whitespace-nowrap ${
                    activeInput === tab.id 
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-lg' 
                    : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <tab.icon className="w-4 h-4" /> {tab.label}
                </button>
              ))}
            </div>
            {text && (
              <button onClick={() => setText('')} className="p-4 bg-rose-500/10 text-rose-500 rounded-2xl hover:bg-rose-500 hover:text-white transition-all active:scale-95">
                <X className="w-6 h-6" />
              </button>
            )}
          </div>

          <div className="relative min-h-[400px] sm:min-h-[550px]">
            {activeInput === 'text' && (
              <textarea 
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Paste research, technical logs, or strategy documents..."
                className="w-full h-[400px] sm:h-[550px] bg-slate-100/30 dark:bg-slate-900/40 border-none rounded-[2.5rem] sm:rounded-[3.5rem] p-8 sm:p-14 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all font-medium text-slate-800 dark:text-white resize-none leading-relaxed text-lg sm:text-2xl placeholder:text-slate-300 shadow-inner"
              />
            )}
            
            {activeInput === 'file' && (
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-[400px] sm:h-[550px] border-2 border-dashed border-white/20 rounded-[3rem] flex flex-col items-center justify-center gap-8 group hover:bg-indigo-500/5 transition-all cursor-pointer"
              >
                <div className="w-24 h-24 bg-indigo-500/10 rounded-[2.5rem] flex items-center justify-center text-indigo-500 group-hover:scale-110 transition-transform shadow-lg">
                  <FileUp className="w-10 h-10" />
                </div>
                <div className="text-center px-4">
                  <p className="text-3xl font-black text-slate-900 dark:text-white">Ingest Material</p>
                  <p className="text-sm text-slate-500 mt-3 font-bold uppercase tracking-widest">Enterprise, Tech, and Strategy Docs</p>
                </div>
                <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileUpload} />
              </div>
            )}

            {activeInput === 'url' && (
              <div className="w-full h-[400px] sm:h-[550px] flex flex-col items-center justify-center p-12 space-y-10">
                 <div className="w-full max-w-2xl relative group">
                    <LinkIcon className="absolute left-8 top-1/2 -translate-y-1/2 w-8 h-8 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
                    <input 
                      type="url" 
                      placeholder="https://resource.intelligence/link/..." 
                      className="w-full pl-20 pr-10 py-8 bg-slate-100/50 dark:bg-slate-900/40 border border-white/10 rounded-[2.5rem] font-black text-slate-900 dark:text-white outline-none focus:ring-4 focus:ring-indigo-500/10 text-xl" 
                    />
                 </div>
                 <div className="flex items-center gap-3 px-8 py-3 bg-emerald-500/10 text-emerald-500 rounded-full border border-emerald-500/20">
                    <ShieldCheck className="w-5 h-5" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Encrypted Ingestion Protocol</span>
                 </div>
              </div>
            )}

            {!text && activeInput === 'text' && (
              <button onClick={handlePaste} className="absolute top-8 right-8 p-5 bg-white dark:bg-slate-800 rounded-3xl border border-white/10 text-slate-400 hover:text-indigo-600 transition-all shadow-xl group">
                <Clipboard className="w-8 h-8 group-hover:scale-110 transition-transform" />
              </button>
            )}
          </div>
        </div>
      </div>

      <aside className="lg:col-span-4 space-y-8 animate-fade-up" style={{ animationDelay: '0.3s' }}>
        <div className="glass rounded-[3.5rem] p-10 sm:p-12 shadow-premium border border-white/20 relative overflow-hidden group">
          <div className="flex items-center gap-4 mb-12">
            <div className="p-3 bg-indigo-600 rounded-2xl text-white shadow-xl">
              <Settings2 className="w-7 h-7" />
            </div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Synthesis Config</h3>
          </div>

          <div className="space-y-10 relative">
            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Domain Focus</label>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { id: 'Business', icon: Briefcase, color: 'text-emerald-500' },
                  { id: 'Technical', icon: Cpu, color: 'text-indigo-500' },
                  { id: 'Creative', icon: PenTool, color: 'text-rose-500' },
                  { id: 'General', icon: Boxes, color: 'text-amber-500' }
                ].map(cat => (
                  <button 
                    key={cat.id}
                    onClick={() => setCategory(cat.id as any)}
                    className={`flex flex-col items-center gap-3 p-5 rounded-3xl border transition-all ${
                      category === cat.id 
                      ? 'border-indigo-500 bg-indigo-500/5 shadow-inner' 
                      : 'border-white/10 bg-slate-100/50 dark:bg-slate-900/50 text-slate-500'
                    }`}
                  >
                    <cat.icon className={`w-6 h-6 ${category === cat.id ? cat.color : ''}`} />
                    <span className="text-[9px] font-black uppercase tracking-widest">{cat.id}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Synthesis Resolution</label>
              <div className="grid grid-cols-3 gap-2 p-1.5 bg-slate-100/50 dark:bg-slate-900/50 rounded-[1.5rem] border border-white/10">
                {(['Short', 'Medium', 'Long'] as const).map(l => (
                  <button 
                    key={l}
                    onClick={() => setLength(l)}
                    className={`py-3.5 rounded-[1rem] font-black text-[10px] transition-all uppercase tracking-widest ${
                      length === l 
                      ? 'bg-indigo-600 text-white shadow-xl' 
                      : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">Output Format & Visualization</label>
              <div className="grid grid-cols-1 gap-3">
                {[
                  { id: 'Structured', label: 'Structured Insights', icon: AlignLeft },
                  { id: 'Flowchart', label: 'Logical Diagram', icon: Network },
                  { id: 'JSONSpec', label: 'JSON Schema / Data', icon: Code2 },
                  { id: 'Executive', label: 'Executive Digest', icon: ShieldCheck }
                ].map(fmt => (
                  <button 
                    key={fmt.id}
                    onClick={() => setFormat(fmt.id as any)}
                    className={`flex items-center gap-4 px-6 py-4 rounded-2xl border transition-all text-left ${
                      format === fmt.id 
                      ? 'border-indigo-500 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400' 
                      : 'border-white/10 bg-slate-100/50 dark:bg-slate-900/50 text-slate-500'
                    }`}
                  >
                    <fmt.icon className="w-5 h-5" />
                    <span className="text-[10px] font-black uppercase tracking-widest">{fmt.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <button 
              disabled={loading || !text.trim()}
              onClick={handleProcess}
              className="w-full relative group overflow-hidden rounded-[2.5rem] active:scale-[0.98] transition-all shadow-2xl disabled:opacity-30"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-rose-600 to-emerald-600"></div>
              <div className="relative py-7 flex items-center justify-center gap-4 text-white font-black text-base uppercase tracking-widest">
                {loading ? <Loader2 className="w-7 h-7 animate-spin" /> : <Zap className="w-7 h-7 fill-current" />}
                {loading ? 'Synthesizing...' : 'GENERATE INSIGHTS'}
              </div>
            </button>
          </div>
        </div>

        <div className="p-10 bg-slate-900 rounded-[3.5rem] flex flex-col items-center text-center gap-6 shadow-2xl border border-white/5 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-rose-500/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="p-4 bg-white/10 backdrop-blur-md rounded-[1.5rem] text-indigo-400">
            <Sparkles className="w-10 h-10" />
          </div>
          <div className="space-y-2 relative">
            <h4 className="text-xl font-black text-white tracking-tight">Neural Engine 3.0</h4>
            <p className="text-xs text-slate-400 font-medium leading-relaxed">
              Every insight is optimized for semantic density, logical coherence, and real-world mastery.
            </p>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default StudioModule;
