import React, { useEffect, useState } from 'react';
import { Lock, Download, Trash2, PieChart, Activity, Users, ShieldCheck, Database } from 'lucide-react';
import { cn } from '@/src/lib/utils';
import { PESTELWorksheet, McKinseyWorksheet, VRIOAnalysisTable } from './components/Worksheets';

export default function ProfessorDashboard() {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [code, setCode] = useState('');
  const [groups, setGroups] = useState<any[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'PESTEL' | 'McKinsey' | 'VRIO' | 'TOWS' | 'PORTER' | 'RAW'>('PESTEL');

  const handleAccess = (e: React.FormEvent) => {
    e.preventDefault();
    if (code === 'admin') setIsAuthorized(true);
    else { alert('Access Denied: Invalid Credentials.'); setCode(''); }
  };

  const loadGroupsFromLocalStorage = () => {
    const loadedGroups = [];
    for (let i = 1; i <= 11; i++) {
      const groupName = `Group ${i}`;
      const saved = localStorage.getItem(`sdp_group_${groupName}`);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          loadedGroups.push({
            group_id: groupName,
            content: parsed,
            created_at: parsed.updatedAt || new Date().toISOString()
          });
        } catch (err) {
          console.error(`Failed to parse group data for ${groupName}:`, err);
        }
      }
    }
    setGroups(loadedGroups);
    
    if (selectedGroup) {
      const updatedSelected = loadedGroups.find(g => g.group_id === selectedGroup.group_id);
      if (updatedSelected) {
        setSelectedGroup(updatedSelected);
      }
    }
  };

  const resetGroupData = (groupName: string) => {
    if (confirm(`Are you sure you want to PERMANENTLY delete all data for ${groupName}? This cannot be undone.`)) {
      localStorage.removeItem(`sdp_group_${groupName}`);
      localStorage.removeItem(`sdp_tab_${groupName}`);
      loadGroupsFromLocalStorage();
      if (selectedGroup?.group_id === groupName) setSelectedGroup(null);
    }
  };

  const exportAllData = () => {
    const allData: Record<string, any> = {};
    groups.forEach(g => {
      allData[g.group_id] = g.content;
    });
    const blob = new Blob([JSON.stringify(allData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SDP_Suite_Full_Export_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  };

  useEffect(() => {
    if (!isAuthorized) return;
    loadGroupsFromLocalStorage();
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key && e.key.startsWith('sdp_group_')) {
        loadGroupsFromLocalStorage();
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [isAuthorized, selectedGroup?.group_id]);

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-6 font-sans">
        <div className="w-full max-w-md bg-white p-12 rounded-[2.5rem] shadow-2xl text-center space-y-8 border-t-8 border-brand-blue">
            <div className="space-y-4">
                <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto shadow-inner">
                  <ShieldCheck size={40} className="text-brand-blue" />
                </div>
                <h2 className="text-3xl font-black text-slate-900 tracking-tighter">ADMIN<span className="text-brand-blue">PORTAL</span></h2>
                <p className="text-slate-500 text-sm font-medium">Enter administrative credentials to proceed</p>
            </div>
            <form onSubmit={handleAccess} className="space-y-4">
                <div className="relative">
                  <input 
                      type="password" 
                      value={code} 
                      onChange={(e) => setCode(e.target.value)} 
                      placeholder="••••••••" 
                      className="w-full px-6 py-5 bg-slate-50 border-2 border-slate-100 rounded-2xl text-center text-lg tracking-[0.5em] outline-none focus:border-brand-blue focus:bg-white transition-all font-bold" 
                  />
                </div>
                <button type="submit" className="w-full py-5 bg-slate-900 text-white rounded-2xl text-sm font-black uppercase tracking-widest hover:bg-brand-blue transition-all shadow-xl shadow-blue-500/10">
                    Authorize Access
                </button>
            </form>
            <p className="text-[10px] text-slate-400 font-mono tracking-widest">ENCRYPTED_SESSION_v2.1</p>
        </div>
      </div>
    );
  }

  const content = selectedGroup?.content;

  const calculateCompletion = (data: any) => {
    if (!data) return 0;
    let total = 0;
    let filled = 0;
    
    // PESTEL (6 categories)
    if (data.pestel) {
      total += 6;
      data.pestel.forEach((p: any) => if (p.description) filled++);
    }
    
    // McKinsey (7 elements)
    if (data.mckinsey) {
      total += 7;
      Object.keys(data.mckinsey).forEach(k => {
        if (Object.values(data.mckinsey[k]).some(v => !!v)) filled++;
      });
    }

    return total > 0 ? Math.round((filled / total) * 100) : 0;
  };

  return (
    <div className="min-h-screen bg-slate-50 flex h-screen overflow-hidden text-slate-900 font-sans">
      {/* Sidebar */}
      <div className="w-80 bg-white border-r border-slate-200 flex flex-col shadow-xl z-20">
        <div className="p-8 flex items-center gap-3 border-b border-slate-100 bg-slate-50/50">
            <div className="p-2 bg-white rounded-xl shadow-sm">
              <Database size={20} className="text-brand-blue" />
            </div>
            <span className="font-black text-xl tracking-tighter text-slate-900">ADMIN<span className="text-brand-blue">HUB</span></span>
        </div>
        
        <div className="p-6 border-b border-slate-100 space-y-4">
          <button 
            onClick={exportAllData}
            className="w-full flex items-center justify-center gap-2 py-3 bg-brand-blue text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
          >
            <Download size={14} /> Full Data Export
          </button>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <p className="text-[10px] font-bold text-slate-400 uppercase">Active</p>
              <p className="text-xl font-black text-slate-900">{groups.length}</p>
            </div>
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
              <p className="text-[10px] font-bold text-slate-400 uppercase">Groups</p>
              <p className="text-xl font-black text-slate-900">11</p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-1">
            <h2 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4 px-4 flex items-center gap-2">
              <Users size={12} /> Group Monitor
            </h2>
            {Array.from({ length: 11 }, (_, i) => `Group ${i + 1}`).map(groupName => {
                const groupData = groups.find(g => g.group_id === groupName);
                const isActive = selectedGroup?.group_id === groupName;
                const completion = calculateCompletion(groupData?.content);
                
                return (
                    <div key={groupName} className="group relative">
                      <button 
                          onClick={() => setSelectedGroup(groupData || { group_id: groupName })} 
                          className={cn(
                              "w-full p-4 rounded-2xl text-left transition-all flex flex-col gap-1 relative overflow-hidden",
                              isActive ? 'bg-slate-900 text-white shadow-xl translate-x-2' : 'hover:bg-slate-50 text-slate-600'
                          )}
                      >
                          <div className="flex items-center justify-between w-full">
                            <span className="text-sm font-bold">{groupName}</span>
                            <span className={cn("text-[10px] font-mono", isActive ? "text-slate-400" : "text-slate-400")}>
                                {groupData ? new Date(groupData.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Idle'}
                            </span>
                          </div>
                          {groupData && (
                            <div className="w-full h-1 bg-slate-200/20 rounded-full mt-1">
                              <div className="h-full bg-brand-blue rounded-full transition-all duration-500" style={{ width: `${completion}%` }} />
                            </div>
                          )}
                      </button>
                      {groupData && (
                        <button 
                          onClick={(e) => { e.stopPropagation(); resetGroupData(groupName); }}
                          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-red-400 opacity-0 group-hover:opacity-100 hover:text-red-600 transition-all z-10"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                );
            })}
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-12 bg-slate-50/50">
        {selectedGroup ? (
            <div className="space-y-8 max-w-6xl mx-auto">
                <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-200 flex justify-between items-center">
                    <div>
                      <p className="text-[10px] font-black text-brand-blue uppercase tracking-[0.2em] mb-1">Inspecting Workspace</p>
                      <h1 className="text-4xl font-black tracking-tighter text-slate-900">{selectedGroup.group_id}</h1>
                    </div>
                    <div className="flex gap-2 p-1.5 bg-slate-100 rounded-2xl">
                        { (['PESTEL', 'McKinsey', 'VRIO', 'TOWS', 'PORTER', 'RAW'] as const).map(tab => (
                            <button 
                              key={tab} 
                              onClick={() => setActiveTab(tab)} 
                              className={cn(
                                "px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all", 
                                activeTab === tab ? "bg-white text-slate-900 shadow-md scale-105" : "text-slate-400 hover:text-slate-600"
                              )}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>
                
                <div className="bg-white p-10 rounded-[2rem] shadow-sm border border-slate-200 min-h-[600px]">
                    {activeTab === 'PESTEL' && <PESTELWorksheet data={content?.pestel || []} setData={() => {}} />}
                    {activeTab === 'McKinsey' && <McKinseyWorksheet data={content?.mckinsey || {}} setData={() => {}} />}
                    {activeTab === 'VRIO' && <VRIOAnalysisTable data={content?.vrio || []} setData={() => {}} notes={content?.vrioNotes || ''} setNotes={() => {}} />}
                    {activeTab === 'RAW' && (
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 text-slate-400 mb-4">
                          <Activity size={16} />
                          <span className="text-xs font-bold uppercase tracking-widest">System JSON Dump</span>
                        </div>
                        <pre className="text-xs font-mono bg-slate-900 p-8 rounded-2xl border border-slate-800 overflow-x-auto text-blue-400 leading-relaxed shadow-2xl">
                          {JSON.stringify(content, null, 2)}
                        </pre>
                      </div>
                    )}
                    {activeTab !== 'PESTEL' && activeTab !== 'McKinsey' && activeTab !== 'VRIO' && activeTab !== 'RAW' && (
                        <div className="flex flex-col items-center justify-center h-96 text-slate-300 space-y-4">
                          <PieChart size={64} className="opacity-20" />
                          <p className="font-black uppercase tracking-widest text-[10px]">Framework View under construction</p>
                          <p className="text-[10px] max-w-xs text-center opacity-50">Use the RAW tab to inspect the JSON data for {activeTab} analysis.</p>
                        </div>
                    )}
                </div>
            </div>
        ) : (
            <div className="flex flex-col items-center justify-center h-full text-slate-300 space-y-6">
                <div className="w-24 h-24 bg-white rounded-[2rem] shadow-inner flex items-center justify-center border border-slate-100">
                  <Activity size={40} className="opacity-20 animate-pulse" />
                </div>
                <div className="text-center space-y-2">
                  <p className="font-black tracking-[0.3em] uppercase text-[10px]">System Ready</p>
                  <p className="text-xs text-slate-400">Select a group from the sidebar to begin monitoring</p>
                </div>
            </div>
        )}
      </div>
    </div>
  );
}
