import { useState, useEffect, useRef, FormEvent, Component, ErrorInfo, ReactNode } from 'react';

// Error Boundary Component for stability
class ErrorBoundary extends (Component as any) {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Something went wrong.</h1>
          <p className="text-gray-600 mb-8">We've encountered an unexpected error. Please try refreshing the page.</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-brand-blue text-white rounded-xl font-bold shadow-lg hover:bg-brand-blue/90 transition-all"
          >
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
import { motion, AnimatePresence } from 'motion/react';
import { Download, FileText, Settings2, Trash2, Users, CircleDollarSign, Gem, Files, Network, ChevronUp, ChevronDown, LogOut } from 'lucide-react';
import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';
import { cn } from '@/src/lib/utils';
import { createClient } from '@/src/utils/supabase/client';
import { MetaData, PESTELData, McKinsey7SData, VRIOAnalysisData, TOWSMatrixData, PortersFiveForcesData } from './types';

const supabase = createClient();

// Access Control Component
const AccessScreen = ({ onAccess }: { onAccess: (group: string, name: string) => void }) => {
  const [selectedGroup, setSelectedGroup] = useState('Group 1');
  const [name, setName] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert("Please enter your name to proceed.");
      return;
    }
    onAccess(selectedGroup, name);
  };

  const groups = Array.from({ length: 11 }, (_, i) => `Group ${i + 1}`);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-8 rounded-3xl shadow-xl border border-gray-100 max-w-md w-full"
      >
        <div className="flex justify-center mb-8">
          <img 
            src="https://i.ibb.co/FqgQzNPw/LOGO-BLEU.png" 
            alt="Business School Logo" 
            className="h-16 object-contain"
          />
        </div>
        
        <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">Strategic Suite Access</h2>
        <p className="text-gray-500 text-center text-sm mb-8">Please enter your name and select your group to proceed.</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest px-1">Your Name</label>
            <div className="relative">
              <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full Name"
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 transition-all text-lg font-bold"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-gray-400 tracking-widest px-1">Your Group</label>
            <div className="relative">
              <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <select
                value={selectedGroup}
                onChange={(e) => setSelectedGroup(e.target.value)}
                className="w-full pl-12 pr-10 py-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none focus:border-brand-blue focus:ring-4 focus:ring-brand-blue/10 transition-all text-lg font-bold appearance-none cursor-pointer"
              >
                {groups.map(g => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" size={18} />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-4 bg-brand-blue text-white rounded-2xl font-bold text-lg hover:bg-brand-blue/90 transition-all shadow-lg active:scale-[0.98]"
          >
            Access Planner
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-100 flex justify-center gap-6">
          <span className="text-[10px] uppercase tracking-widest text-gray-300 font-bold">PESTEL</span>
          <span className="text-[10px] uppercase tracking-widest text-gray-300 font-bold">MCKINSEY 7S</span>
          <span className="text-[10px] uppercase tracking-widest text-gray-300 font-bold">VRIO</span>
        </div>
      </motion.div>
    </div>
  );
};

