import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Users, Clock, Eye, X } from 'lucide-react';
import { AppContent } from '../App';

export default function AdminDashboard({ onExit }: { onExit: () => void }) {
  const [groups, setGroups] = useState<any[]>([]);
  const [viewingGroup, setViewingGroup] = useState<string | null>(null);

  useEffect(() => {
    const fetchGroups = async () => {
      const { data } = await supabase.from('worksheets').select('id, updated_at').order('updated_at', { ascending: false });
      setGroups(data || []);
    };
    fetchGroups();

    const channel = supabase.channel('admin-list-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'worksheets' }, fetchGroups)
      .subscribe();
    return () => { channel.unsubscribe(); };
  }, []);

  return viewingGroup ? (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 p-4 sticky top-0 z-10 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">Monitoring: <span className="text-blue-600">{viewingGroup}</span> (Read-Only)</h2>
          <button onClick={() => setViewingGroup(null)} className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors">
            <X size={16} /> Back to List
          </button>
      </div>
      <AppContent 
        selectedGroup={viewingGroup} 
        fullName="Admin"
        onExit={() => setViewingGroup(null)}
        readOnly={true}
      />
    </div>
  ) : (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-black text-gray-900 tracking-tight">Admin Console</h1>
          <button onClick={onExit} className="px-6 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-all font-bold text-sm">Exit</button>
        </div>

        <div className="space-y-3">
          {groups.length === 0 && <p className="text-center py-12 text-gray-500">No active groups found.</p>}
          {groups.map((group) => (
            <div key={group.id} className="flex items-center justify-between p-5 bg-white rounded-2xl shadow-sm border border-gray-200 hover:border-blue-300 transition-all group">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                  <Users size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-gray-900">{group.id}</h3>
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <Clock size={12} />
                    <span>Last updated: {new Date(group.updated_at).toLocaleTimeString()}</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setViewingGroup(group.id)}
                className="flex items-center gap-2 px-5 py-2.5 bg-gray-900 text-white rounded-xl font-bold text-sm hover:bg-blue-600 transition-all"
              >
                <Eye size={16} /> Monitor Live
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
