import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserPlus, Loader2, X, CheckCircle2 } from 'lucide-react';
import { supabase } from '../services/supabase';

const AddMember = ({ groupId, onMemberAdded }) => {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('members')
        .insert([{ 
          name: name.trim(), 
          group_id: groupId 
        }])
        .select()
        .single();

      if (error) throw error;

      // Visual feedback
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
      
      setName('');
      if (onMemberAdded) onMemberAdded(data);
    } catch (error) {
      console.error('Error adding member:', error.message);
      alert('Failed to add member');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-800/50 backdrop-blur-md border border-slate-700 p-6 rounded-2xl shadow-xl mb-8"
    >
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 bg-emerald-500/20 rounded-lg">
          <UserPlus className="text-emerald-400" size={20} />
        </div>
        <h3 className="text-lg font-semibold text-white">Add Group Member</h3>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Enter friend's name..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={loading}
            className="w-full bg-slate-900/50 border border-slate-700 rounded-xl px-4 py-3 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
          />
          <AnimatePresence>
            {success && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="absolute right-3 top-3 text-emerald-400"
              >
                <CheckCircle2 size={20} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <button
          type="submit"
          disabled={loading || !name.trim()}
          className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium px-6 py-3 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95 shadow-lg shadow-emerald-900/20"
        >
          {loading ? (
            <Loader2 className="animate-spin" size={20} />
          ) : (
            <>
              <span>Add to Group</span>
            </>
          )}
        </button>
      </form>
      
      <p className="text-xs text-slate-500 mt-3 ml-1">
        Members added here will appear in the "Paid By" and "Split With" options.
      </p>
    </motion.div>
  );
};

export default AddMember;