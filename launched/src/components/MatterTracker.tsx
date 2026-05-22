import {
  FolderKanban, Clock, User, Scale,
  ChevronRight, Filter, MoreVertical
} from 'lucide-react';

interface Matter {
  id: string;
  name: string;
  practiceArea: string;
  status: 'active' | 'archived' | 'pending';
  lastUpdated: string;
  client: string;
  description: string;
}

const MOCK_MATTERS: Matter[] = [
  {
    id: 'MAT-2026-001',
    name: 'Acme Corp Vendor MSA',
    practiceArea: 'Commercial Legal',
    status: 'active',
    lastUpdated: '2 hours ago',
    client: 'Procurement Team',
    description: 'Review of inbound master services agreement for new cloud infrastructure.'
  },
  {
    id: 'MAT-2026-002',
    name: 'Project Phoenix Diligence',
    practiceArea: 'Corporate Legal',
    status: 'active',
    lastUpdated: '1 day ago',
    client: 'M&A Strategy',
    description: 'Tabular review and issue extraction for acquisition target data room.'
  },
  {
    id: 'MAT-2026-003',
    name: 'DSAR Response - User #882',
    practiceArea: 'Privacy Legal',
    status: 'pending',
    lastUpdated: '3 days ago',
    client: 'Customer Success',
    description: 'Statutory deadline for data access request following account termination.'
  }
];

export function MatterTracker() {
  return (
    <div className="animate-in fade-in duration-500">
      <header className="mb-12 border-l-4 border-[#1A1C1E] pl-6 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-bold mb-2 uppercase tracking-tight">Matter Index</h1>
          <p className="text-[#4B5563] italic">Consolidated view of all legal workstreams.</p>
        </div>
        <div className="flex gap-4">
          <button className="flex items-center gap-2 px-4 py-2 border border-[#E5E7EB] bg-white text-[10px] font-bold uppercase tracking-widest hover:bg-[#F8F9FA] transition-colors">
            <Filter size={14} /> Filter
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#1A1C1E] text-white text-[10px] font-bold uppercase tracking-widest hover:bg-[#2D3135] transition-colors">
            + New Matter
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <aside className="space-y-6">
          <div className="bg-white border border-[#E5E7EB] p-6 space-y-4">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#9CA3AF] mb-4">Quick Stats</h3>
            <div className="flex justify-between items-end">
              <span className="text-sm font-medium text-[#4B5563]">Active Matters</span>
              <span className="text-2xl font-bold">12</span>
            </div>
            <div className="flex justify-between items-end">
              <span className="text-sm font-medium text-[#4B5563]">Pending Triage</span>
              <span className="text-2xl font-bold text-[#E2B13C]">3</span>
            </div>
            <div className="flex justify-between items-end">
              <span className="text-sm font-medium text-[#4B5563]">Upcoming Deadlines</span>
              <span className="text-2xl font-bold text-red-500">2</span>
            </div>
          </div>

          <div className="bg-[#1A1C1E] text-white p-6">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-[#E2B13C] mb-4">Workspace Info</h3>
            <p className="text-xs text-[#A0AEC0] leading-relaxed mb-4">
              Matters are stored locally in your <code>~/.claude/plugins/config</code> directory.
            </p>
            <button className="text-[10px] font-bold uppercase tracking-widest border-b border-[#E2B13C] pb-1 hover:text-[#E2B13C] transition-colors">
              Open config directory
            </button>
          </div>
        </aside>

        <div className="lg:col-span-3 space-y-4">
          {MOCK_MATTERS.map((matter) => (
            <div key={matter.id} className="bg-white border border-[#E5E7EB] hover:shadow-md transition-shadow group cursor-pointer">
              <div className="p-6 flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className={`mt-1 w-10 h-10 flex items-center justify-center rounded-sm ${
                    matter.status === 'active' ? 'bg-blue-50 text-blue-600' :
                    matter.status === 'pending' ? 'bg-[#E2B13C]/10 text-[#E2B13C]' :
                    'bg-gray-100 text-gray-500'
                  }`}>
                    <FolderKanban size={20} />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h4 className="font-bold text-lg tracking-tight uppercase group-hover:text-[#E2B13C] transition-colors">
                        {matter.name}
                      </h4>
                      <span className={`text-[8px] font-bold uppercase tracking-[0.2em] px-2 py-0.5 rounded-full ${
                        matter.status === 'active' ? 'bg-blue-50 text-blue-700' :
                        matter.status === 'pending' ? 'bg-[#E2B13C]/20 text-[#1A1C1E]' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {matter.status}
                      </span>
                    </div>
                    <p className="text-sm text-[#4B5563] mb-4 line-clamp-1">{matter.description}</p>
                    <div className="flex items-center gap-6 text-[10px] font-bold uppercase tracking-widest text-[#9CA3AF]">
                      <div className="flex items-center gap-1.5">
                        <Scale size={12} /> {matter.practiceArea}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <User size={12} /> {matter.client}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock size={12} /> Updated {matter.lastUpdated}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <button className="p-2 hover:bg-[#F3F4F6] rounded-sm transition-colors text-[#9CA3AF] hover:text-[#1A1C1E]">
                    <MoreVertical size={16} />
                  </button>
                  <ChevronRight size={20} className="text-[#D1D5DB] group-hover:text-[#1A1C1E] transition-colors" />
                </div>
              </div>
            </div>
          ))}

          <div className="pt-8 border-t border-dashed border-[#E5E7EB] text-center">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#9CA3AF] mb-4">
              All matters indexed from local storage
            </p>
            <div className="flex justify-center gap-2">
              <div className="w-1 h-1 rounded-full bg-[#D1D5DB]"></div>
              <div className="w-1 h-1 rounded-full bg-[#D1D5DB]"></div>
              <div className="w-1 h-1 rounded-full bg-[#D1D5DB]"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
