import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, ArrowRight, Loader2, Sparkles } from 'lucide-react';
import { supabase } from '../services/supabase';

const CreateGroup = ({ onGroupCreated }) => {
  const [groupName, setGroupName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!groupName.trim()) return;

    setLoading(true);
    try {
      // 1. Insert into 'groups' table
      const { data, error } = await supabase
        .from('groups')
        .insert([{ name: groupName.trim() }])
        .select()
        .single();

      if (error) throw error;

      // 2. Call the parent function (usually handles navigation/state)
      if (onGroupCreated) onGroupCreated(data);
      
      setGroupName('');
    } catch (error) {
      console.error('Error creating group:', error.message);
      alert('Failed to create group. Check your Supabase connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-md mx-auto"
    >
      <div className="bg-slate-800/40 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl relative overflow-hidden">
        {/* Cinematic Background Glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/10 blur-3xl rounded-full" />
        <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-purple-500/10 blur-3xl rounded-full" />

        <div className="relative z-10">
          <div className="w-16 h-16 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-blue-900/40">
            <Users className="text-white" size={32} />
          </div>

          <h2 className="text-2xl font-bold text-white mb-2 flex items-center gap-2">
            Start a New Group <Sparkles className="text-yellow-400" size={20} />
          </h2>
          <p className="text-slate-400 mb-8">
            Whether it's a trip to Goa or shared rent, track everything in one place.
          </p>

          <form onSubmit={handleCreate} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300 ml-1">Group Name</label>
              <input
                type="text"
                placeholder="e.g. Goa Trip 2026 🌴"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                disabled={loading}
                className="w-full bg-slate-900/60 border border-slate-700 rounded-xl px-4 py-4 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !groupName.trim()}
              className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-4 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-lg shadow-blue-900/30 group"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={24} />
              ) : (
                <>
                  <span>Create Group</span>
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
      
      <p className="text-center text-slate-500 text-sm mt-6">
        Step 1: Create Group &bull; Step 2: Add Friends &bull; Step 3: Split Costs
      </p>
    </motion.div>
  );
};

export default CreateGroup;