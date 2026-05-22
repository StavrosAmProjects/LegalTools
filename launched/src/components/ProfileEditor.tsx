import React from 'react';
import { Save, AlertTriangle, FileCode } from 'lucide-react';

export function ProfileEditor({ areaName, content, onSave }: { areaName: string, content: string, onSave: (newContent: string) => void }) {
  const [currentContent, setCurrentContent] = React.useState(content);
  const [isDirty, setIsDirty] = React.useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCurrentContent(e.target.value);
    setIsDirty(true);
  };

  const handleSave = () => {
    onSave(currentContent);
    setIsDirty(false);
  };

  return (
    <div className="flex flex-col h-[600px] border border-[#E5E7EB] bg-white animate-in slide-in-from-bottom-4 duration-300">
      <div className="bg-[#1A1C1E] text-white p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FileCode size={18} className="text-[#E2B13C]" />
          <h3 className="text-xs font-bold uppercase tracking-widest">Editing: {areaName}/CLAUDE.md</h3>
        </div>
        <div className="flex items-center gap-4">
          {isDirty && (
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#E2B13C] flex items-center gap-1">
              <AlertTriangle size={12} /> Unsaved Changes
            </span>
          )}
          <button
            onClick={handleSave}
            disabled={!isDirty}
            className={`flex items-center gap-2 px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest transition-all ${
              isDirty ? 'bg-[#E2B13C] text-[#1A1C1E] hover:bg-white' : 'bg-[#2D3135] text-[#6B7280] cursor-not-allowed'
            }`}
          >
            <Save size={14} /> Commit Changes
          </button>
        </div>
      </div>

      <div className="flex-1 relative">
        <textarea
          value={currentContent}
          onChange={handleChange}
          className="absolute inset-0 w-full h-full p-8 font-mono text-sm bg-[#F8F9FA] border-none outline-none resize-none leading-relaxed text-[#1A1C1E]"
          placeholder="# Practice Profile..."
        />
      </div>

      <div className="p-4 bg-[#F3F4F6] border-t border-[#E5E7EB] flex items-center justify-between">
        <p className="text-[10px] text-[#6B7280] uppercase tracking-widest leading-relaxed">
          The Practice Profile (CLAUDE.md) is the source of truth for your playbooks, escalation rules, and house style.
        </p>
      </div>
    </div>
  );
}
