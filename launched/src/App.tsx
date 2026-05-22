import { useState, useEffect } from 'react';
import {
  Shield, Scale, Briefcase, FileText, Gavel, Users, Info,
  Search, ChevronRight, LayoutDashboard, FolderKanban,
  Settings, Terminal, BookOpen, X, Command, Clock
} from 'lucide-react';
import manifest from './manifest.json';
import { CommandRunner } from './components/CommandRunner';
import { ProfileEditor } from './components/ProfileEditor';
import { MatterTracker } from './components/MatterTracker';

interface Skill {
  id: string;
  name: string;
  description: string;
  command: string;
  'user-invocable'?: string;
}

interface Agent {
  id: string;
  name: string;
  path: string;
}

interface PracticeArea {
  id: string;
  name: string;
  description: string;
  skills: Skill[];
  agents: Agent[];
}

const PracticeIcon = ({ id, size = 24 }: { id: string, size?: number }) => {
  switch (id) {
    case 'ai-governance-legal': return <Shield size={size} />;
    case 'commercial-legal': return <Briefcase size={size} />;
    case 'corporate-legal': return <Users size={size} />;
    case 'employment-legal': return <FileText size={size} />;
    case 'ip-legal': return <Scale size={size} />;
    case 'litigation-legal': return <Gavel size={size} />;
    case 'privacy-legal': return <Shield size={size} />;
    case 'product-legal': return <Info size={size} />;
    case 'regulatory-legal': return <Scale size={size} />;
    case 'law-student': return <BookOpen size={size} />;
    case 'legal-clinic': return <Gavel size={size} />;
    case 'legal-builder-hub': return <FolderKanban size={size} />;
    default: return <Scale size={size} />;
  }
};

