
import React, { useEffect, useRef, useState } from 'react';
import { Share2, Maximize2, AlertCircle, Loader2 } from 'lucide-react';

declare const mermaid: any;

interface MermaidRendererProps {
  chart: string;
}

const MermaidRenderer: React.FC<MermaidRendererProps> = ({ chart }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [rendering, setRendering] = useState(false);

  useEffect(() => {
    if (!chart || typeof mermaid === 'undefined') return;

    const renderChart = async () => {
      setRendering(true);
      setError(null);
      try {
        const uniqueId = `mermaid-svg-${Math.random().toString(36).substr(2, 9)}`;
        
        // Initialize with optimal settings for the current theme
        const isDark = document.documentElement.classList.contains('dark');
        mermaid.initialize({
          startOnLoad: false,
          theme: isDark ? 'dark' : 'neutral',
          securityLevel: 'loose',
          fontFamily: 'Plus Jakarta Sans',
          themeVariables: {
            primaryColor: '#6366f1',
            primaryTextColor: isDark ? '#fff' : '#1e293b',
            lineColor: '#6366f1',
          }
        });

        // Use the explicit render API instead of contentLoaded
        const { svg: renderedSvg } = await mermaid.render(uniqueId, chart);
        setSvg(renderedSvg);
      } catch (err) {
        console.error("Mermaid rendering failed:", err);
        setError("Flowchart visualization could not be generated from the AI data.");
      } finally {
        setRendering(false);
      }
    };

    renderChart();
  }, [chart]);

  if (!chart) return null;

  return (
    <div className="bg-slate-50 dark:bg-slate-900/50 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 p-8 md:p-10 shadow-inner">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">Conceptual Architecture</h3>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">AI Generated Logical Flow</p>
        </div>
        <div className="flex gap-2">
           <button className="p-2 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-400 hover:text-brand-600 transition-all shadow-sm">
             <Maximize2 className="w-4 h-4" />
           </button>
        </div>
      </div>
      
      <div className="bg-white dark:bg-slate-950 p-6 md:p-10 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-premium overflow-x-auto min-h-[300px] flex items-center justify-center">
        {rendering ? (
          <div className="flex flex-col items-center gap-3 text-slate-400">
            <Loader2 className="w-8 h-8 animate-spin" />
            <span className="text-[10px] font-black uppercase tracking-widest">Synthesizing Visuals...</span>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center gap-3 text-rose-500 text-center max-w-xs">
            <AlertCircle className="w-8 h-8" />
            <span className="text-xs font-bold leading-relaxed">{error}</span>
          </div>
        ) : (
          <div 
            className="mermaid-container w-full flex justify-center"
            dangerouslySetInnerHTML={{ __html: svg }} 
          />
        )}
      </div>
    </div>
  );
};

export default MermaidRenderer;
