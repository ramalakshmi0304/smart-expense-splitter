import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { Sparkles, Plus, Loader2 } from 'lucide-react';

const AddExpense = ({ members, groupId, onAdd }) => {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    description: '',
    amount: '',
    paid_by: '',
    participants: [],
    category: 'General' // Default category
  });

  // Automatically select all members as participants by default
  useEffect(() => {
    if (members.length > 0 && form.participants.length === 0) {
      setForm(prev => ({
        ...prev,
        participants: members.map(m => m.id)
      }));
    }
  }, [members]);

  // The "Brain" of the real-time categorization
  const predictCategory = (text) => {
    const desc = text.toLowerCase();
    if (desc.match(/pizza|food|dinner|restaurant|cafe|eat|lunch/)) return 'Food';
    if (desc.match(/petrol|gas|uber|taxi|fuel|travel|flight/)) return 'Travel';
    if (desc.match(/hotel|stay|airbnb|rent/)) return 'Lodging';
    if (desc.match(/movie|netflix|game|party|club/)) return 'Entertainment';
    if (desc.match(/bill|water|electricity|wifi|phone/)) return 'Utilities';
    return 'General'; 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.description || !form.amount || !form.paid_by) {
      alert("Please select a payer and enter details.");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.from('expenses').insert([{
        description: form.description,
        amount: parseFloat(form.amount),
        paid_by: form.paid_by,
        group_id: groupId,
        participants: form.participants,
        category: form.category // This now sends the predicted category!
      }]);

      if (error) throw error;

      // Reset form but keep participants selected for convenience
      setForm({ ...form, description: '', amount: '', category: 'General' });
      onAdd();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-800/40 border border-slate-700/50 p-6 rounded-2xl mb-10 shadow-xl">
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">

        {/* Description with Real-time AI Categorization */}
        <div className="md:col-span-1 relative">
          <label className="text-xs text-slate-400 mb-2 block uppercase tracking-widest font-bold flex justify-between">
            Description
            <span className="text-[10px] text-emerald-400 normal-case">{form.category}</span>
          </label>
          <input
            className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white focus:ring-2 focus:ring-emerald-500/50 outline-none transition-all"
            placeholder="Dinner, Petrol..."
            value={form.description}
            onChange={(e) => {
              const val = e.target.value;
              const predicted = predictCategory(val);
              setForm({ ...form, description: val, category: predicted });
            }}
          />
        </div>

        {/* Amount */}
        <div>
          <label className="text-xs text-slate-400 mb-2 block uppercase tracking-widest font-bold">Amount ($)</label>
          <input
            type="number"
            className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white outline-none focus:ring-2 focus:ring-emerald-500/50 transition-all"
            placeholder="0.00"
            value={form.amount}
            onChange={e => setForm({ ...form, amount: e.target.value })}
          />
        </div>

        {/* Payer Selection */}
        <div>
          <label className="text-xs text-slate-400 mb-2 block uppercase tracking-widest font-bold">Paid By</label>
          <select
            className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white outline-none cursor-pointer focus:ring-2 focus:ring-emerald-500/50"
            value={form.paid_by}
            onChange={e => setForm({ ...form, paid_by: e.target.value })}
          >
            <option value="">Select Payer</option>
            {members.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
          </select>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="bg-emerald-600 hover:bg-emerald-500 h-[50px] text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-900/40 active:scale-95"
        >
          {loading ? <Loader2 className="animate-spin" size={20} /> : <><Plus size={20} /> Add Expense</>}
        </button>

        {/* Participant Selection */}
        <div className="md:col-span-4 mt-4 p-4 bg-slate-950/50 rounded-xl border border-slate-800">
          <label className="text-[10px] text-slate-500 mb-3 block uppercase tracking-widest font-bold text-center md:text-left">Split With</label>
          <div className="flex flex-wrap gap-2 justify-center md:justify-start">
            {members.map(m => {
              const active = form.participants.includes(m.id);
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => {
                    const next = active
                      ? form.participants.filter(id => id !== m.id)
                      : [...form.participants, m.id];
                    setForm({ ...form, participants: next });
                  }}
                  className={`text-xs px-4 py-2 rounded-full border transition-all duration-200 ${active
                      ? 'bg-emerald-500 text-white border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                      : 'bg-slate-900 border-slate-700 text-slate-400 hover:border-slate-500'
                    }`}
                >
                  {m.name}
                </button>
              );
            })}
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddExpense;