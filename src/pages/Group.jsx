import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../services/supabase';
import AddMember from '../components/AddMember';
import AddExpense from '../components/AddExpense';
import ExpenseList from '../components/ExpenseList';
import Summary from '../components/Summary';
import { motion } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { ArrowLeft } from 'lucide-react';

const Group = () => {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const [members, setMembers] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (groupId) {
      fetchData();
    }
  }, [groupId]);

  const fetchData = async () => {
    try {
      // Fetch members associated with this group
      const { data: mems } = await supabase
        .from('members')
        .select('*')
        .eq('group_id', groupId);
      setMembers(mems || []);

      // Fetch expenses associated with this group
      const { data: exps } = await supabase
        .from('expenses')
        .select('*')
        .eq('group_id', groupId)
        .order('created_at', { ascending: false });
      setExpenses(exps || []);
    } catch (error) {
      console.error("Error loading dashboard:", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteGroup = async () => {
    const confirmDelete = window.confirm(
      "Are you sure? This will permanently delete the group and all associated data."
    );
    
    if (!confirmDelete) return;

    try {
      // Deletes the group. 
      // Ensure "ON DELETE CASCADE" is enabled in Supabase for related members/expenses.
      const { error } = await supabase
        .from('groups')
        .delete()
        .eq('id', groupId);

      if (error) throw error;

      toast.success("Group deleted successfully");
      navigate('/'); // Redirect back to home lobby
    } catch (err) {
      console.error("Delete error:", err.message);
      toast.error("Failed to delete group");
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center text-blue-400 font-mono bg-[#020617]">
      Initializing Dashboard...
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-7xl mx-auto p-4 md:p-10 space-y-10"
    >
      {/* Header Section */}
      <header className="border-b border-slate-800 pb-8">
        <button 
          onClick={() => navigate('/')}
          className="group mb-6 flex items-center gap-2 text-slate-500 hover:text-blue-400 transition-colors text-sm font-bold uppercase tracking-widest"
        >
          <div className="p-2 bg-slate-900 border border-slate-800 rounded-lg group-hover:border-blue-500/50 group-hover:bg-blue-500/10 transition-all">
            <ArrowLeft size={16} />
          </div>
          Back to Squads
        </button>
        <h1 className="text-4xl font-extrabold text-white tracking-tight">
          Group Dashboard
        </h1>
        <p className="text-slate-500 mt-2 font-medium">
          Group ID: <span className="text-slate-300 font-mono">{groupId}</span>
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Main Content (Left Column) */}
        <div className="lg:col-span-8 space-y-8">
          <section>
            <AddMember
              groupId={groupId}
              onMemberAdded={(newMem) => setMembers(prev => [...prev, newMem])}
            />
          </section>

          <section className="relative">
            <div className="absolute -left-4 top-0 bottom-0 w-1 bg-gradient-to-b from-emerald-500/50 to-transparent rounded-full hidden md:block" />
            <AddExpense
              members={members}
              groupId={groupId}
              onAdd={fetchData}
            />
          </section>

          <section>
            <h2 className="text-xl font-bold text-slate-300 mb-4 ml-1">Transaction History</h2>
            <ExpenseList
              expenses={expenses}
              members={members}
              onDelete={fetchData}
            />
          </section>
        </div>

        {/* Sidebar (Right Column) */}
        <div className="lg:col-span-4">
          <div className="sticky top-10">
            <Summary
              members={members}
              expenses={expenses}
              onDeleteGroup={deleteGroup} // Function passed as prop
              groupId={groupId} 
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Group;