function App() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'practice-areas' | 'matters' | 'settings'>('dashboard');
  const [selectedArea, setSelectedArea] = useState<PracticeArea | null>(null);
  const [selectedSkill, setSelectedSkill] = useState<Skill | null>(null);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Keyboard shortcut for search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        document.getElementById('global-search')?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const filteredAreas = manifest.practice_areas.filter(area =>
    area.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    area.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const mockProfileContent = `# Practice Profile: ${selectedArea?.name}\n\n## Playbook\nStandard positions and fallbacks for ${selectedArea?.name}...\n\n## Escalation\nWho to contact when thresholds are met...`;

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex text-[#1A1C1E] font-serif selection:bg-[#E2B13C]/30">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:bg-[#E2B13C] focus:text-[#1A1C1E] focus:px-4 focus:py-2 focus:font-bold focus:uppercase focus:tracking-widest focus:shadow-2xl"
      >
        Skip to Content
      </a>

      {/* Sidebar */}
      <aside className="w-64 bg-[#1A1C1E] text-white flex flex-col sticky top-0 h-screen z-20 shadow-2xl">
        <div className="p-6 border-b border-[#2D3135]">
          <div className="flex items-center gap-3">
            <div className="bg-[#E2B13C] p-1.5 rounded-sm shadow-inner">
              <Scale size={20} className="text-[#1A1C1E]" />
            </div>
            <span className="font-bold tracking-tight text-lg uppercase">Claude Legal</span>
          </div>
        </div>

        <nav className="flex-1 py-6 px-4 space-y-2">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
            { id: 'practice-areas', label: 'Practice Areas', icon: <Briefcase size={18} /> },
            { id: 'matters', label: 'Matter Tracker', icon: <FolderKanban size={18} /> },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id as 'dashboard' | 'practice-areas' | 'matters' | 'settings');
                setSelectedArea(null);
                setSelectedSkill(null);
                setIsEditingProfile(false);
              }}
              aria-label={`Navigate to ${item.label}`}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-sm transition-all text-sm font-medium uppercase tracking-widest outline-none focus-visible:ring-2 focus-visible:ring-[#E2B13C] focus-visible:ring-inset ${
                activeTab === item.id ? 'bg-[#2D3135] text-[#E2B13C] shadow-sm' : 'text-[#A0AEC0] hover:bg-[#2D3135] hover:text-white'
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-[#2D3135]">
          <button
            onClick={() => setActiveTab('settings')}
            aria-label="System Configuration"
            className="w-full flex items-center gap-3 px-4 py-3 text-[#A0AEC0] hover:text-white transition-colors text-sm font-medium uppercase tracking-widest outline-none focus-visible:ring-2 focus-visible:ring-[#E2B13C] focus-visible:ring-inset"
          >
            <Settings size={18} />
            System Config
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main id="main-content" className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white/80 backdrop-blur-md border-b border-[#E5E7EB] flex items-center justify-between px-8 sticky top-0 z-10">
          <div className="flex items-center gap-4 flex-1 max-w-xl group">
            <Search size={18} className="text-[#9CA3AF] group-focus-within:text-[#1A1C1E] transition-colors" />
            <div className="relative flex-1">
              <input
                id="global-search"
                type="text"
                placeholder="SEARCH PLUGINS, SKILLS, OR MATTERS..."
                className="bg-transparent border-none outline-none text-[10px] tracking-widest uppercase w-full py-2"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search agents and skills"
              />
              <div className="absolute right-0 top-1/2 -translate-y-1/2 hidden md:flex items-center gap-1 px-2 py-1 bg-[#F3F4F6] rounded border border-[#E5E7EB] text-[9px] font-bold text-[#9CA3AF]">
                <Command size={10} /> K
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-[10px] font-bold uppercase tracking-widest bg-[#1A1C1E] text-[#E2B13C] px-3 py-1.5 rounded-sm shadow-sm">
              Professional Edition
            </div>
          </div>
        </header>

        <div className="p-8 lg:p-12 overflow-y-auto">
          {activeTab === 'dashboard' && !selectedArea && (
            <div className="animate-in fade-in slide-in-from-top-4 duration-700">
              <header className="mb-12 border-l-4 border-[#1A1C1E] pl-6">
                <h1 className="text-4xl lg:text-5xl font-bold mb-3 uppercase tracking-tight leading-none">Firm Intelligence</h1>
                <p className="text-[#4B5563] italic text-lg">Welcome back. Your legal agents are synchronized.</p>
              </header>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredAreas.slice(0, 6).map((area) => (
                  <button
                    key={area.id}
                    onClick={() => { setSelectedArea(area as PracticeArea); setActiveTab('practice-areas'); }}
                    aria-label={`Open ${area.name} practice area`}
                    className="bg-white border border-[#E5E7EB] p-8 text-left hover:shadow-2xl hover:-translate-y-1 transition-all group relative overflow-hidden focus-visible:ring-2 focus-visible:ring-[#E2B13C] outline-none"
                  >
                    <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity grayscale">
                      <PracticeIcon id={area.id} size={128} />
                    </div>
                    <div className="text-[#1A1C1E] mb-6 group-hover:scale-110 transition-transform duration-500 ease-out">
                      <PracticeIcon id={area.id} size={32} />
                    </div>
                    <h2 className="text-xl font-bold mb-3 uppercase tracking-tight group-hover:text-[#E2B13C] transition-colors">{area.name}</h2>
                    <p className="text-[#4B5563] text-sm leading-relaxed mb-6 line-clamp-2 italic">{area.description}</p>
                    <div className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-[#1A1C1E] border-t border-[#F3F4F6] pt-6">
                      <span className="flex items-center gap-1.5"><Terminal size={12} className="text-[#E2B13C]" /> {area.skills.length} Skills</span>
                      <span className="text-[#D1D5DB]">/</span>
                      <span className="flex items-center gap-1.5"><Clock size={12} className="text-[#E2B13C]" /> {area.agents.length} Agents</span>
                    </div>
                  </button>
                ))}
              </div>

              <section className="mt-20">
                <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#9CA3AF] mb-10 flex items-center gap-6">
                  <span className="shrink-0">Active Workstreams</span>
                  <div className="h-px bg-[#E5E7EB] flex-1"></div>
                </h3>
                <div className="bg-white border border-[#E5E7EB] rounded-sm divide-y divide-[#E5E7EB] shadow-sm">
                  {[1, 2, 3].map((i) => (
                    <button
                      key={i}
                      className="w-full p-6 flex items-center justify-between hover:bg-[#F8F9FA] transition-colors cursor-pointer group outline-none focus-visible:bg-[#F8F9FA]"
                    >
                      <div className="flex items-center gap-5">
                        <div className="w-12 h-12 bg-[#F3F4F6] flex items-center justify-center text-[#1A1C1E] group-hover:bg-[#1A1C1E] group-hover:text-[#E2B13C] transition-all duration-300">
                          <FolderKanban size={20} />
                        </div>
                        <div className="text-left">
                          <h4 className="font-bold text-sm uppercase tracking-wider mb-1">Matter-2026-00{i}</h4>
                          <p className="text-[10px] text-[#6B7280] uppercase tracking-widest font-sans font-bold">Updated 2 hours ago &bull; <span className="text-[#1A1C1E]">Commercial Legal</span></p>
                        </div>
                      </div>
                      <ChevronRight size={20} className="text-[#D1D5DB] group-hover:text-[#1A1C1E] group-hover:translate-x-1 transition-all" />
                    </button>
                  ))}
                </div>
              </section>
            </div>
          )}

          {(activeTab === 'practice-areas' || selectedArea) && (
            <div className="animate-in slide-in-from-bottom-4 duration-500">
              {selectedArea ? (
                <div>
                  <div className="flex items-center justify-between mb-10">
                    <button
                      onClick={() => { setSelectedArea(null); setSelectedSkill(null); setIsEditingProfile(false); }}
                      className="text-[10px] font-bold uppercase tracking-widest text-[#6B7280] hover:text-[#1A1C1E] flex items-center gap-2 group outline-none"
                    >
                      <span className="group-hover:-translate-x-1 transition-transform">&larr;</span> Back to Practice Areas
                    </button>
                    {isEditingProfile && (
                      <button
                        onClick={() => setIsEditingProfile(false)}
                        className="text-[10px] font-bold uppercase tracking-widest text-[#1A1C1E] flex items-center gap-2 hover:text-red-600 transition-colors"
                      >
                        <X size={14} /> Close Editor
                      </button>
                    )}
                  </div>

                  {!isEditingProfile ? (
                    <>
                      <div className="flex items-start justify-between mb-16 border-l-4 border-[#E2B13C] pl-8">
                        <div className="">
                          <h1 className="text-5xl font-bold mb-4 uppercase tracking-tight">{selectedArea.name}</h1>
                          <p className="text-[#4B5563] text-lg max-w-2xl leading-relaxed italic">{selectedArea.description}</p>
                        </div>
                        <div className="bg-white p-6 border border-[#E5E7EB] flex gap-12 shadow-sm">
                          <div className="text-center">
                            <div className="text-3xl font-bold">{selectedArea.skills.length}</div>
                            <div className="text-[10px] font-bold uppercase tracking-widest text-[#9CA3AF]">Skills</div>
                          </div>
                          <div className="text-center">
                            <div className="text-3xl font-bold">{selectedArea.agents.length}</div>
                            <div className="text-[10px] font-bold uppercase tracking-widest text-[#9CA3AF]">Agents</div>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                        <div className="lg:col-span-2 space-y-10">
                          <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#9CA3AF] flex items-center gap-6">
                            <span className="shrink-0">Available Skills</span>
                            <div className="h-px bg-[#E5E7EB] flex-1"></div>
                          </h3>
                          <div className="grid gap-6">
                            {selectedArea.skills.map((skill) => (
                              <button
                                key={skill.id}
                                onClick={() => setSelectedSkill(skill)}
                                aria-label={`View details for ${skill.id}`}
                                className={`bg-white border p-8 text-left hover:shadow-xl transition-all group relative overflow-hidden outline-none focus-visible:ring-2 focus-visible:ring-[#E2B13C] ${selectedSkill?.id === skill.id ? 'border-[#1A1C1E] shadow-lg ring-1 ring-[#1A1C1E]' : 'border-[#E5E7EB]'}`}
                              >
                                {selectedSkill?.id === skill.id && (
                                  <div className="absolute top-0 left-0 w-1.5 h-full bg-[#E2B13C]"></div>
                                )}
                                <div className="flex justify-between items-start mb-4">
                                  <h4 className="font-bold uppercase tracking-tight text-xl group-hover:text-[#E2B13C] transition-colors">{skill.id.replace(/-/g, ' ')}</h4>
                                  <div className={`p-2.5 transition-all duration-300 ${selectedSkill?.id === skill.id ? 'bg-[#1A1C1E] text-[#E2B13C] rotate-12' : 'bg-[#F3F4F6] group-hover:bg-[#1A1C1E] group-hover:text-white group-hover:rotate-12'}`}>
                                    <Terminal size={16} />
                                  </div>
                                </div>
                                <p className="text-sm text-[#4B5563] leading-relaxed mb-8 font-sans">{skill.description}</p>
                                <div className="flex items-center justify-between border-t border-[#F3F4F6] pt-6">
                                  <code className="bg-[#1A1C1E] px-3 py-1.5 rounded-sm text-[10px] font-mono text-[#E2B13C] shadow-inner">
                                    {skill.command}
                                  </code>
                                  <span className="text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 group-hover:text-[#E2B13C] transition-colors">
                                    Analyze Skill <ChevronRight size={14} />
                                  </span>
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-12">
                          {selectedSkill ? (
                            <div className="sticky top-24 space-y-8 animate-in slide-in-from-right-4 duration-500 ease-out">
                              <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#9CA3AF] flex items-center gap-6">
                                <span className="shrink-0">Skill Execution</span>
                                <div className="h-px bg-[#E5E7EB] flex-1"></div>
                              </h3>
                              <div className="bg-white border border-[#E5E7EB] p-8 space-y-6 shadow-xl relative">
                                <div className="flex justify-between items-center mb-4">
                                  <h4 className="text-2xl font-bold uppercase tracking-tight text-[#1A1C1E]">{selectedSkill.id.replace(/-/g, ' ')}</h4>
                                  <button
                                    onClick={() => setSelectedSkill(null)}
                                    aria-label="Close skill details"
                                    className="text-[#9CA3AF] hover:text-red-600 transition-colors p-1"
                                  >
                                    <X size={24} />
                                  </button>
                                </div>
                                <CommandRunner skill={selectedSkill} />
                              </div>
                            </div>
                          ) : (
                            <>
                              <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#9CA3AF] flex items-center gap-6">
                                <span className="shrink-0">Practice Agents</span>
                                <div className="h-px bg-[#E5E7EB] flex-1"></div>
                              </h3>
                              <div className="space-y-6">
                                {selectedArea.agents.length > 0 ? selectedArea.agents.map((agent) => (
                                  <div key={agent.id} className="bg-[#1A1C1E] text-white p-8 relative overflow-hidden group shadow-lg">
                                    <div className="relative z-10">
                                      <h4 className="font-bold uppercase tracking-[0.2em] text-[9px] text-[#E2B13C] mb-3">Scheduled Background Agent</h4>
                                      <h5 className="text-2xl font-bold mb-6 tracking-tight">{agent.name}</h5>
                                      <button className="w-full border border-white/20 py-4 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-white hover:text-[#1A1C1E] transition-all duration-300 outline-none focus-visible:bg-white focus-visible:text-[#1A1C1E]">
                                        Configure Parameters
                                      </button>
                                    </div>
                                    <div className="absolute -bottom-6 -right-6 opacity-5 group-hover:opacity-10 transition-opacity rotate-12 group-hover:rotate-0 duration-700">
                                      <Terminal size={120} />
                                    </div>
                                  </div>
                                )) : (
                                  <div className="bg-[#F3F4F6] p-10 text-center border border-dashed border-[#D1D5DB] grayscale">
                                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#9CA3AF]">No autonomous agents configured</p>
                                  </div>
                                )}
                              </div>

                              <div className="bg-[#E2B13C]/5 border-2 border-[#E2B13C]/20 p-8 shadow-sm">
                                <div className="flex items-center gap-3 mb-6">
                                  <div className="p-2 bg-[#E2B13C] text-[#1A1C1E] rounded-sm">
                                    <Settings size={18} />
                                  </div>
                                  <h4 className="font-bold uppercase tracking-widest text-sm text-[#1A1C1E]">Practice Profile</h4>
                                </div>
                                <p className="text-sm text-[#4B5563] mb-8 leading-relaxed italic border-l-2 border-[#E2B13C] pl-4">
                                  Define the house positions, risk appetites, and escalation matrices that govern this area.
                                </p>
                                <button
                                  onClick={() => setIsEditingProfile(true)}
                                  className="w-full bg-[#1A1C1E] text-[#E2B13C] py-4 text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-[#2D3135] hover:shadow-lg transition-all outline-none focus-visible:ring-2 focus-visible:ring-[#E2B13C]"
                                >
                                  Modify CLAUDE.md
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
                      <header className="border-l-4 border-[#E2B13C] pl-8 mb-12">
                        <h1 className="text-4xl font-bold uppercase tracking-tight mb-3">Calibration Terminal</h1>
                        <p className="text-[#4B5563] text-lg italic">Encoding playbooks and escalation logic for {selectedArea.name}.</p>
                      </header>
                      <ProfileEditor
                        areaName={selectedArea.id}
                        content={mockProfileContent}
                        onSave={(content) => {
                          console.log('Saving profile:', content);
                          setIsEditingProfile(false);
                        }}
                      />
                    </div>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                  {filteredAreas.map((area) => (
                    <button
                      key={area.id}
                      onClick={() => setSelectedArea(area as PracticeArea)}
                      className="bg-white border border-[#E5E7EB] p-10 text-left hover:shadow-2xl hover:-translate-y-1 transition-all group outline-none focus-visible:ring-2 focus-visible:ring-[#E2B13C]"
                    >
                      <div className="text-[#1A1C1E] mb-8 group-hover:scale-110 transition-transform duration-500 ease-out">
                        <PracticeIcon id={area.id} size={40} />
                      </div>
                      <h2 className="text-2xl font-bold mb-4 uppercase tracking-tight group-hover:text-[#E2B13C] transition-colors leading-none">{area.name}</h2>
                      <p className="text-[#4B5563] text-sm leading-relaxed mb-10 line-clamp-3 font-sans">{area.description}</p>
                      <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-[0.2em] border-t border-[#F3F4F6] pt-8">
                        <span className="text-[#9CA3AF] flex items-center gap-2"><Terminal size={14} className="text-[#E2B13C]" /> {area.skills.length} Capabilities</span>
                        <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'matters' && (
            <MatterTracker />
          )}

          {activeTab === 'settings' && (
            <div className="animate-in fade-in duration-500 py-20 text-center max-w-2xl mx-auto">
              <Settings size={64} className="mx-auto mb-8 text-[#E2B13C] animate-[spin_10s_linear_infinite]" />
              <h2 className="text-4xl font-bold uppercase tracking-tight mb-4">System Configuration</h2>
              <p className="text-[#4B5563] text-lg mb-12 italic leading-relaxed">
                Configure global MCP connectors, Anthropic API keys, and repository-wide defaults.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white border border-[#E5E7EB] p-8 text-left shadow-sm">
                  <h4 className="font-bold uppercase tracking-widest text-[10px] text-[#9CA3AF] mb-4">API STATUS</h4>
                  <div className="flex items-center gap-3 text-green-600 font-bold text-sm uppercase tracking-widest">
                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                    Connected
                  </div>
                </div>
                <div className="bg-white border border-[#E5E7EB] p-8 text-left shadow-sm">
                  <h4 className="font-bold uppercase tracking-widest text-[10px] text-[#9CA3AF] mb-4">MCP CONNECTORS</h4>
                  <div className="flex items-center gap-3 text-[#1A1C1E] font-bold text-sm uppercase tracking-widest">
                    12 ACTIVE
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer / Status Bar */}
      <footer className="fixed bottom-0 left-64 right-0 h-8 bg-white border-t border-[#E5E7EB] px-6 flex items-center justify-between z-20 pointer-events-none">
        <div className="flex gap-6 pointer-events-auto">
          <div className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest text-[#9CA3AF]">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
            System Operational
          </div>
          <div className="flex items-center gap-2 text-[9px] font-bold uppercase tracking-widest text-[#9CA3AF]">
            <Terminal size={10} />
            Connectors: 12 Active
          </div>
        </div>
        <div className="text-[9px] font-bold uppercase tracking-widest text-[#9CA3AF]">
          &copy; 2026 Claude for Legal &bull; Anthropic PBC
        </div>
      </footer>
    </div>
  );
}

export default App;
