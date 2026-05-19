import { useEffect, useState } from 'react';
import { createClient } from '@/src/utils/supabase/client';
import { Lock, ShieldCheck, UserCircle, ArrowRight } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { PESTELWorksheet, McKinseyWorksheet, VRIOAnalysisTable } from './components/Worksheets';

const supabase = createClient();

export default function ProfessorDashboard() {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [code, setCode] = useState('');
  const [groups, setGroups] = useState<any[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'PESTEL' | 'McKinsey' | 'VRIO' | 'TOWS' | 'PORTER'>('PESTEL');

  const handleAccess = (e: React.FormEvent) => {
    e.preventDefault();
    if (code === '1234') setIsAuthorized(true);
    else { alert('Access Denied: Invalid Credentials.'); setCode(''); }
  };

  useEffect(() => {
    if (!isAuthorized) return;
    const fetchGroups = async () => {
      const { data } = await supabase.from('groups').select('*');
      if (data) setGroups(data);
    };
    fetchGroups();
    const channel = supabase.channel('schema-db-changes').on('postgres_changes', { event: '*', schema: 'public', table: 'groups' }, () => fetchGroups()).subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [isAuthorized]);

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-white flex overflow-hidden font-sans">
        {/* Left Side - Visual */}
        <div className="hidden lg:flex flex-1 bg-slate-900 items-center justify-center p-12 relative">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px]"></div>
            <div className="text-white space-y-4 max-w-lg z-10">
                <h1 className="text-6xl font-extrabold tracking-tighter">Strategic<br/>Suite<span className="text-brand-blue">.</span></h1>
                <p className="text-slate-400 text-lg leading-relaxed">Advanced faculty monitoring interface. Secure, real-time, and built for high-performance academic management.</p>
            </div>
        </div>

        {/* Right Side - Form */}
        <div className="flex-1 flex items-center justify-center p-8">
            <div className="w-full max-w-md space-y-8">
                <div className="space-y-2">
                    <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">Faculty Access</h2>
                    <p className="text-slate-500 font-medium">Verify your credentials to initialize the dashboard.</p>
                </div>
                
                <form onSubmit={handleAccess} className="space-y-6">
                    <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={20} />
                        <input 
                            type="password" 
                            value={code} 
                            onChange={(e) => setCode(e.target.value)} 
                            placeholder="Enter security token" 
                            className="w-full pl-12 pr-4 py-5 bg-slate-50 border border-slate-100 rounded-2xl text-lg font-mono tracking-[0.2em] outline-none focus:border-brand-blue focus:bg-white transition-all shadow-sm" 
                        />
                    </div>
                    <button type="submit" className="w-full py-5 bg-slate-900 text-white rounded-2xl font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-3 shadow-lg shadow-slate-200">
                        Proceed to Dashboard <ArrowRight size={18}/>
                    </button>
                </form>

                <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-slate-300 pt-8">
                    <div className="h-px flex-1 bg-slate-100"></div>
                    Secured by SDP
                    <div className="h-px flex-1 bg-slate-100"></div>
                </div>
            </div>
        </div>
      </div>
    );
  }

  const content = selectedGroup?.content;

  return (
    <div className="min-h-screen bg-slate-50 flex h-screen overflow-hidden text-slate-900 font-sans">
      <div className="w-72 bg-slate-900 text-slate-200 flex flex-col">
        <div className="p-8 border-b border-slate-800 flex flex-col items-center gap-4 text-center">
            <img 
                src="https://i.ibb.co/FqgQzNPw/LOGO-BLEU.png" 
                alt="SDP Suite Logo" 
                className="w-20 h-20 object-contain"
            />
            <span className="font-bold text-lg tracking-tight text-white">SDP Suite Admin</span>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
            <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-4 px-2">Monitoring Status</h2>
            {Array.from({ length: 11 }, (_, i) => `Group ${i + 1}`).map(groupName => {
                const groupData = groups.find(g => g.group_id === groupName);
                const isActive = selectedGroup?.group_id === groupName;
                return (
                    <button 
                        key={groupName} 
                        onClick={() => setSelectedGroup(groupData || { group_id: groupName })} 
                        className={cn(
                            "w-full p-3 mb-1 rounded-lg text-left transition-all flex items-center justify-between border border-transparent",
                            isActive ? 'bg-brand-blue text-white shadow-lg' : 'hover:bg-slate-800 hover:border-slate-700'
                        )}
                    >
                        <span className="font-semibold text-sm">{groupName}</span>
                        <span className={cn("text-[9px] font-mono", isActive ? "text-white/70" : "text-slate-500")}>
                            {groupData ? new Date(groupData.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Offline'}
                        </span>
                    </button>
                );
            })}
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-10 bg-white">
        {selectedGroup ? (
            <div className="space-y-8 max-w-6xl mx-auto">
                <div className="flex justify-between items-end border-b border-slate-100 pb-6">
                    <div>
                        <p className="text-[10px] font-black uppercase text-brand-blue tracking-widest mb-1">Active Monitoring</p>
                        <h1 className="text-4xl font-extrabold text-slate-900">{selectedGroup.group_id}</h1>
                    </div>
                    <div className="flex gap-2 bg-slate-50 p-1 rounded-xl border border-slate-100">
                        { (['PESTEL', 'McKinsey', 'VRIO', 'TOWS', 'PORTER'] as const).map(tab => (
                            <button key={tab} onClick={() => setActiveTab(tab)} className={cn("px-4 py-2 rounded-lg text-[10px] font-black uppercase transition-all", activeTab === tab ? "bg-white text-brand-blue shadow-sm" : "text-slate-400 hover:text-slate-600")}>
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>
                
                <div className="bg-white border border-slate-100 rounded-2xl shadow-sm p-8">
                    {activeTab === 'PESTEL' && <PESTELWorksheet data={content?.pestel || []} setData={() => {}} />}
                    {activeTab === 'McKinsey' && <McKinseyWorksheet data={content?.mckinsey || {}} setData={() => {}} />}
                    {activeTab === 'VRIO' && <VRIOAnalysisTable data={content?.vrio || []} setData={() => {}} />}
                    {activeTab !== 'PESTEL' && activeTab !== 'McKinsey' && activeTab !== 'VRIO' && (
                        <pre className="text-xs font-mono bg-slate-50 p-6 rounded-xl border border-slate-100 overflow-x-auto text-slate-600">{JSON.stringify(content?.[activeTab.toLowerCase()], null, 2)}</pre>
                    )}
                </div>
            </div>
        ) : (
            <div className="flex items-center justify-center h-full text-slate-400 font-bold tracking-widest uppercase text-sm">Select a group from the sidebar to begin monitoring.</div>
        )}
      </div>
    </div>
  );
}
