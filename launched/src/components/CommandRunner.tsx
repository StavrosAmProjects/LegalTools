import React from 'react';
import { Terminal, Copy, Check, Play, AlertCircle } from 'lucide-react';

interface Skill {
  id: string;
  name: string;
  description: string;
  command: string;
}

export function CommandRunner({ skill }: { skill: Skill }) {
  const [copied, setCopied] = React.useState(false);
  const [status, setStatus] = React.useState<'idle' | 'running' | 'success' | 'error'>('idle');

  const copyCommand = () => {
    navigator.clipboard.writeText(skill.command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const runSkill = () => {
    setStatus('running');
    // Simulate skill execution
    setTimeout(() => {
      setStatus('success');
      setTimeout(() => setStatus('idle'), 3000);
    }, 2000);
  };

  return (
    <div className="bg-[#1A1C1E] text-[#D1D5DB] rounded-sm p-6 font-mono text-sm border border-[#2D3135]">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2 text-[#E2B13C]">
          <Terminal size={16} />
          <span className="text-[10px] uppercase font-bold tracking-widest">Legal Terminal</span>
        </div>
        <div className="flex gap-2">
          <button
            onClick={copyCommand}
            className="p-2 hover:bg-[#2D3135] rounded transition-colors outline-none focus-visible:ring-2 focus-visible:ring-[#E2B13C]"
            aria-label={copied ? "Command copied" : "Copy command to clipboard"}
          >
            {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} aria-hidden="true" />}
          </button>
        </div>
      </div>

      <div className="bg-black/30 p-4 rounded mb-6 border border-white/5">
        <code className="text-[#E2B13C]">{skill.command}</code>
      </div>

      <div className="space-y-4">
        {status === 'idle' && (
          <button
            onClick={runSkill}
            className="w-full bg-[#E2B13C] text-[#1A1C1E] py-3 font-bold uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-[#F0C868] transition-colors"
          >
            <Play size={14} fill="currentColor" /> Initialize Skill
          </button>
        )}

        {status === 'running' && (
          <div className="flex flex-col items-center gap-4 py-4">
            <div className="w-full bg-[#2D3135] h-1 rounded-full overflow-hidden">
              <div className="bg-[#E2B13C] h-full w-1/2 animate-[shimmer_2s_infinite]"></div>
            </div>
            <p className="text-[10px] uppercase tracking-[0.2em] animate-pulse">Orchestrating Agents...</p>
          </div>
        )}

        {status === 'success' && (
          <div className="bg-green-500/10 border border-green-500/20 text-green-500 p-4 flex items-center gap-3">
            <Check size={18} />
            <span className="text-xs font-bold uppercase tracking-widest">Skill Sequence Initialized Successfully</span>
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-white/5">
          <p className="text-[10px] text-[#6B7280] leading-relaxed uppercase tracking-wider">
            <AlertCircle size={10} className="inline mr-1" />
            Skills run in your local Claude environment. Ensure MCP connectors are authorized.
          </p>
        </div>
      </div>
    </div>
  );
}