// Components
const CorporateHeader = ({ meta, setMeta, activeUsers, hideMeta = false }: { meta: MetaData; setMeta: (m: MetaData) => void; activeUsers: any[]; hideMeta?: boolean }) => {
  const removeParticipant = (nameToRemove: string) => {
    setMeta({
      ...meta,
      participants: meta.participants.filter(p => p !== nameToRemove)
    });
  };

  const addParticipant = (name: string) => {
    if (!name.trim() || meta.participants.includes(name.trim())) return;
    setMeta({
      ...meta,
      participants: [...meta.participants, name.trim()]
    });
  };

  return (
    <div className={cn("flex flex-col md:flex-row justify-between border-b-2 border-gray-100 pb-8 mb-8 gap-8", hideMeta && "border-none mb-4")}>
      <div className="flex items-start gap-4">
        <div className="flex items-center">
          <img 
            src="https://i.ibb.co/FqgQzNPw/LOGO-BLEU.png" 
            alt="Business School Logo" 
            className="h-16 object-contain"
            crossOrigin="anonymous"
          />
        </div>
      </div>

      {!hideMeta && (
        <div className="grid grid-cols-2 gap-x-12 gap-y-2 text-sm max-w-xl">
          <div className="flex flex-col border-b border-gray-200 col-span-2">
            <span className="text-gray-500 text-[10px] uppercase tracking-wider font-semibold">Module</span>
            <span className="font-semibold text-black">Strategic Development Project (SDP)</span>
          </div>
          
          <div className="flex flex-col border-b border-gray-200">
            <span className="text-gray-500 text-[10px] uppercase tracking-wider font-semibold">Cohort</span>
            <span className="font-semibold text-black">MA27</span>
          </div>

          <div className="flex flex-col border-b border-gray-200">
            <span className="text-gray-500 text-[10px] uppercase tracking-wider font-semibold">Date</span>
            <span className="font-semibold text-black">05 - 06 June 2026</span>
          </div>

          <div className="flex flex-col border-b border-gray-200 col-span-2">
            <span className="text-gray-500 text-[10px] uppercase tracking-wider font-semibold">Company Name</span>
            <input 
              type="text" 
              value={meta.companyName} 
              onChange={(e) => setMeta({...meta, companyName: e.target.value})}
              className="font-semibold text-gray-700 outline-hidden bg-transparent border-b border-dashed border-gray-300 w-full"
              placeholder="Enter company name..."
            />
          </div>

          <div className="flex flex-col border-b border-gray-200 col-span-2">
            <span className="text-gray-500 text-[10px] uppercase tracking-wider font-semibold">Group</span>
            <input 
              type="text" 
              value={meta.group} 
              onChange={(e) => setMeta({...meta, group: e.target.value})}
              className="font-semibold text-gray-700 outline-hidden bg-transparent border-b border-dashed border-gray-300 w-full"
              placeholder="Group name..."
            />
          </div>

          <div className="flex flex-col border-b border-gray-200 col-span-2 py-2">
            <div className="flex justify-between items-center mb-1">
                <span className="text-gray-500 text-[10px] uppercase tracking-wider font-semibold">Team Members ({meta.participants.length})</span>
                <span className="flex items-center gap-1 text-[10px] text-green-600 bg-green-50 px-2 py-0.5 rounded-full font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-600 animate-pulse" />
                    {activeUsers.length} Online Now
                </span>
            </div>
            <div className="flex flex-wrap gap-2">
                {meta.participants.map((name, index) => {
                    const isOnline = activeUsers.some(u => u.name === name);
                    return (
                        <div key={index} className={cn(
                            "group flex items-center gap-1.5 px-2 py-1 rounded-lg border transition-all",
                            isOnline ? "bg-green-50 border-green-200 text-green-800" : "bg-gray-50 border-gray-200 text-gray-600"
                        )}>
                            <span className="font-bold text-[11px]">{name}</span>
                            <button 
                                onClick={() => removeParticipant(name)}
                                className="opacity-0 group-hover:opacity-100 p-0.5 hover:bg-red-100 hover:text-red-600 rounded transition-all no-print"
                            >
                                <Trash2 size={10} />
                            </button>
                        </div>
                    );
                })}
                <input 
                    type="text"
                    placeholder="+ Add Member"
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            addParticipant(e.currentTarget.value);
                            e.currentTarget.value = '';
                        }
                    }}
                    className="text-[11px] font-bold text-brand-blue outline-none bg-transparent border-b border-dashed border-brand-blue/30 w-24 focus:w-32 transition-all no-print"
                />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


const ConfrontationMatrixGuide = () => (
  <div className="mb-12 p-8 bg-gray-50 rounded-2xl border border-gray-200 print:bg-white print:border-gray-100">
    <h3 className="font-black text-2xl mb-8 text-black border-b-4 border-black inline-block pb-1">
      CONFRONTATION MATRIX FAST GUIDE
    </h3>
    
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-12">
      <div className="space-y-6">
        <h4 className="font-bold text-lg text-black uppercase tracking-tight flex items-center gap-2">
          <div className="w-2 h-6 bg-black" />
          STEPS TO BUILD THE CONFRONTATION MATRIX
        </h4>
        
        <div className="space-y-4">
          <section>
            <p className="font-bold text-sm mb-1 uppercase tracking-wider">1. Start with your SWOT</p>
            <p className="text-gray-600 leading-relaxed text-sm">
              Use your completed SWOT analysis (Strengths, Weaknesses, Opportunities, Threats). <span className="font-semibold text-black">This is the input of the matrix.</span>
            </p>
          </section>

          <section>
            <p className="font-bold text-sm mb-1 uppercase tracking-wider">2. Select key factors</p>
            <p className="text-gray-600 leading-relaxed text-sm">
              Take the 3 most important items from each category. <span className="font-semibold text-black">Keeps the matrix clear and easy to analyze.</span>
            </p>
          </section>

          <section>
            <p className="font-bold text-sm mb-1 uppercase tracking-wider">3. Build the matrix structure</p>
            <p className="text-gray-600 leading-relaxed text-sm">
              Put internal factors (S, W) → <span className="font-semibold text-black">vertically</span>. Put external factors (O, T) → <span className="font-semibold text-black">horizontally</span>. You are confronting internal vs external.
            </p>
          </section>

          <section>
            <p className="font-bold text-sm mb-1 uppercase tracking-wider">4. Analyze each combination</p>
            <p className="text-gray-600 leading-relaxed text-sm mb-2 italic underline decoration-gray-200">
              Evaluate how the internal factor performs in the external environment
            </p>
            <div className="pl-4 border-l-2 border-gray-200 space-y-1">
              <p className="text-sm font-medium">• Does it create value?</p>
              <p className="text-sm font-medium">• Does it create risk?</p>
            </div>
          </section>

          <section>
            <p className="font-bold text-sm mb-1 uppercase tracking-wider">5. Interpret each pairing (Strategic meaning)</p>
            <p className="text-gray-600 leading-relaxed text-sm mb-4">
              For every combination, ask the strategic question: <span className="font-semibold text-black text-xs uppercase bg-gray-100 px-1">"What does this pairing mean?"</span>
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3 bg-white border border-gray-100 rounded-lg">
                <p className="font-bold text-xs mb-1 text-green-700">Strength + Opportunity (S/O)</p>
                <p className="text-[11px] text-gray-500">Exploit an opportunity using a strength → aggressive/growth strategy.</p>
              </div>
              <div className="p-3 bg-white border border-gray-100 rounded-lg">
                <p className="font-bold text-xs mb-1 text-blue-700">Strength + Threat (S/T)</p>
                <p className="text-[11px] text-gray-500">Use a strength to counter a threat → defensive strategy.</p>
              </div>
              <div className="p-3 bg-white border border-gray-100 rounded-lg">
                <p className="font-bold text-xs mb-1 text-amber-700">Weakness + Opportunity (W/O)</p>
                <p className="text-[11px] text-gray-500">Improve weakness to seize opportunity → improvement strategy.</p>
              </div>
              <div className="p-3 bg-white border border-gray-100 rounded-lg">
                <p className="font-bold text-xs mb-1 text-red-700">Weakness + Threat (W/T)</p>
                <p className="text-[11px] text-gray-500">Address weakness to survive threat → survival strategy.</p>
              </div>
            </div>
          </section>
        </div>
      </div>

      <div className="space-y-8">
        <div className="space-y-6">
          <h4 className="font-bold text-lg text-black uppercase tracking-tight flex items-center gap-2">
            <div className="w-2 h-6 bg-black" />
            SCORING & VISUALIZATION
          </h4>
          
          <div className="space-y-4">
            <section>
              <p className="font-bold text-sm mb-2">6. Assign scores</p>
              <div className="flex flex-wrap gap-2">
                {['+2 (Very Positive)', '+1 (Positive)', '0 (Neutral)', '-1 (Negative)', '-2 (Very Negative)'].map(s => (
                  <span key={s} className="px-2 py-1 bg-white border border-gray-200 rounded text-[10px] font-bold text-gray-600">{s}</span>
                ))}
              </div>
            </section>

            <section>
              <p className="font-bold text-sm mb-2">7. Highlight results</p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#C6E0B4]" />
                  <span><span className="font-bold text-black">Positive (+1 to +2)</span> = opportunities</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#FFF2CC]" />
                  <span><span className="font-bold text-black">Neutral (0)</span> = no significant impact / limited strategic relevance</span>
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[#F4B084]" />
                  <span><span className="font-bold text-black">Negative (-1 to -2)</span> = problems</span>
                </li>
              </ul>
              <p className="text-[11px] text-gray-400 mt-4 leading-relaxed italic border-l-4 border-gray-100 pl-4">
                The matrix becomes a visual map of market fit: where to act immediately (positive), what to monitor (neutral), and what to fix urgently (negative).
              </p>
            </section>
          </div>
        </div>

        <div className="pt-6 border-t border-gray-200">
          <h4 className="font-bold text-sm text-black uppercase tracking-widest mb-4">Key Takeaways</h4>
          <ul className="list-disc pl-5 space-y-1 text-sm text-gray-600">
            <li>Quick overview of market position.</li>
            <li>Don’t need all green → every business has weaknesses.</li>
            <li>Helps adjust marketing, focus on strengths, and address risks.</li>
          </ul>
        </div>

        <div className="p-4 bg-black text-white rounded-xl">
          <h4 className="font-bold text-xs uppercase tracking-[0.2em] mb-2 text-gray-400">Final Insight & Priorities</h4>
          <p className="text-[11px] leading-relaxed opacity-90">
            The confrontation matrix is a fast strategic decision tool that bridges analysis and action by turning strategic diagnosis into clear growth and performance priorities. It clarifies positioning, highlights gaps, and enables prioritization of impactful combinations.
          </p>
        </div>
      </div>
    </div>
  </div>
);

const PESTELWorksheet = ({ data, setData }: { data: PESTELData[]; setData: (d: PESTELData[]) => void }) => {
  const categories = ['Political', 'Economic', 'Social', 'Technological', 'Environmental', 'Legal'] as const;

  const updateItem = (id: string, field: keyof PESTELData, value: string) => {
    setData(data.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse border-b-2 border-l-2 border-r-2 border-black">
        <thead>
          <tr className="bg-brand-blue text-black">
            <th className="w-32 border border-black p-4 bg-white"></th>
            <th className="border border-black p-4 text-center font-bold text-lg min-w-[400px]">Description</th>
            <th className="w-24 border border-black p-4 text-center font-bold text-sm">Impact</th>
            <th className="w-24 border border-black p-4 text-center font-bold text-sm">Probability</th>
            <th className="w-48 border border-black p-4 text-center font-bold text-sm leading-tight">Potential as<br/>Opportunity or<br/>Threat</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((cat) => {
            const item = data.find(d => d.category === cat) || {
              id: cat,
              category: cat,
              description: '',
              impact: '',
              probability: '',
              potential: ''
            };
            
            return (
              <tr key={cat} className="group">
                <td className="border border-black p-4 font-bold text-center bg-gray-50 align-middle">
                  {cat}
                </td>
                <td className="border border-black p-0 relative">
                  <textarea
                    value={item.description}
                    onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                    className="w-full h-full min-h-[140px] p-4 bg-transparent outline-hidden resize-none translate-z-0 relative z-10 text-sm leading-[24px] whitespace-pre-wrap"
                    placeholder={`Enter ${cat.toLowerCase()} factors...`}
                  />
                  <div className="absolute inset-x-0 top-0 h-full pointer-events-none p-4 pt-[40px]">
                    {[...Array(2)].map((_, i) => (
                      <div key={i} className="border-b border-dashed border-gray-300 h-[24px]" />
                    ))}
                  </div>
                </td>
                <td className="border border-black p-0">
                  <textarea 
                    value={item.impact}
                    onChange={(e) => updateItem(item.id, 'impact', e.target.value)}
                    className="w-full h-full min-h-[120px] p-2 text-center outline-hidden resize-none bg-transparent"
                  />
                </td>
                <td className="border border-black p-0">
                  <textarea 
                    value={item.probability}
                    onChange={(e) => updateItem(item.id, 'probability', e.target.value)}
                    className="w-full h-full min-h-[120px] p-2 text-center outline-hidden resize-none bg-transparent"
                  />
                </td>
                <td className="border border-black p-0">
                  <textarea 
                    value={item.potential}
                    onChange={(e) => updateItem(item.id, 'potential', e.target.value)}
                    className="w-full h-full min-h-[120px] p-2 text-center outline-hidden resize-none bg-transparent"
                  />
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

const McKinseyWorksheet = ({ data, setData }: { data: McKinsey7SData; setData: (d: McKinsey7SData) => void }) => {
  const elements = [
    { key: 'sharedValues', label: 'Shared Values' },
    { key: 'strategy', label: 'Strategy' },
    { key: 'structure', label: 'Structure' },
    { key: 'systems', label: 'Systems' },
    { key: 'style', label: 'Style' },
    { key: 'staff', label: 'Staff' },
    { key: 'skills', label: 'Skills' }
  ] as const;

  const updateGrid = (rowKey: string, colKey: string, value: string) => {
    setData({
      ...data,
      [rowKey]: {
        ...(data[rowKey] || {}),
        [colKey]: value
      }
    });
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse border-b-2 border-l-2 border-r-2 border-black table-fixed">
        <thead>
          <tr className="bg-brand-peach">
            <th className="w-40 border border-black p-4 bg-white"></th>
            {elements.map(el => (
              <th key={el.key} className="border border-black p-4 text-center font-bold text-[10px] uppercase tracking-tight">
                {el.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {elements.map((rowEl, rowIndex) => (
            <tr key={rowEl.key}>
              <td className="border border-black p-4 font-bold text-center bg-gray-50 text-[10px] uppercase tracking-tight align-middle h-20">
                {rowEl.label}
              </td>
              {elements.map((colEl, colIndex) => {
                const isDiagonal = rowIndex === colIndex;
                const cellValue = data[rowEl.key]?.[colEl.key] || '';
                
                return (
                  <td 
                    key={colEl.key} 
                    className={cn(
                      "border border-black p-0 relative h-20",
                      isDiagonal && "bg-brand-peach"
                    )}
                  >
                    <textarea
                      value={cellValue}
                      onChange={(e) => updateGrid(rowEl.key, colEl.key, e.target.value)}
                      className="w-full h-full p-2 bg-transparent outline-hidden resize-none text-[10px] leading-tight font-medium"
                      placeholder="..."
                    />
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default function App() {
  return (
    <ErrorBoundary>
      <AppContent />
    </ErrorBoundary>
  );
}

function AppContent() {
  const [isAuthorized, setIsAuthorized] = useState(() => {
    return localStorage.getItem('sdp_authorized') === 'true';
  });
  const [activeTab, setActiveTab] = useState<'PESTEL' | 'McKinsey' | 'VRIO' | 'TOWS' | 'PORTER'>('PESTEL');
  const [activeForce, setActiveForce] = useState<keyof PortersFiveForcesData>('suppliers');
  const [isExporting, setIsExporting] = useState(false);
  const [isExportingAll, setIsExportingAll] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeUsers, setActiveUsers] = useState<any[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);
  const isRemoteUpdate = useRef(false);
  const updateTimeout = useRef<NodeJS.Timeout | null>(null);
  const channelRef = useRef<any>(null);

  const [meta, setMeta] = useState<MetaData>(() => {
    const savedMeta = localStorage.getItem('sdp_meta');
    return savedMeta ? JSON.parse(savedMeta) : {
      module: '',
      cohort: '',
      date: '',
      companyName: '',
      participants: [],
      group: ''
    };
  });

  // Persist auth and meta to localStorage
  useEffect(() => {
    localStorage.setItem('sdp_authorized', isAuthorized.toString());
    localStorage.setItem('sdp_meta', JSON.stringify(meta));
  }, [isAuthorized, meta]);

  const sessionId = useRef(Math.random().toString(36).substring(7));

  // Realtime subscription & Presence
  useEffect(() => {
    if (!meta.group) return;

    setIsConnected(true);
    setSyncError(null);

    const channel = supabase.channel(`group:${meta.group}`, {
        config: { presence: { key: sessionId.current } }
    });
    
    channelRef.current = channel;

    // Fetch initial data from DB for new joiners
    const fetchInitial = async () => {
        setIsLoading(true);
        isRemoteUpdate.current = true; // Lock sync immediately
        try {
            const { data, error } = await supabase
                .from('groups')
                .select('*')
                .eq('group_id', meta.group)
                .order('created_at', { ascending: false })
                .limit(1)
                .maybeSingle();
            
            if (error) throw error;

            if (data?.content) {
                console.log('Restoring data from cloud...');
                applyState(data.content);
            }
        } catch (err) {
            console.error('Initial fetch failed:', err);
            setSyncError('Failed to load initial data. Collaboration might be out of sync.');
        } finally {
            // Wait extra time before unlocking sync to ensure state updates have settled
            setTimeout(() => { 
                setIsLoading(false); 
                isRemoteUpdate.current = false;
            }, 1000);
        }
    };
    fetchInitial();
    
    channel
      .on('broadcast', { event: 'state-update' }, (message) => {
        if (message?.payload?.state) {
            applyState(message.payload.state);
        }
      })
      .on('presence', { event: 'sync' }, () => {
        const state = channel.presenceState();
        // Defensive mapping to ensure we have objects with names
        const users = Object.values(state)
            .flat()
            .map((p: any) => p.user)
            .filter(u => u && typeof u === 'object' && u.name);
        setActiveUsers(users);
      })
      .subscribe((status) => {
        console.log('Subscription status:', status);
        if (status === 'SUBSCRIBED') {
            setIsConnected(true);
        } else if (status === 'CLOSED' || status === 'CHANNEL_ERROR') {
            setIsConnected(false);
            setSyncError('Connection lost. Trying to reconnect...');
        }
      });

    // Track own presence
    const currentUserName = meta.participants[meta.participants.length - 1];
    if (currentUserName) {
        channel.track({ 
            user: { 
                id: sessionId.current, 
                name: currentUserName 
            } 
        });
    }

    return () => {
      supabase.removeChannel(channel);
      channelRef.current = null;
    };
  }, [meta.group]);

  const applyState = (updatedState: any) => {
      if (!updatedState) return;
      isRemoteUpdate.current = true;
      console.log('Applying state update:', updatedState);
      
      try {
          if (updatedState.meta) setMeta(prev => {
            const incomingParticipants = updatedState.meta.participants || [];
            const mergedParticipants = Array.from(new Set([...prev.participants, ...incomingParticipants])).filter(Boolean);
            const newMeta = { ...prev, ...updatedState.meta, participants: mergedParticipants };
            if (JSON.stringify(prev) === JSON.stringify(newMeta)) return prev;
            return newMeta;
          });
          
          if (updatedState.pestel && Array.isArray(updatedState.pestel)) setPestelData(prev => {
            if (JSON.stringify(prev) === JSON.stringify(updatedState.pestel)) return prev;
            return updatedState.pestel;
          });
          
          if (updatedState.mckinsey) setMckinseyData(prev => {
            if (JSON.stringify(prev) === JSON.stringify(updatedState.mckinsey)) return prev;
            return updatedState.mckinsey;
          });
          
          if (updatedState.vrio && Array.isArray(updatedState.vrio)) setVrioAnalysisData(prev => {
            if (JSON.stringify(prev) === JSON.stringify(updatedState.vrio)) return prev;
            return updatedState.vrio;
          });
          
          if (updatedState.vrioNotes !== undefined) setVrioNotes(prev => {
            if (prev === updatedState.vrioNotes) return prev;
            return updatedState.vrioNotes;
          });
          
          if (updatedState.tows) setTowsData(prev => {
            if (JSON.stringify(prev) === JSON.stringify(updatedState.tows)) return prev;
            return updatedState.tows;
          });
          
          if (updatedState.porters) setPortersData(prev => {
            if (JSON.stringify(prev) === JSON.stringify(updatedState.porters)) return prev;
            return updatedState.porters;
          });
      } catch (err) {
          console.error('Error applying remote state:', err);
      } finally {
          // If this is a broadcast update (not initial load), reset the flag after a delay
          if (!isLoading) {
            setTimeout(() => { isRemoteUpdate.current = false; }, 800);
          }
      }
  };

  const handleAccess = async (group: string, name: string) => {
    const updatedMeta = {
        ...meta,
        group,
        participants: meta.participants.includes(name) ? meta.participants : [...meta.participants, name]
    };
    setMeta(updatedMeta);
    setIsAuthorized(true);
    
    // Trigger immediate save
    try {
        const { error } = await supabase.from('groups').upsert({
            group_id: group,
            content: {
                meta: updatedMeta,
                pestel: pestelData,
                mckinsey: mckinseyData,
                vrio: vrioAnalysisData,
                vrioNotes: vrioNotes,
                tows: towsData,
                porters: portersData
            }
        });
        if (error) throw error;
    } catch (err) {
        console.error('Initial access save failed:', err);
        setSyncError('Failed to save session data to cloud. Collaboration might be limited.');
    }
  };

  const [pestelData, setPestelData] = useState<PESTELData[]>(
    ['Political', 'Economic', 'Social', 'Technological', 'Environmental', 'Legal'].map(cat => ({
      id: cat,
      category: cat as any,
      description: '',
      impact: '',
      probability: '',
      potential: ''
    }))
  );

  const [mckinseyData, setMckinseyData] = useState<McKinsey7SData>({});
  const [vrioAnalysisData, setVrioAnalysisData] = useState<VRIOAnalysisData[]>(
    Array.from({ length: 8 }, (_, i) => ({
      id: `res-${i}`,
      resource: '',
      type: '',
      detail: '',
      v: '',
      r: '',
      i: '',
      o: ''
    }))
  );
  const [vrioNotes, setVrioNotes] = useState('');
  
  const [towsData, setTowsData] = useState<TOWSMatrixData>({
    opportunities: Array(3).fill(''),
    threats: Array(3).fill(''),
    strengths: Array(3).fill(''),
    weaknesses: Array(3).fill(''),
    scores: {}
  });

  const [portersData, setPortersData] = useState<PortersFiveForcesData>({
    newEntrants: { analysis: '', impact: 'Medium', scorecard: {}, further: Array.from({ length: 3 }, () => ({ col1: '', col2: '', col3: '' })) },
    buyers: { analysis: '', impact: 'Medium', scorecard: {}, further: Array.from({ length: 5 }, () => ({ col1: '', col2: '', col3: '' })) },
    suppliers: { analysis: '', impact: 'Medium', scorecard: {}, further: Array.from({ length: 5 }, () => ({ col1: '', col2: '', col3: '' })) },
    substitutes: { analysis: '', impact: 'Medium', scorecard: {}, further: Array.from({ length: 5 }, () => ({ col1: '', col2: '', col3: '' })) },
    rivalry: { analysis: '', impact: 'Medium', scorecard: {}, further: Array.from({ length: 8 }, () => ({ col1: '', col2: '', col3: '', col4: '' })) },
  });

  const prevState = useRef<any>({});

  // Consolidated Synchronization (Broadcast + DB Persistence)
  useEffect(() => {
    // Only sync if it's a local update
    if (!isAuthorized || !meta.group || isRemoteUpdate.current || isLoading) {
        return;
    }

    if (updateTimeout.current) clearTimeout(updateTimeout.current);

    updateTimeout.current = setTimeout(async () => {
      // Re-check conditions inside the timeout to prevent race conditions
      if (!isAuthorized || !meta.group || isRemoteUpdate.current || isLoading) {
        return;
      }

      const currentState = { 
        meta, 
        pestel: pestelData, 
        mckinsey: mckinseyData, 
        vrio: vrioAnalysisData, 
        vrioNotes: vrioNotes, 
        tows: towsData, 
        porters: portersData 
      };

      // Find what changed
      const changedSections: any = {};
      Object.keys(currentState).forEach(key => {
        if (JSON.stringify((currentState as any)[key]) !== JSON.stringify(prevState.current[key])) {
          changedSections[key] = (currentState as any)[key];
        }
      });

      if (Object.keys(changedSections).length === 0) return;

      console.log('Syncing changed sections:', Object.keys(changedSections));
      setIsSyncing(true);
      setSyncError(null);

      try {
        // 1. Broadcast only changed sections for speed
        if (channelRef.current) {
            const status = await channelRef.current.send({
                type: 'broadcast',
                event: 'state-update',
                payload: { state: changedSections }
            });
            if (status !== 'ok') throw new Error('Broadcast failed');
        }

        // 2. Persist full state to DB for new joiners & durability
        const { error } = await supabase.from('groups').upsert({
            group_id: meta.group,
            content: currentState
        });

        if (error) throw error;
        
        prevState.current = currentState;
      } catch (err) {
        console.error('Sync failed:', err);
        setSyncError('Sync failed. Changes might not be saved to others.');
      } finally {
        setIsSyncing(false);
      }
    }, 800);

    return () => {
      if (updateTimeout.current) clearTimeout(updateTimeout.current);
    };
  }, [meta, pestelData, mckinseyData, vrioAnalysisData, vrioNotes, towsData, portersData, isAuthorized, isLoading]);


  const exportPDF = async () => {
    if (!containerRef.current) return;
    setIsExporting(true);

    try {
      const element = containerRef.current;
      
      // Use html-to-image instead of html2canvas for better modern CSS support
      const imgData = await toPng(element, {
        quality: 1.0,
        pixelRatio: 2,
        backgroundColor: '#ffffff',
        style: {
          boxShadow: 'none',
          margin: '0',
          transform: 'none'
        }
      });

      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      
      const imgProps = pdf.getImageProperties(imgData);
      const imgRatio = imgProps.width / imgProps.height;
      const pageRatio = pageWidth / pageHeight;

      let finalWidth, finalHeight;

      // Fit to page while maintaining aspect ratio
      if (imgRatio > pageRatio) {
          finalWidth = pageWidth;
          finalHeight = pageWidth / imgRatio;
      } else {
          finalHeight = pageHeight;
          finalWidth = pageHeight * imgRatio;
      }

      // Calculate centering
      const x = (pageWidth - finalWidth) / 2;
      const y = (pageHeight - finalHeight) / 2;
      
      pdf.addImage(imgData, 'PNG', x, y, finalWidth, finalHeight);
      pdf.save(`${activeTab}_Worksheet_${meta.companyName || 'Export'}.pdf`);
    } catch (error) {
      console.error('Export failed:', error);
    } finally {
      setIsExporting(false);
    }
  };

  const exportAllPDF = async () => {
    setIsExporting(true);
    setIsExportingAll(true);

    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });

    try {
      const exportContainer = document.createElement('div');
      exportContainer.style.position = 'absolute';
      exportContainer.style.left = '-9999px';
      exportContainer.style.top = '0';
      exportContainer.style.width = '297mm'; // A4 landscape width
      document.body.appendChild(exportContainer);

      const renderTab = async (tab: string, force?: string) => {
        const root = document.createElement('div');
        root.className = 'bg-white p-8';
        root.style.width = '297mm';
        exportContainer.innerHTML = '';
        exportContainer.appendChild(root);

        // This is a simplified approach: we render a static version of the components
        // For a more robust solution, we'd use a dedicated ExportComponent
        // but for now, we'll use the existing components with the current data.
        
        // We'll use a temporary React root if needed, but since we have the data, 
        // we can just pass it to the component functions if they were exported.
        // Since they are not, we'll continue with the "tab switching" but optimized.
      };

      // Actually, a better way without refactoring every component to be exportable:
      // We'll use a hidden "PrintContainer" that is always in the DOM but hidden.
      // I'll add this to the main render.
      
      const printRef = document.getElementById('full-report-print-container');
      if (!printRef) throw new Error('Print container not found');

      const sections = printRef.querySelectorAll('.print-section');
      let isFirstPage = true;

      for (let i = 0; i < sections.length; i++) {
        const section = sections[i] as HTMLElement;
        
        // Ensure section is visible for capture but still hidden from user
        section.style.display = 'block';
        
        const imgData = await toPng(section, {
          quality: 1.0,
          pixelRatio: 2,
          backgroundColor: '#ffffff',
        });

        if (!isFirstPage) pdf.addPage();
        isFirstPage = false;

        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();
        const imgProps = pdf.getImageProperties(imgData);
        const imgRatio = imgProps.width / imgProps.height;
        const pageRatio = pageWidth / pageHeight;

        let finalWidth, finalHeight;
        if (imgRatio > pageRatio) {
            finalWidth = pageWidth;
            finalHeight = pageWidth / imgRatio;
        } else {
            finalHeight = pageHeight;
            finalWidth = pageHeight * imgRatio;
        }

        const x = (pageWidth - finalWidth) / 2;
        const y = (pageHeight - finalHeight) / 2;
        pdf.addImage(imgData, 'PNG', x, y, finalWidth, finalHeight);
        
        // Hide it back
        section.style.display = 'none';
      }

      pdf.save(`Full_Strategy_Report_${meta.companyName || 'Export'}.pdf`);
    } catch (error) {
      console.error('Export all failed:', error);
      setSyncError('Failed to generate full report. Please try again.');
    } finally {
      setIsExporting(false);
      setIsExportingAll(false);
    }
  };

  const handleLogout = () => {

    if (confirm('Are you sure you want to exit this session? Your data will remain saved in the cloud.')) {
      localStorage.removeItem('sdp_authorized');
      localStorage.removeItem('sdp_meta');
      window.location.reload();
    }
  };

  const clearData = () => {
    if (confirm('Clear all data for this worksheet?')) {
      if (activeTab === 'PESTEL') {
        setPestelData(['Political', 'Economic', 'Social', 'Technological', 'Environmental', 'Legal'].map(cat => ({
          id: cat,
          category: cat as any,
          description: '',
          impact: '',
          probability: '',
          potential: ''
        })));
      } else if (activeTab === 'McKinsey') {
        setMckinseyData({});
      } else if (activeTab === 'VRIO') {
        setVrioAnalysisData(Array.from({ length: 8 }, (_, i) => ({
          id: `res-${i}`,
          resource: '',
          type: '',
          detail: '',
          v: '',
          r: '',
          i: '',
          o: ''
        })));
        setVrioNotes('');
      } else if (activeTab === 'TOWS') {
        setTowsData({
          opportunities: Array(3).fill(''),
          threats: Array(3).fill(''),
          strengths: Array(3).fill(''),
          weaknesses: Array(3).fill(''),
          scores: {}
        });
      } else if (activeTab === 'PORTER') {
        setPortersData({
          newEntrants: { analysis: '', impact: 'Medium', scorecard: {}, further: Array(3).fill({ col1: '', col2: '', col3: '' }) },
          buyers: { analysis: '', impact: 'Medium', scorecard: {}, further: Array(5).fill({ col1: '', col2: '', col3: '' }) },
          suppliers: { analysis: '', impact: 'Medium', scorecard: {}, further: Array(5).fill({ col1: '', col2: '', col3: '' }) },
          substitutes: { analysis: '', impact: 'Medium', scorecard: {}, further: Array(5).fill({ col1: '', col2: '', col3: '' }) },
          rivalry: { analysis: '', impact: 'Medium', scorecard: {}, further: Array(8).fill({ col1: '', col2: '', col3: '', col4: '' }) },
        });
      }
    }
  };

  if (!isAuthorized) {
    return <AccessScreen onAccess={handleAccess} />;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 border-4 border-brand-blue/30 border-t-brand-blue rounded-full animate-spin mb-4" />
        <p className="text-gray-500 font-bold animate-pulse">Synchronizing Session...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 py-12 px-4 selection:bg-brand-blue selection:text-white relative">
      {/* Global Status Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 flex justify-center pointer-events-none pt-4">
        <div className="flex gap-4 pointer-events-auto">
          {isSyncing && (
            <div className="bg-white/90 backdrop-blur-sm px-4 py-1.5 rounded-full shadow-lg border border-indigo-100 flex items-center gap-2 animate-in fade-in slide-in-from-top-4">
              <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest text-indigo-700">Syncing...</span>
            </div>
          )}
          {syncError && (
            <div className="bg-red-500 text-white px-4 py-1.5 rounded-full shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-top-4">
              <span className="text-[10px] font-black uppercase tracking-widest">{syncError}</span>
              <button onClick={() => setSyncError(null)} className="hover:opacity-80"><Trash2 size={12} /></button>
            </div>
          )}
          {!isConnected && !syncError && (
            <div className="bg-amber-500 text-white px-4 py-1.5 rounded-full shadow-lg flex items-center gap-2 animate-in fade-in slide-in-from-top-4">
              <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest">Reconnecting...</span>
            </div>
          )}
        </div>
      </div>

      {/* Controls */}
      <div className="max-w-[297mm] mx-auto mb-6 flex flex-wrap gap-4 items-center justify-between no-print">
        <div className="flex bg-white rounded-xl p-1 shadow-sm border border-gray-200">
          <button
            onClick={() => setActiveTab('PESTEL')}
            className={cn(
              "px-6 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2",
              activeTab === 'PESTEL' 
                ? "bg-brand-blue text-white shadow-md" 
                : "bg-transparent text-gray-500 hover:text-gray-800"
            )}
          >
            <FileText size={18} />
            PESTEL Analysis
          </button>
          <button
            onClick={() => setActiveTab('McKinsey')}
            className={cn(
              "px-6 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2",
              activeTab === 'McKinsey' 
                ? "bg-brand-peach text-gray-900 shadow-md" 
                : "bg-transparent text-gray-500 hover:text-gray-800"
            )}
          >
            <Settings2 size={18} />
            McKinsey 7-S
          </button>
          <button
            onClick={() => setActiveTab('VRIO')}
            className={cn(
              "px-6 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2",
              activeTab === 'VRIO' 
                ? "bg-gray-800 text-white shadow-md" 
                : "bg-transparent text-gray-500 hover:text-gray-800"
            )}
          >
            <Settings2 size={18} />
            VRIO Framework
          </button>
          <button
            onClick={() => setActiveTab('TOWS')}
            className={cn(
              "px-6 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2",
              activeTab === 'TOWS' 
                ? "bg-[#FFE082] text-gray-900 shadow-md" 
                : "bg-transparent text-gray-500 hover:text-gray-800"
            )}
          >
            <Network size={18} />
            Confrontation Matrix
          </button>
          <button
            onClick={() => setActiveTab('PORTER')}
            className={cn(
              "px-6 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2",
              activeTab === 'PORTER' 
                ? "bg-indigo-600 text-white shadow-md" 
                : "bg-transparent text-gray-500 hover:text-gray-800"
            )}
          >
            <Files size={18} />
            Porter's 5 Forces
          </button>
        </div>

        <div className="flex gap-4 items-center">
          {/* Connection Status & Active Users */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1 bg-white border border-gray-100 rounded-full shadow-xs">
              <div className={cn("w-2 h-2 rounded-full", isConnected ? (isSyncing ? "bg-blue-500 animate-pulse" : "bg-green-500") : "bg-red-500")} />
              <span className="text-[10px] font-black uppercase tracking-wider text-gray-400">
                {isConnected ? (isSyncing ? "Syncing" : "Connected") : "Connecting..."}
              </span>
            </div>
            
            <div className="flex -space-x-2 overflow-hidden items-center">
              {activeUsers.map((user, i) => (
                <div 
                  key={user.id} 
                  className={cn(
                    "inline-block h-8 w-8 rounded-full ring-2 ring-white flex items-center justify-center text-white text-[10px] font-black uppercase shadow-sm",
                    i % 3 === 0 ? "bg-brand-blue" : i % 3 === 1 ? "bg-indigo-500" : "bg-slate-700"
                  )}
                  title={user.name}
                >
                  {user.name.charAt(0)}
                </div>
              ))}
              {activeUsers.length > 0 && (
                <span className="ml-4 text-[9px] font-black text-gray-400 uppercase tracking-widest bg-gray-50 px-2 py-1 rounded-md border border-gray-100">
                  {activeUsers.length} active
                </span>
              )}
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={clearData}
              className="p-3 bg-white text-red-500 hover:bg-red-50 rounded-xl transition-colors shadow-sm border border-gray-200 group relative"
              title="Clear data"
            >
              <Trash2 size={20} />
              <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                Clear Current Sheet
              </span>
            </button>
            <button
              onClick={exportPDF}
              disabled={isExporting}
              className="px-6 py-3 bg-gray-800 text-white rounded-xl font-bold flex items-center gap-2 hover:bg-gray-700 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
            >
              {isExporting && !isExportingAll ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Exporting...
                </span>
              ) : (
                <>
                  <Download size={20} />
                  Export Page
                </>
              )}
            </button>
            <button
              onClick={exportAllPDF}
              disabled={isExporting}
              className="px-6 py-3 bg-indigo-600 text-white rounded-xl font-bold flex items-center gap-2 hover:bg-indigo-700 transition-all shadow-md disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
            >
              {isExportingAll ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Generating Full Report...
                </span>
              ) : (
                <>
                  <Files size={20} />
                  Export Full Report
                  </>
                  )}
                  </button>
                  <button
                    onClick={handleLogout}
                    className="p-3 bg-white text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all shadow-sm border border-gray-200 group relative"
                    title="Exit session"
                  >
                    <LogOut size={20} />
                    <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                      Exit Session
                    </span>
                  </button>
                  </div>
                  </div>
                  </div>

                  {/* Main Worksheet Area */}
                  <div className="overflow-x-auto pb-12">
                  <div ref={containerRef} className="worksheet-container relative overflow-hidden">
                  <CorporateHeader meta={meta} setMeta={setMeta} activeUsers={activeUsers} hideMeta={false} />

                  {activeTab === 'TOWS' && <ConfrontationMatrixGuide />}

                  <div className="mb-6">
                  <div className="flex items-end justify-between">
                    <h2 className={cn(
                      "text-4xl font-bold uppercase tracking-tight text-gray-900 inline-block",
                      activeTab === 'VRIO' ? "border-b-[12px] border-black pb-2" : 
                      activeTab === 'TOWS' ? "border-b-[12px] border-[#FFD666] pb-2" :
                      activeTab === 'PORTER' ? "border-b-[12px] border-indigo-600 pb-2" :
                      "border-b-8 border-gray-100"
                    )}>
                      {activeTab === 'PESTEL' ? 'PESTEL Worksheet' : 
                       activeTab === 'McKinsey' ? 'McKinsey 7-S Worksheet' : 
                       activeTab === 'VRIO' ? 'VRIO Framework' :
                       activeTab === 'TOWS' ? 'Confrontation Matrix' :
                       "Porter's Five Forces"}
                    </h2>
                    <div className="text-xs font-mono text-gray-400">
                      FRAMEWORK_ID: {
                        activeTab === 'PESTEL' ? 'ENV_MACRO_01' : 
                        activeTab === 'McKinsey' ? 'ORG_ALIG_02' : 
                        activeTab === 'VRIO' ? 'COMP_ADV_03' :
                        activeTab === 'TOWS' ? 'STRAT_MAT_04' :
                        'IND_COMP_05'
                      }
                    </div>
                  </div>
                  </div>


                  <AnimatePresence mode="wait">
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {activeTab === 'PESTEL' ? (
                      <PESTELWorksheet data={pestelData} setData={setPestelData} />
                    ) : activeTab === 'McKinsey' ? (
                      <McKinseyWorksheet data={mckinseyData} setData={setMckinseyData} />
                    ) : activeTab === 'VRIO' ? (
                      <div className="space-y-12">
                        <VRIOFramework />
                        <VRIOAnalysisTable data={vrioAnalysisData} setData={setVrioAnalysisData} notes={vrioNotes} setNotes={setVrioNotes} />
                      </div>
                    ) : activeTab === 'TOWS' ? (
                      <div className="space-y-12">
                        <TOWSWorksheet data={towsData} setData={setTowsData} meta={meta} setMeta={setMeta} />
                      </div>
                    ) : (
                      <PortersFiveForces data={portersData} setData={setPortersData} activeForce={activeForce} setActiveForce={setActiveForce} />
                    )}
                  </motion.div>
                  </AnimatePresence>
          
          {/* Watermark-like info for screen only */}
          {!isExporting && (
            <div className="absolute top-2 right-2 text-[8px] text-gray-200 pointer-events-none uppercase tracking-tighter sm:block hidden">
              Current Session
            </div>
          )}
        </div>
      </div>

      {/* Hidden container for full report generation - avoids UI flicker */}
      <div id="full-report-print-container" className="hidden" aria-hidden="true">
        <div className="print-section bg-white p-12 w-[297mm]">
          <CorporateHeader meta={meta} setMeta={setMeta} activeUsers={activeUsers} />
          <h2 className="text-4xl font-bold uppercase tracking-tight text-gray-900 border-b-8 border-gray-100 pb-2 mb-8">PESTEL Analysis</h2>
          <PESTELWorksheet data={pestelData} setData={() => {}} />
        </div>
        <div className="print-section bg-white p-12 w-[297mm]">
          <CorporateHeader meta={meta} setMeta={setMeta} activeUsers={activeUsers} />
          <h2 className="text-4xl font-bold uppercase tracking-tight text-gray-900 border-b-8 border-gray-100 pb-2 mb-8">McKinsey 7-S Framework</h2>
          <McKinseyWorksheet data={mckinseyData} setData={() => {}} />
        </div>
        <div className="print-section bg-white p-12 w-[297mm]">
          <CorporateHeader meta={meta} setMeta={setMeta} activeUsers={activeUsers} />
          <h2 className="text-4xl font-bold uppercase tracking-tight text-gray-900 border-b-8 border-gray-100 pb-2 mb-8">VRIO Framework</h2>
          <VRIOFramework />
          <div className="mt-8">
            <VRIOAnalysisTable data={vrioAnalysisData} setData={() => {}} notes={vrioNotes} setNotes={() => {}} />
          </div>
        </div>
        <div className="print-section bg-white p-12 w-[297mm]">
          <ConfrontationMatrixGuide />
          <div className="mt-8">
            <h2 className="text-4xl font-bold uppercase tracking-tight text-gray-900 border-b-[12px] border-[#FFD666] pb-2 mb-8">Confrontation Matrix</h2>
            <TOWSWorksheet data={towsData} setData={() => {}} meta={meta} setMeta={() => {}} />
          </div>
        </div>
        {/* Porter's 5 Forces - Each force gets a page */}
        {(['suppliers', 'buyers', 'newEntrants', 'substitutes', 'rivalry'] as const).map(force => (
          <div key={force} className="print-section bg-white p-12 w-[297mm]">
            <CorporateHeader meta={meta} setMeta={setMeta} activeUsers={activeUsers} />
            <h2 className="text-4xl font-bold uppercase tracking-tight text-gray-900 border-b-8 border-indigo-600 pb-2 mb-8">Porter's 5 Forces: {force.toUpperCase()}</h2>
            <PortersFiveForces data={portersData} setData={() => {}} activeForce={force} setActiveForce={() => {}} />
          </div>
        ))}
      </div>

    </main>
  );
}

const TOWSWorksheet = ({ data, setData, meta, setMeta }: { data: TOWSMatrixData; setData: (d: TOWSMatrixData) => void; meta: MetaData; setMeta: (m: MetaData) => void }) => {
  const updateList = (type: 'opportunities' | 'threats' | 'strengths' | 'weaknesses', index: number, value: string) => {
    const newList = [...data[type]];
    newList[index] = value;
    setData({ ...data, [type]: newList });
  };

  const updateScore = (rowType: 'strengths' | 'weaknesses', rowIndex: number, colType: 'opportunities' | 'threats', colIndex: number, value: string) => {
    // Basic sanitization: allow empty, -, +, and numbers
    if (value !== "" && value !== "-" && value !== "+" && isNaN(parseInt(value))) return;
    
    let finalValue: string | number = value;
    if (value !== "" && value !== "-" && value !== "+") {
      const numValue = parseInt(value);
      finalValue = Math.max(-2, Math.min(2, numValue));
    }
    
    setData({
      ...data,
      scores: {
        ...data.scores,
        [`${rowType}-${rowIndex}-${colType}-${colIndex}`]: finalValue
      }
    });
  };

  const getScore = (rowType: 'strengths' | 'weaknesses', rowIndex: number, colType: 'opportunities' | 'threats', colIndex: number) => {
    return data.scores[`${rowType}-${rowIndex}-${colType}-${colIndex}`] ?? 0;
  };

  const getScoreNumber = (rowType: 'strengths' | 'weaknesses', rowIndex: number, colType: 'opportunities' | 'threats', colIndex: number) => {
    const val = getScore(rowType, rowIndex, colType, colIndex);
    const num = parseInt(String(val));
    return isNaN(num) ? 0 : num;
  };

  const getRowTotal = (rowType: 'strengths' | 'weaknesses', rowIndex: number) => {
    let total = 0;
    ['opportunities', 'threats'].forEach((colType) => {
      for (let i = 0; i < 3; i++) {
        total += getScoreNumber(rowType, rowIndex, colType as any, i);
      }
    });
    return total;
  };

  const getColTotal = (colType: 'opportunities' | 'threats', colIndex: number) => {
    let total = 0;
    ['strengths', 'weaknesses'].forEach((rowType) => {
      for (let i = 0; i < 3; i++) {
        total += getScoreNumber(rowType as any, i, colType, colIndex);
      }
    });
    return total;
  };

  const getBgColor = (scoreValue: string | number) => {
    const score = parseInt(String(scoreValue));
    if (isNaN(score)) return 'bg-white';
    if (score >= 1) return 'bg-[#C6E0B4]'; // Positive / Very positive (Unified Green)
    if (score === 0) return 'bg-[#FFF2CC]'; // Neutral (Yellow)
    if (score <= -1) return 'bg-[#F4B084]'; // Negative / Very negative (Unified Red/Orange)
    return 'bg-white';
  };

  const getTextColor = (scoreValue: string | number) => {
    const score = parseInt(String(scoreValue));
    if (isNaN(score)) return 'text-gray-700';
    if (score > 0) return 'text-[#385623]';
    if (score < 0) return 'text-[#843C0C]';
    return 'text-gray-700';
  };

  const MatrixCell = ({
    rowType,
    colType,
    rIdx,
    cIdx
  }: {
    rowType: 'strengths' | 'weaknesses';
    colType: 'opportunities' | 'threats';
    rIdx: number;
    cIdx: number;
    key?: string;
  }) => {
    const score = getScore(rowType, rIdx, colType, cIdx);
    return (
      <div className={cn("border border-gray-400 h-14 flex items-center justify-center transition-colors", getBgColor(score))}>
        <input
          type="text"
          value={score}
          onChange={(e) => updateScore(rowType, rIdx, colType, cIdx, e.target.value)}
          className={cn("w-full h-full text-center font-bold text-lg bg-transparent outline-hidden", getTextColor(score))}
          placeholder="0"
        />
      </div>
    );
  };

  return (
    <div className="bg-white p-12 rounded-xl border border-gray-100 overflow-x-auto min-w-[1100px]">
      <div className="grid grid-cols-[50px_160px_1fr_20px_1fr_100px] gap-0">
        
        {/* ROW 1: Opportunities/Threats Headers */}
        <div className="col-span-2" />
        <div className="bg-black text-[#FFD666] py-3 text-center font-bold text-2xl uppercase tracking-wider mb-2 mx-1 border border-black">
          Opportunities
        </div>
        <div /> {/* Gap col */}
        <div className="bg-black text-[#FFD666] py-3 text-center font-bold text-2xl uppercase tracking-wider mb-2 mx-1 border border-black">
          Threats
        </div>
        <div />

        {/* ROW 2: Opportunity/Threat Item Headers */}
        <div className="col-span-2" />
        <div className="grid grid-cols-3 border border-black h-36 bg-[#D9D9D9] mx-1">
          {[0, 1, 2].map(i => (
            <div key={i} className="border-r border-black last:border-r-0 p-3 flex items-center justify-center">
              <textarea
                value={data.opportunities[i]}
                onChange={(e) => updateList('opportunities', i, e.target.value)}
                className="w-full h-full text-[12px] leading-tight text-center font-bold bg-transparent outline-hidden resize-none flex items-center justify-center"
                placeholder="..."
              />
            </div>
          ))}
        </div>
        <div /> {/* Gap col */}
        <div className="grid grid-cols-3 border border-black h-36 bg-[#D9D9D9] mx-1">
          {[0, 1, 2].map(i => (
            <div key={i} className="border-r border-black last:border-r-0 p-3 flex items-center justify-center">
              <textarea
                value={data.threats[i]}
                onChange={(e) => updateList('threats', i, e.target.value)}
                className="w-full h-full text-[12px] leading-tight text-center font-bold bg-transparent outline-hidden resize-none flex items-center justify-center"
                placeholder="..."
              />
            </div>
          ))}
        </div>
        <div className="flex items-end justify-center pb-2">
          <span className="font-bold text-xs uppercase tracking-widest text-[#595959] vertical-text">Total</span>
        </div>

        {/* ROW 3: Strengths Label & Matrix */}
        <div className="bg-black text-[#FFD666] flex items-center justify-center font-bold text-2xl uppercase vertical-text mt-2 mx-1 border border-black">
          Strengths
        </div>
        <div className="flex flex-col bg-[#D9D9D9] mt-2 border-y border-l border-black">
          {[0, 1, 2].map(i => (
            <div key={i} className="h-14 border-b border-black last:border-b-0 p-2 flex items-center justify-center text-center">
              <textarea
                value={data.strengths[i]}
                onChange={(e) => updateList('strengths', i, e.target.value)}
                className="w-full h-full text-[12px] font-bold bg-transparent outline-hidden resize-none text-center flex items-center justify-center"
                placeholder="..."
              />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-3 mt-2 border border-black mx-1">
          {[0, 1, 2].map(r => [0, 1, 2].map(c => <MatrixCell key={`s-o-${r}-${c}`} rowType="strengths" colType="opportunities" rIdx={r} cIdx={c} />))}
        </div>
        <div /> {/* Gap col */}
        <div className="grid grid-cols-3 mt-2 border border-black mx-1">
          {[0, 1, 2].map(r => [0, 1, 2].map(c => <MatrixCell key={`s-t-${r}-${c}`} rowType="strengths" colType="threats" rIdx={r} cIdx={c} />))}
        </div>
        <div className="flex flex-col bg-[#C6E0B4]/60 mt-2 border border-black ml-1">
          {[0, 1, 2].map(i => {
            const total = getRowTotal('strengths', i);
            return (
              <div key={i} className={cn("h-14 flex items-center justify-center font-bold text-xl border-b border-black last:border-0", getTextColor(total), total > 0 ? "bg-[#C6E0B4]" : (total < 0 ? "bg-[#F4B084]" : "bg-[#FFF2CC]"))}>
                {total}
              </div>
            );
          })}
        </div>

        {/* ROW 4: Gap row */}
        <div className="h-4 col-span-6" />

        {/* ROW 5: Weaknesses Label & Matrix */}
        <div className="bg-black text-[#FFD666] flex items-center justify-center font-bold text-2xl uppercase vertical-text border border-black mx-1">
          Weaknesses
        </div>
        <div className="flex flex-col bg-[#D9D9D9] border-y border-l border-black">
          {[0, 1, 2].map(i => (
            <div key={i} className="h-14 border-b border-black last:border-b-0 p-2 flex items-center justify-center text-center">
              <textarea
                value={data.weaknesses[i]}
                onChange={(e) => updateList('weaknesses', i, e.target.value)}
                className="w-full h-full text-[12px] font-bold bg-transparent outline-hidden resize-none text-center flex items-center justify-center"
                placeholder="..."
              />
            </div>
          ))}
        </div>
        <div className="grid grid-cols-3 border border-black mx-1">
          {[0, 1, 2].map(r => [0, 1, 2].map(c => <MatrixCell key={`w-o-${r}-${c}`} rowType="weaknesses" colType="opportunities" rIdx={r} cIdx={c} />))}
        </div>
        <div /> {/* Gap col */}
        <div className="grid grid-cols-3 border border-black mx-1">
          {[0, 1, 2].map(r => [0, 1, 2].map(c => <MatrixCell key={`w-t-${r}-${c}`} rowType="weaknesses" colType="threats" rIdx={r} cIdx={c} />))}
        </div>
        <div className="flex flex-col bg-[#FCE4D6] border border-black ml-1">
          {[0, 1, 2].map(i => {
            const total = getRowTotal('weaknesses', i);
            return (
              <div key={i} className={cn("h-14 flex items-center justify-center font-bold text-xl border-b border-black last:border-0", getTextColor(total), total > 0 ? "bg-[#C6E0B4]" : (total < 0 ? "bg-[#F4B084]" : "bg-[#FFF2CC]"))}>
                {total}
              </div>
            );
          })}
        </div>

        {/* ROW 6: Totals for O and T */}
        <div className="col-span-2 pt-4 flex items-center justify-center font-bold text-[#595959] uppercase tracking-widest text-lg">
          Total
        </div>
        <div className="grid grid-cols-3 mt-4 mx-1 border border-black bg-[#C6E0B4]/40">
          {[0, 1, 2].map(i => {
            const total = getColTotal('opportunities', i);
            return (
              <div key={i} className={cn("h-14 flex items-center justify-center font-bold text-xl border-r border-black last:border-r-0", getTextColor(total), total > 0 ? "bg-[#C6E0B4]" : (total < 0 ? "bg-[#F4B084]" : "bg-[#FFF2CC]"))}>
                {total}
              </div>
            );
          })}
        </div>
        <div /> {/* Gap col */}
        <div className="grid grid-cols-3 mt-4 mx-1 border border-black bg-[#FCE4D6]/40">
          {[0, 1, 2].map(i => {
            const total = getColTotal('threats', i);
            return (
              <div key={i} className={cn("h-14 flex items-center justify-center font-bold text-xl border-r border-black last:border-r-0", getTextColor(total), total > 0 ? "bg-[#C6E0B4]" : (total < 0 ? "bg-[#F4B084]" : "bg-[#FFF2CC]"))}>
                {total}
              </div>
            );
          })}
        </div>
        <div />
      </div>

      {/* Legend & Explanation */}
      <div className="mt-12 flex gap-12 items-start">
        <div className="flex flex-col w-64 border border-black text-xs font-bold shadow-sm">
          <div className="grid grid-cols-[1fr_60px] border-b border-black bg-[#F4B084]">
            <span className="p-2 px-4 text-red-900 text-shadow-sm italic">Negative / Very Negative</span>
            <span className="p-2 text-center border-l border-black">-1 / -2</span>
          </div>
          <div className="grid grid-cols-[1fr_60px] border-b border-black bg-[#FFF2CC]">
            <span className="p-2 px-4 text-yellow-800">Neutral</span>
            <span className="p-2 text-center border-l border-black">0</span>
          </div>
          <div className="grid grid-cols-[1fr_60px] bg-[#C6E0B4]">
            <span className="p-2 px-4 text-green-900 italic">Positive / Very Positive</span>
            <span className="p-2 text-center border-l border-black">+1 / +2</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const VRIOAnalysisTable = ({ 
  data, 
  setData, 
  notes, 
  setNotes 
}: { 
  data: VRIOAnalysisData[]; 
  setData: (d: VRIOAnalysisData[]) => void;
  notes: string;
  setNotes: (n: string) => void;
}) => {
  const updateItem = (id: string, field: keyof VRIOAnalysisData, value: string) => {
    setData(data.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  return (
    <div className="space-y-4">
      <h3 className="text-2xl font-bold uppercase tracking-tight text-gray-900 border-b-4 border-gray-100 inline-block">
        VRIO Analysis
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border-2 border-black table-fixed">
          <thead>
            <tr className="bg-white">
              <th className="border border-black p-4 text-center font-bold text-sm bg-gray-50/50">Resources</th>
              <th className="border border-black p-4 text-center font-bold text-sm bg-gray-50/50">Type</th>
              <th className="border border-black p-4 text-center font-bold text-sm bg-gray-50/50 w-1/4">Detail</th>
              <th className="border border-black p-2 text-center font-bold text-sm bg-gray-50/50 w-20">
                <div className="text-base">V</div>
                <div className="text-[8px] font-normal leading-tight lowercase">is it valuable?</div>
              </th>
              <th className="border border-black p-2 text-center font-bold text-sm bg-gray-50/50 w-20">
                <div className="text-base">R</div>
                <div className="text-[8px] font-normal leading-tight lowercase">is it rare?</div>
              </th>
              <th className="border border-black p-2 text-center font-bold text-sm bg-gray-50/50 w-20">
                <div className="text-base">I</div>
                <div className="text-[8px] font-normal leading-tight lowercase">is it hard to imitate?</div>
              </th>
              <th className="border border-black p-2 text-center font-bold text-sm bg-gray-50/50 w-28">
                <div className="text-base">O</div>
                <div className="text-[8px] font-normal leading-tight">How organized is the company around this?</div>
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.id} className="h-12">
                <td className="border border-black p-0">
                  <input
                    type="text"
                    value={item.resource}
                    onChange={(e) => updateItem(item.id, 'resource', e.target.value)}
                    className="w-full h-full px-4 text-sm bg-transparent outline-hidden focus:bg-blue-50/30 transition-colors"
                  />
                </td>
                <td className="border border-black p-0">
                  <input
                    type="text"
                    value={item.type}
                    onChange={(e) => updateItem(item.id, 'type', e.target.value)}
                    className="w-full h-full px-4 text-sm bg-transparent outline-hidden focus:bg-blue-50/30 transition-colors"
                  />
                </td>
                <td className="border border-black p-0">
                  <input
                    type="text"
                    value={item.detail}
                    onChange={(e) => updateItem(item.id, 'detail', e.target.value)}
                    className="w-full h-full px-4 text-sm bg-transparent outline-hidden focus:bg-blue-50/30 transition-colors"
                  />
                </td>
                <td className="border border-black p-0">
                  <input
                    type="text"
                    value={item.v}
                    onChange={(e) => updateItem(item.id, 'v', e.target.value)}
                    className="w-full h-full text-center text-sm bg-transparent outline-hidden focus:bg-blue-50/30 transition-colors"
                  />
                </td>
                <td className="border border-black p-0">
                  <input
                    type="text"
                    value={item.r}
                    onChange={(e) => updateItem(item.id, 'r', e.target.value)}
                    className="w-full h-full text-center text-sm bg-transparent outline-hidden focus:bg-blue-50/30 transition-colors"
                  />
                </td>
                <td className="border border-black p-0">
                  <input
                    type="text"
                    value={item.i}
                    onChange={(e) => updateItem(item.id, 'i', e.target.value)}
                    className="w-full h-full text-center text-sm bg-transparent outline-hidden focus:bg-blue-50/30 transition-colors"
                  />
                </td>
                <td className="border border-black p-0">
                  <input
                    type="text"
                    value={item.o}
                    onChange={(e) => updateItem(item.id, 'o', e.target.value)}
                    className="w-full h-full text-center text-sm bg-transparent outline-hidden focus:bg-blue-50/30 transition-colors"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="border border-black rounded-sm overflow-hidden">
        <div className="bg-gray-50 border-b border-black px-4 py-2 text-sm font-bold">Notes</div>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full min-h-[120px] p-4 text-sm bg-white outline-hidden resize-none translate-z-0"
          placeholder="Enter additional analysis notes here..."
        />
      </div>
    </div>
  );
};
const VRIOFramework = () => {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-[1fr_1fr_1fr_1fr_1.25fr] gap-0">
        <div className="border border-gray-200 p-4 pb-6 flex flex-col items-center h-44 bg-white text-center">
          <div className="flex-1 flex items-center justify-center">
            <img 
              src="https://img.icons8.com/ios/100/money-bag.png" 
              alt="Valuable" 
              className="w-16 h-16 opacity-50 grayscale"
              crossOrigin="anonymous"
              referrerPolicy="no-referrer"
            />
          </div>
          <span className="text-[11px] font-bold uppercase tracking-tight text-gray-800 leading-tight">IS IT VALUABLE?</span>
        </div>
        <div className="border border-gray-200 p-4 pb-6 flex flex-col items-center h-44 bg-white text-center border-l-0">
          <div className="flex-1 flex items-center justify-center">
            <img 
              src="https://img.icons8.com/ios/100/diamond--v1.png" 
              alt="Rare" 
              className="w-16 h-16 opacity-50 grayscale"
              crossOrigin="anonymous"
              referrerPolicy="no-referrer"
            />
          </div>
          <span className="text-[11px] font-bold uppercase tracking-tight text-gray-800 leading-tight">IS IT RARE?</span>
        </div>
        <div className="border border-gray-200 p-4 pb-6 flex flex-col items-center h-44 bg-white text-center border-l-0">
          <div className="flex-1 flex items-center justify-center">
            <img 
              src="https://img.icons8.com/ios/100/copy.png" 
              alt="Imitation" 
              className="w-16 h-16 opacity-50 grayscale"
              crossOrigin="anonymous"
              referrerPolicy="no-referrer"
            />
          </div>
          <span className="text-[11px] font-bold uppercase tracking-tight text-gray-800 leading-tight">IT IT DIFFICULT TO IMITATE?</span>
        </div>
        <div className="border border-gray-200 p-4 pb-6 flex flex-col items-center h-44 bg-white text-center border-l-0">
          <div className="flex-1 flex items-center justify-center">
            <img 
              src="https://img.icons8.com/ios/100/settings.png" 
              alt="Organized" 
              className="w-16 h-16 opacity-50 grayscale"
              crossOrigin="anonymous"
              referrerPolicy="no-referrer"
            />
          </div>
          <span className="text-[11px] font-bold uppercase tracking-tight text-center leading-[1.1] text-gray-800 px-2">HOW ORGANIZED IS THE COMPANY AROUND THIS</span>
        </div>
        <div className="border border-gray-200 p-4 pb-6 flex flex-col items-center h-44 bg-white text-center border-l-0">
          <div className="flex-1 flex items-center justify-center">
            <img 
              src="https://img.icons8.com/ios/100/goal--v1.png" 
              alt="Result" 
              className="w-16 h-16 opacity-50 grayscale"
              crossOrigin="anonymous"
              referrerPolicy="no-referrer"
            />
          </div>
          <span className="text-[11px] font-bold uppercase tracking-tight text-gray-800 leading-tight px-4">WHAT IS THE OVERALL RESULT?</span>
        </div>
      </div>

      {/* Decision Table */}
      <div className="space-y-4 pt-1">
        {/* Row 1 */}
        <div className="grid grid-cols-[1fr_1fr_1fr_1fr_1.25fr] border border-gray-200 h-18 bg-gray-50/30 overflow-hidden">
          <div className="flex items-center justify-center gap-4 bg-white/80">
            <div className="w-10 h-10 rounded-full border-2 border-red-400 flex items-center justify-center text-red-500 font-bold bg-white text-2xl">×</div>
            <span className="text-gray-500 font-bold text-lg">No</span>
          </div>
          <div className="bg-white/80" />
          <div className="bg-white/80" />
          <div className="bg-white/80" />
          <div className="bg-[#FF9B9B] flex items-center justify-center text-center font-bold text-sm px-6 leading-tight border-l border-gray-200">
            Competitive Disadvantage
          </div>
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-[1fr_1fr_1fr_1fr_1.25fr] border border-gray-200 h-18 bg-gray-50/30 overflow-hidden">
          <div className="flex items-center justify-center gap-4 bg-white/80 border-r border-gray-100/50">
            <div className="w-10 h-10 rounded-full border-2 border-green-500 flex items-center justify-center text-green-500 font-bold bg-white text-2xl">✓</div>
            <span className="text-gray-500 font-bold text-lg">Yes</span>
          </div>
          <div className="flex items-center justify-center gap-4 bg-white/80">
            <div className="w-10 h-10 rounded-full border-2 border-red-400 flex items-center justify-center text-red-500 font-bold bg-white text-2xl">×</div>
            <span className="text-gray-500 font-bold text-lg">No</span>
          </div>
          <div className="bg-white/80" />
          <div className="bg-white/80" />
          <div className="bg-[#EB9F7D] flex items-center justify-center text-center font-bold text-sm px-6 leading-tight border-l border-gray-200">
            Competitive Parity
          </div>
        </div>

        {/* Row 3 */}
        <div className="grid grid-cols-[1fr_1fr_1fr_1fr_1.25fr] border border-gray-200 h-18 bg-gray-50/30 overflow-hidden">
          <div className="flex items-center justify-center gap-4 bg-white/80 border-r border-gray-100/50">
            <div className="w-10 h-10 rounded-full border-2 border-green-500 flex items-center justify-center text-green-500 font-bold bg-white text-2xl">✓</div>
            <span className="text-gray-500 font-bold text-lg">Yes</span>
          </div>
          <div className="flex items-center justify-center gap-4 bg-white/80 border-r border-gray-100/50">
            <div className="w-10 h-10 rounded-full border-2 border-green-500 flex items-center justify-center text-green-500 font-bold bg-white text-2xl">✓</div>
            <span className="text-gray-500 font-bold text-lg">Yes</span>
          </div>
          <div className="flex items-center justify-center gap-4 bg-white/80">
            <div className="w-10 h-10 rounded-full border-2 border-red-400 flex items-center justify-center text-red-500 font-bold bg-white text-2xl">×</div>
            <span className="text-gray-500 font-bold text-lg">No</span>
          </div>
          <div className="bg-white/80" />
          <div className="bg-[#FFD666] flex items-center justify-center text-center font-bold text-sm px-6 leading-tight border-l border-gray-200">
            Temporary Competitive Advantage
          </div>
        </div>

        {/* Row 4 */}
        <div className="grid grid-cols-[1fr_1fr_1fr_1fr_1.25fr] border border-gray-200 h-18 bg-gray-50/30 overflow-hidden">
          <div className="flex items-center justify-center gap-4 bg-white/80 border-r border-gray-100/50">
            <div className="w-10 h-10 rounded-full border-2 border-green-500 flex items-center justify-center text-green-500 font-bold bg-white text-2xl">✓</div>
            <span className="text-gray-500 font-bold text-lg">Yes</span>
          </div>
          <div className="flex items-center justify-center gap-4 bg-white/80 border-r border-gray-100/50">
            <div className="w-10 h-10 rounded-full border-2 border-green-500 flex items-center justify-center text-green-500 font-bold bg-white text-2xl">✓</div>
            <span className="text-gray-500 font-bold text-lg">Yes</span>
          </div>
          <div className="flex items-center justify-center gap-4 bg-white/80 border-r border-gray-100/50">
            <div className="w-10 h-10 rounded-full border-2 border-green-500 flex items-center justify-center text-green-500 font-bold bg-white text-2xl">✓</div>
            <span className="text-gray-500 font-bold text-lg">Yes</span>
          </div>
          <div className="flex items-center justify-center gap-4 bg-white/80 focus:bg-white transition-colors">
            <div className="w-10 h-10 rounded-full border-2 border-red-400 flex items-center justify-center text-red-500 font-bold bg-white text-2xl">×</div>
            <span className="text-gray-500 font-bold text-lg">No</span>
          </div>
          <div className="bg-[#ADCCD1] flex items-center justify-center text-center font-bold text-sm px-6 leading-tight border-l border-gray-200">
            Unused Competitive Advantage
          </div>
        </div>

        {/* Row 5 */}
        <div className="grid grid-cols-[1fr_1fr_1fr_1fr_1.25fr] border border-gray-200 h-18 bg-gray-50/30 overflow-hidden">
          <div className="flex items-center justify-center gap-4 bg-white/80 border-r border-gray-100/50">
            <div className="w-10 h-10 rounded-full border-2 border-green-500 flex items-center justify-center text-green-500 font-bold bg-white text-2xl">✓</div>
            <span className="text-gray-500 font-bold text-lg">Yes</span>
          </div>
          <div className="flex items-center justify-center gap-4 bg-white/80 border-r border-gray-100/50">
            <div className="w-10 h-10 rounded-full border-2 border-green-500 flex items-center justify-center text-green-500 font-bold bg-white text-2xl">✓</div>
            <span className="text-gray-500 font-bold text-lg">Yes</span>
          </div>
          <div className="flex items-center justify-center gap-4 bg-white/80 border-r border-gray-100/50">
            <div className="w-10 h-10 rounded-full border-2 border-green-500 flex items-center justify-center text-green-500 font-bold bg-white text-2xl">✓</div>
            <span className="text-gray-500 font-bold text-lg">Yes</span>
          </div>
          <div className="flex items-center justify-center gap-4 bg-white/80 border-r border-gray-100/50">
            <div className="w-10 h-10 rounded-full border-2 border-green-500 flex items-center justify-center text-green-500 font-bold bg-white text-2xl">✓</div>
            <span className="text-gray-500 font-bold text-lg">Yes</span>
          </div>
          <div className="bg-[#8EB39F] flex items-center justify-center text-center font-bold text-sm px-6 leading-tight border-l border-gray-200">
            Sustainable Competitive Advantage
          </div>
        </div>
      </div>
    </div>
  );
};

const PortersFiveForces = ({ 
  data, 
  setData, 
  activeForce, 
  setActiveForce 
}: { 
  data: PortersFiveForcesData; 
  setData: (d: PortersFiveForcesData) => void;
  activeForce: keyof PortersFiveForcesData;
  setActiveForce: (f: keyof PortersFiveForcesData) => void;
}) => {
  const forceConfigs = {
    suppliers: {
      title: 'Bargaining Power of Suppliers',
      color: 'bg-amber-50',
      textColor: 'text-amber-700',
      borderColor: 'border-amber-200',
      info: 'This is a short scorecard to help you assess your business’ position in your marketplace. Read each of the following questions and respond with “Yes” or “No”. “Yes” indicates a favorable competitive environment for your business. “No” indicates a negative situation.',
      questions: [
        'Are there a large number of potential input suppliers? The greater number of suppliers of your needed inputs, the more control you will have.',
        'Are the products that you need to purchase for your business ordinary? You have more control when the products you need from a supplier are not unique.',
        'Do your purchases from suppliers represent a large portion of their business? If your purchases are a relatively large portion of your supplier’s business, you will have more power to lower costs or improve product features.',
        'Would it be difficult for your suppliers to enter your business, sell directly to your customers, and become your direct competitor? The easier it is to start a new business, the more likely it is that you will have competitors.',
        'Can you easily switch to substitute products from other suppliers? If it is relatively easy to switch to substitute products, you will have more negotiating room with your suppliers.',
        'Are you well informed about your supplier\'s product and market? If the market is complicated or hard to understand, you have less bargaining power with your suppliers.'
      ],
      tableHeaders: [
        'List the major inputs needed for your business.',
        'For each input, list possible suppliers.',
        'How can you best work with this supplier to maximize your bargaining power?'
      ]
    },
    buyers: {
      title: 'Bargaining Power of Buyers',
      color: 'bg-green-50',
      textColor: 'text-green-700',
      borderColor: 'border-green-200',
      info: 'This is a short scorecard to help you assess your business’ position in your marketplace. Read each of the following questions and respond with “Yes” or “No”. “Yes” indicates a favorable competitive environment for your business. “No” indicates a negative situation.',
      questions: [
        'Do you have enough customers such that losing one isn’t critical to your success? The smaller the number of customers, the more dependent you are on each one of them.',
        'Does your product represent a small expense for your customers? If your product is a relatively large expense for your customers, they’ll expend more effort negotiating with you to lower price or improve product features.',
        'Are customers uninformed about your product and market? If your market is complicated or hard to understand, buyers have less control.',
        'Is your product unique? If your product is homogenous or the same as your competitors’, buyers have more bargaining power.',
        'Would it be difficult for buyers to integrate backward in the supply chain, purchase a competitor providing the products you provide, and compete directly with you? The less likely a customer will enter your industry, the more bargaining power you have.',
        'Is it difficult for customers to switch from your product to your competitors’ products? If it is relatively easy for your customers to switch, you will have less negotiating power with your customers.'
      ],
      tableHeaders: [
        'List the types of customers that you have or expect to have.',
        'What alternatives might these customers have for your product?',
        'How can you build loyalty for your product or service to reduce customer bargaining power?'
      ]
    },
    newEntrants: {
      title: 'Threat of New Entrants',
      color: 'bg-blue-50',
      textColor: 'text-blue-700',
      borderColor: 'border-blue-200',
      info: 'This is a short scorecard to help you assess your business’ position in your marketplace. Read each of the following questions and respond with “Yes” or “No”. “Yes” indicates a favorable competitive environment for your business. “No” indicates a negative situation.',
      questions: [
        'Do you have a unique process that has been protected? For example, if you are a technology-based company with patent protection for your research investments, you enjoy some barriers to entry.',
        'Are customers loyal to your brand? If your customers are loyal to your brand, a new product, even if identical, would face a formidable battle to win over loyal customers.',
        'Are there high start-up costs for your business? The greater the capital requirements, the lower the threat of new competition.',
        'Are the assets needed to run your business unique? Others will be more reluctant to enter the market if the technology or equipment cannot be converted into other uses if the venture fails.',
        'Is there a process or procedure critical to your business? The more difficult it is to learn the business, the greater the entry barrier.',
        'Will a new competitor have difficulty acquiring/obtaining needed inputs? Current distribution channels may make it difficult for a new business to acquire/obtain inputs as readily as existing businesses.',
        'Will a new competitor have any difficulty acquiring/obtaining customers? If current distribution channels make it difficult for a new business to acquire/obtain new customers, you will enjoy a barrier to entry.',
        'Would it be difficult for a new entrant to have enough resources to compete efficiently? For every product, there is a cost-efficient level of production. If challengers can’t achieve that level of production, they won’t be competitive and therefore won’t enter the industry.'
      ],
      tableHeaders: [
        'Questions to Consider',
        'Strategic Response'
      ],
      customRows: [
        'How would a new entrant affect your business?',
        'What will your competitors do if there is a new entrant into your marketplace?',
        'How will you respond to a new competitor?'
      ]
    },
    substitutes: {
      title: 'Threat of Substitutes',
      color: 'bg-purple-50',
      textColor: 'text-purple-700',
      borderColor: 'border-purple-200',
      info: 'This is a short scorecard to help you assess your business’ position in your marketplace. Read each of the following questions and respond with “Yes” or “No”. “Yes” indicates a favorable competitive environment for your business. “No” indicates a negative situation.',
      questions: [
        'Does your product compare favorably to possible substitutes? If another product offers more features or benefits to customers, or if their price is lower, customers may decide that the other product is a better value.',
        'Is it costly for your customers to switch to another product? When customers experience a loss of productivity if they switch to another product, the threat of substitutes is weaker.',
        'Are customers loyal to existing products? Even if switching costs are low, customers may have allegiance to a particular brand. If your customers have high brand loyalty to your product you enjoy a weak threat of substitutes.'
      ],
      tableHeaders: [
        'List possible substitutes that your customers could use in place of your product.',
        'How easy would it be for your customer to consider this alternative?',
        'How can you differentiate your products or build customer loyalty to manage the threat of substitutes?'
      ]
    },
    rivalry: {
      title: 'Rivalry Among Competitors',
      color: 'bg-red-50',
      textColor: 'text-red-700',
      borderColor: 'border-red-200',
      info: 'This is a short scorecard to help you assess your business’ position in your marketplace. Read each of the following questions and respond with “Yes” or “No”. “Yes” indicates a favorable competitive environment for your business. “No” indicates a negative situation.',
      questions: [
        'Is there a small number of competitors? Often the greater the number of players, the more intense the rivalry. However, rivalry can occasionally be intense when one or more firms are vying for market leader positions.',
        'Is there a clear leader in your market? Rivalry intensifies if companies have similar shares of the market, leading to a struggle for market leadership.',
        'Is your market growing? In a growing market, firms are able to grow revenues simply because of the expanding market. In a stagnant or declining market, companies often fight intensely for a smaller and smaller market.',
        'Do you have low fixed costs? With high fixed costs, companies must sell more products to cover these high costs.',
        'Can you store your product to sell at the best times? High storage costs or perishable products result in a situation where firms must sell product as soon as possible, increasing rivalry among firms.',
        'Are your competitors pursuing a low growth strategy? You will have more intense rivalries if your competitors are more aggressive. In contrast, if your competitors are following a strategy of milking profits in a mature market, you will enjoy less rivalry.',
        'Is your product unique? Firms that produce products that are very similar will compete mostly on price, so rivalry is expected to be high.',
        'Is it easy for competitors to abandon their product? If exit costs are high, a company may remain in business even if it is not profitable.',
        'Is it difficult for customers to switch between your product and your competitors’? If customers can easily switch, the market will be more competitive and rivalry is expected to be high as firms vie for each customer’s business.'
      ],
      tableHeaders: [
        'List your major competitors.',
        'What business and growth strategies does this competitor use?',
        'How will this competitor affect your business?',
        'What actions will you take in response to your competitors’ actions?'
      ]
    }
  };

  const currentConfig = forceConfigs[activeForce];
  const currentData = data[activeForce];

  const updateScorecard = (index: number, val: boolean) => {
    setData({
      ...data,
      [activeForce]: {
        ...currentData,
        scorecard: { ...currentData.scorecard, [index]: val }
      }
    });
  };

  const updateFurther = (rowIndex: number, colKey: string, val: string) => {
    const newFurther = [...currentData.further];
    newFurther[rowIndex] = { ...newFurther[rowIndex], [colKey]: val };
    setData({
      ...data,
      [activeForce]: { ...currentData, further: newFurther }
    });
  };

  const updateAnalysis = (field: 'analysis' | 'impact', val: string) => {
    setData({
      ...data,
      [activeForce]: { ...currentData, [field]: val }
    });
  };

  return (
    <div className="space-y-8">
      {/* Sub-navigation */}
      <div className="flex flex-wrap gap-2 p-1 bg-gray-100 rounded-2xl no-print">
        {Object.entries(forceConfigs).map(([key, config]) => (
          <button
            key={key}
            onClick={() => setActiveForce(key as any)}
            className={cn(
              "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
              activeForce === key 
                ? "bg-white text-gray-900 shadow-sm ring-1 ring-black/5" 
                : "text-gray-400 hover:text-gray-600"
            )}
          >
            {config.title.split('of ').pop()?.split('Among ').pop() || config.title}
          </button>
        ))}
      </div>

      <div className={cn("p-12 rounded-[40px] border shadow-2xl space-y-12 transition-all", currentConfig.color, currentConfig.borderColor)}>
        {/* Header */}
        <div className="flex flex-col gap-2">
          <h2 className={cn("text-3xl font-black uppercase italic tracking-tighter", currentConfig.textColor)}>
            {currentConfig.title}
          </h2>
          <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em]">
            Strategic Assessment Worksheet
          </p>
        </div>

        {/* Self Assessment Scorecard */}
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <h3 className="text-lg font-black uppercase italic text-gray-900">Self Assessment Scorecard</h3>
            <div className="h-px flex-1 bg-gray-100" />
          </div>
          <p className="text-xs text-gray-500 leading-relaxed italic border-l-4 border-gray-200 pl-4">
            {(currentConfig as any).info}
          </p>
          <div className="space-y-2">
            {currentConfig.questions.map((q, idx) => (
              <div key={idx} className="flex items-center gap-6 p-3 bg-white/40 rounded-xl border border-white/60 hover:bg-white/80 transition-all group">
                <div className="flex gap-2">
                  <button
                    onClick={() => updateScorecard(idx, true)}
                    className={cn(
                      "px-4 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all border-2",
                      currentData.scorecard[idx] === true 
                        ? "bg-green-600 border-green-600 text-white shadow-sm" 
                        : "bg-white border-gray-300 text-gray-400 hover:border-green-500 hover:text-green-600"
                    )}
                  >
                    Yes
                  </button>
                  <button
                    onClick={() => updateScorecard(idx, false)}
                    className={cn(
                      "px-4 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all border-2",
                      currentData.scorecard[idx] === false 
                        ? "bg-red-600 border-red-600 text-white shadow-sm" 
                        : "bg-white border-gray-300 text-gray-400 hover:border-red-500 hover:text-red-600"
                    )}
                  >
                    No
                  </button>
                </div>
                <p className="text-xs font-semibold text-gray-700 leading-tight">
                  <span className="text-gray-300 mr-2">{idx + 1}.</span>
                  {q}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Further Assessment Table */}
        <div className="space-y-6">
          <div className="flex items-center gap-4">
            <h3 className="text-lg font-black uppercase italic text-gray-900">Further Assessment</h3>
            <div className="h-px flex-1 bg-gray-100" />
          </div>
          <div className="overflow-hidden rounded-xl border-2 border-black bg-white shadow-lg">
            <table className="w-full border-collapse">
              <thead className="bg-gray-100 border-b-2 border-black">
                <tr>
                  {currentConfig.tableHeaders.map((h, i) => (
                    <th key={i} className="p-4 text-[10px] font-black uppercase tracking-[0.1em] text-gray-900 border-r-2 border-black last:border-0 text-center leading-tight">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y-2 divide-black">
                {activeForce === 'newEntrants' && 'customRows' in currentConfig ? (
                  (currentConfig as any).customRows.map((q: string, idx: number) => (
                    <tr key={idx} className="group">
                      <td className="p-6 text-[11px] font-black text-gray-900 w-1/3 bg-gray-50 border-r-2 border-black uppercase tracking-tight leading-tight italic">
                        {q}
                      </td>
                      <td className="p-0">
                        <textarea
                          value={currentData.further[idx]?.col2 || ''}
                          onChange={(e) => updateFurther(idx, 'col2', e.target.value)}
                          className="w-full h-32 p-6 text-sm font-medium bg-transparent outline-none resize-none border-none focus:bg-indigo-50/20 transition-all leading-relaxed"
                          placeholder="Analysis and strategic response..."
                        />
                      </td>
                    </tr>
                  ))
                ) : (
                  currentData.further.map((row, idx) => (
                    <tr key={idx} className="group h-32">
                      {['col1', 'col2', 'col3', 'col4'].slice(0, currentConfig.tableHeaders.length).map((col, cIdx) => (
                        <td key={col} className="p-0 border-r-2 border-black last:border-0 relative">
                          <textarea
                            value={(row as any)[col] || ''}
                            onChange={(e) => updateFurther(idx, col, e.target.value)}
                            className="w-full h-full p-6 pt-8 text-xs font-semibold bg-transparent outline-none resize-none border-none focus:bg-indigo-50/20 transition-all leading-relaxed"
                            placeholder={cIdx === 0 ? "Identify..." : "Analysis..."}
                          />
                          {cIdx === 0 && <span className="absolute top-2 left-3 text-[10px] font-black text-gray-200 uppercase group-hover:text-gray-400 transition-colors">#{idx + 1}</span>}
                        </td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>


      </div>
    </div>
  );
};


