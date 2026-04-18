import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabase';
import { Sparkles, Plus, Loader2, IndianRupee } from 'lucide-react';

const AddExpense = ({ members, groupId, onAdd }) => {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    description: '',
    amount: '',
    paid_by: '',
    participants: [],
    category: 'General'
  });

  useEffect(() => {
    if (members.length > 0 && form.participants.length === 0) {
      setForm(prev => ({
        ...prev,
        participants: members.map(m => m.id)
      }));
    }
  }, [members]);

  const predictCategory = (text) => {
    const desc = text.toLowerCase();
    if (desc.match(/pizza|food|dinner|restaurant|cafe|eat|lunch|chai|biryani/)) return 'Food';
    if (desc.match(/petrol|gas|uber|taxi|fuel|travel|flight|auto|ola/)) return 'Travel';
    if (desc.match(/hotel|stay|airbnb|rent|pg/)) return 'Lodging';
    if (desc.match(/movie|netflix|game|party|club|cinema/)) return 'Entertainment';
    if (desc.match(/bill|water|electricity|wifi|phone|recharge/)) return 'Utilities';
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
        category: form.category
      }]);

      if (error) throw error;

      setForm({ ...form, description: '', amount: '', category: 'General' });
      onAdd();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-800/30 backdrop-blur-md border border-slate-700/50 p-6 rounded-3xl mb-10 shadow-2xl">
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">

        {/* Description */}
        <div className="md:col-span-1 relative">
          <label className="text-[10px] text-slate-500 mb-2 block uppercase tracking-[0.2em] font-bold flex justify-between px-1">
            Description
            <span className="text-emerald-400 flex items-center gap-1">
               <Sparkles size={10} /> {form.category}
            </span>
          </label>
          <input
            className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl p-4 text-white focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-500/50 outline-none transition-all placeholder:text-slate-700"
            placeholder="Chai, Dinner, Petrol..."
            value={form.description}
            onChange={(e) => {
              const val = e.target.value;
              const predicted = predictCategory(val);
              setForm({ ...form, description: val, category: predicted });
            }}
          />
        </div>

        {/* Amount (INR Version) */}
        <div className="relative">
          <label className="text-[10px] text-slate-500 mb-2 block uppercase tracking-[0.2em] font-bold px-1">Amount (₹)</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600 font-bold">₹</span>
            <input
              type="number"
              className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl p-4 pl-8 text-white outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all"
              placeholder="0.00"
              value={form.amount}
              onChange={e => setForm({ ...form, amount: e.target.value })}
            />
          </div>
        </div>

        {/* Payer Selection */}
        <div>
          <label className="text-[10px] text-slate-500 mb-2 block uppercase tracking-[0.2em] font-bold px-1">Paid By</label>
          <select
            className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl p-4 text-white outline-none cursor-pointer focus:ring-2 focus:ring-emerald-500/30 appearance-none"
            value={form.paid_by}
            onChange={e => setForm({ ...form, paid_by: e.target.value })}
          >
            <option value="" className="bg-slate-950">Select Payer</option>
            {members.map(m => <option key={m.id} value={m.id} className="bg-slate-950">{m.name}</option>)}
          </select>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="bg-emerald-600 hover:bg-emerald-500 h-[60px] text-white font-bold rounded-2xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-900/20 active:scale-95 disabled:opacity-50"
        >
          {loading ? <Loader2 className="animate-spin" size={20} /> : <><Plus size={20} /> Add Expense</>}
        </button>

        {/* Split Selection */}
        <div className="md:col-span-4 mt-2 p-5 bg-slate-950/30 rounded-2xl border border-slate-800/50">
          <div className="flex items-center justify-between mb-4 px-1">
             <label className="text-[10px] text-slate-500 uppercase tracking-[0.2em] font-bold">Split With</label>
             <span className="text-[10px] text-slate-600 font-medium italic">Click to exclude members</span>
          </div>
          <div className="flex flex-wrap gap-2">
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
                  className={`text-xs px-5 py-2.5 rounded-xl border transition-all duration-300 font-semibold ₹{active
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.1)]'
                      : 'bg-slate-900/50 border-slate-800 text-slate-600 hover:border-slate-700'
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