import React, { useEffect, useState } from 'react';
import { supabase } from '../services/supabase';
import { useNavigate } from 'react-router-dom';
import { Users, ChevronRight, LayoutGrid, Plus, X } from 'lucide-react';
import CreateGroup from '../components/CreateGroup';

const Home = () => {
  const [groups, setGroups] = useState([]);
  const [showCreate, setShowCreate] = useState(false); // Toggle state
  const navigate = useNavigate();

  useEffect(() => {
    const fetchGroups = async () => {
      const { data, error } = await supabase
        .from('groups')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) console.error("Error loading groups:", error);
      else setGroups(data || []);
    };

    fetchGroups();
  }, []);

  const handleGroupCreated = (newGroup) => {
    // Update local list so the new group appears instantly
    setGroups([newGroup, ...groups]);
    setShowCreate(false); // Hide the form after success
  };

  return (
    <div className="max-w-5xl mx-auto pt-24 px-6 relative z-10">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-4xl font-bold text-white tracking-tight">Your Squads</h1>
          <p className="text-slate-400 mt-2">Pick a group to manage shared costs</p>
        </div>
        
        {/* Toggle Button */}
        <button 
          onClick={() => setShowCreate(!showCreate)}
          className={`₹{
            showCreate ? 'bg-slate-800 text-slate-400' : 'bg-blue-600 text-white'
          } hover:scale-105 px-5 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2`}
        >
          {showCreate ? <><X size={18} /> Cancel</> : <><Plus size={18} /> New Group</>}
        </button>
      </div>

      {/* --- CONDITIONAL VIEW: CREATE FORM --- */}
      {showCreate ? (
        <div className="mb-20">
          <CreateGroup onGroupCreated={handleGroupCreated} />
        </div>
      ) : (
        /* --- THE GROUPS GRID --- */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {groups.map((group) => (
            <div
              key={group.id}
              onClick={() => navigate(`/group/₹{group.id}`)}
              className="group relative p-6 bg-slate-900/40 border border-slate-800 hover:border-blue-500/50 rounded-3xl cursor-pointer transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-400 group-hover:scale-110 transition-transform">
                  <Users size={24} />
                </div>
                <ChevronRight className="text-slate-600 group-hover:text-blue-400 transition-colors" />
              </div>
              
              <h3 className="text-xl font-bold text-white mb-1">{group.name}</h3>
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-mono">
                ID: {group.id.slice(0, 8)}...
              </p>

              <div className="mt-6 pt-4 border-t border-slate-800 flex items-center gap-2 text-[10px] font-bold text-blue-400 uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity">
                <LayoutGrid size={12} />
                Open Dashboard
              </div>
            </div>
          ))}

          {/* Empty State */}
          {groups.length === 0 && (
            <div className="col-span-full py-20 text-center border-2 border-dashed border-slate-800 rounded-3xl">
              <p className="text-slate-500 italic text-sm">No groups found. Start by creating your first group!</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Home;