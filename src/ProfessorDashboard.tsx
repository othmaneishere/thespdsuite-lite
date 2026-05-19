import React, { useEffect, useState } from 'react';
import { createClient } from '@/src/utils/supabase/client';
import { Lock } from 'lucide-react';
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
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
        <div className="w-full max-w-sm bg-white p-12 rounded-3xl shadow-sm border border-slate-100 text-center space-y-8">
            <div className="space-y-4">
                <img src="https://i.ibb.co/FqgQzNPw/LOGO-BLEU.png" alt="SDP Suite Logo" className="w-24 h-24 mx-auto" />
                <h2 className="text-3xl font-light text-slate-900 tracking-tighter">SDP<span className="font-bold text-brand-blue">Suite</span></h2>
                <p className="text-slate-500 text-sm">Faculty Administration Panel</p>
            </div>
            <form onSubmit={handleAccess} className="space-y-4">
                <input 
                    type="password" 
                    value={code} 
                    onChange={(e) => setCode(e.target.value)} 
                    placeholder="Enter security token" 
                    className="w-full px-6 py-4 border border-slate-200 rounded-xl text-center text-sm tracking-widest outline-none focus:border-brand-blue transition-all" 
                />
                <button type="submit" className="w-full py-4 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-all">
                    Initialize Admin Session
                </button>
            </form>
        </div>
      </div>
    );
  }

  const content = selectedGroup?.content;

  return (
    <div className="min-h-screen bg-white flex h-screen overflow-hidden text-slate-900 font-sans">
      <div className="w-80 border-r border-slate-100 flex flex-col">
        <div className="p-8 flex items-center gap-3 border-b border-slate-50">
            <img src="https://i.ibb.co/FqgQzNPw/LOGO-BLEU.png" alt="Logo" className="w-10 h-10" />
            <span className="font-bold text-lg tracking-tight text-slate-900">SDP<span className="text-brand-blue">Suite</span></span>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
            <h2 className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-4 px-4">Workspace Monitor</h2>
            {Array.from({ length: 11 }, (_, i) => `Group ${i + 1}`).map(groupName => {
                const groupData = groups.find(g => g.group_id === groupName);
                const isActive = selectedGroup?.group_id === groupName;
                return (
                    <button 
                        key={groupName} 
                        onClick={() => setSelectedGroup(groupData || { group_id: groupName })} 
                        className={cn(
                            "w-full p-4 mb-1 rounded-xl text-left transition-all flex items-center justify-between",
                            isActive ? 'bg-slate-50 text-brand-blue font-bold' : 'hover:bg-slate-50 text-slate-600'
                        )}
                    >
                        <span className="text-sm">{groupName}</span>
                        <span className="text-[10px] text-slate-400">
                            {groupData ? new Date(groupData.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Idle'}
                        </span>
                    </button>
                );
            })}
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-12 bg-white">
        {selectedGroup ? (
            <div className="space-y-10 max-w-5xl mx-auto">
                <div className="flex justify-between items-center border-b border-slate-50 pb-8">
                    <h1 className="text-4xl font-light tracking-tighter">{selectedGroup.group_id}</h1>
                    <div className="flex gap-2 p-1 bg-slate-50 rounded-full">
                        { (['PESTEL', 'McKinsey', 'VRIO', 'TOWS', 'PORTER'] as const).map(tab => (
                            <button key={tab} onClick={() => setActiveTab(tab)} className={cn("px-5 py-2 rounded-full text-[10px] font-bold uppercase transition-all", activeTab === tab ? "bg-white text-slate-900 shadow-sm" : "text-slate-400")}>
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>
                
                <div className="min-h-[500px]">
                    {activeTab === 'PESTEL' && <PESTELWorksheet data={content?.pestel || []} setData={() => {}} />}
                    {activeTab === 'McKinsey' && <McKinseyWorksheet data={content?.mckinsey || {}} setData={() => {}} />}
                    {activeTab === 'VRIO' && <VRIOAnalysisTable data={content?.vrio || []} setData={() => {}} />}
                    {activeTab !== 'PESTEL' && activeTab !== 'McKinsey' && activeTab !== 'VRIO' && (
                        <pre className="text-xs font-mono bg-slate-50 p-8 rounded-2xl border border-slate-100 overflow-x-auto text-slate-600">{JSON.stringify(content?.[activeTab.toLowerCase()], null, 2)}</pre>
                    )}
                </div>
            </div>
        ) : (
            <div className="flex items-center justify-center h-full text-slate-300 font-medium tracking-widest uppercase text-xs">Awaiting group selection.</div>
        )}
      </div>
    </div>
  );
}
