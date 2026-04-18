import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, ArrowRight, CheckCircle2, Sparkles, Trash2 } from 'lucide-react';
import { calculateBalances, getSettlements } from '../utils/calculateBalance';
import SpendingChart from './SpendingChart';

// --- AI INSIGHT LOGIC ---
const generateInsights = (expenses) => {
  if (!expenses || expenses.length < 3) return "Add a few more expenses to unlock smart insights.";

  const now = new Date();
  const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const thisWeekTotal = expenses
    .filter(e => new Date(e.created_at) > lastWeek)
    .reduce((sum, e) => sum + parseFloat(e.amount), 0);

  const prevWeekTotal = expenses
    .filter(e => new Date(e.created_at) <= lastWeek)
    .reduce((sum, e) => sum + parseFloat(e.amount), 0);

  const categories = expenses.reduce((acc, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + parseFloat(exp.amount);
    return acc;
  }, {});

  const topCategory = Object.entries(categories).sort((a, b) => b[1] - a[1])[0];

  let insight = "";

  if (prevWeekTotal > 0) {
    const diff = ((thisWeekTotal - prevWeekTotal) / prevWeekTotal) * 100;
    insight = diff > 0
      ? `Spending is up ${diff.toFixed(0)}% this week. `
      : `Spending is down ${Math.abs(diff).toFixed(0)}%! `;
  }

  if (topCategory) {
    insight += `Most of your budget is going toward "${topCategory[0]}".`;
  }

  return insight || "You're off to a great start tracking shared costs!";
};

// NOTE: We use onDeleteGroup (the prop) instead of a local function
const Summary = ({ members, expenses, onDeleteGroup,groupId }) => {
  const balances = useMemo(() => calculateBalances(members, expenses), [members, expenses]);
  const settlements = useMemo(() => getSettlements(balances), [balances]);
  const aiInsight = useMemo(() => generateInsights(expenses), [expenses]);

  return (
    <div className="space-y-8">
      <SpendingChart expenses={expenses} members={members} />
      
      {/* Member Status Section */}
      <section>
        <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-4 ml-1">Member Status</h3>
        <div className="grid gap-3">
          {balances.map((user) => (
            <div key={user.id} className="flex items-center justify-between p-4 bg-slate-900/40 border border-slate-800/50 rounded-2xl">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${user.amount >= 0 ? 'bg-emerald-500/10' : 'bg-red-500/10'}`}>
                  {user.amount >= 0 ? <TrendingUp size={16} className="text-emerald-400" /> : <TrendingDown size={16} className="text-red-400" />}
                </div>
                <span className="font-medium text-slate-200">{user.name}</span>
              </div>
              <span className={`font-mono font-bold ${user.amount >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {user.amount >= 0 ? '+' : ''}${Math.abs(user.amount).toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Suggested Settlements */}
      <section>
        <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-4 ml-1">Suggested Settlements</h3>
        <div className="space-y-3">
          {settlements.length === 0 ? (
            <div className="p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl text-emerald-500/60 text-sm flex items-center gap-2">
              <CheckCircle2 size={16} /> All debts are cleared.
            </div>
          ) : (
            settlements.map((s, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 bg-slate-900/40 border border-slate-800/50 rounded-2xl">
                <div className="flex items-center gap-2 text-sm text-slate-300">
                  <span className="text-white font-semibold">{s.from}</span>
                  <ArrowRight size={14} className="text-slate-600" />
                  <span className="text-white font-semibold">{s.to}</span>
                </div>
                <span className="text-blue-400 font-bold">${s.amount}</span>
              </div>
            ))
          )}
        </div>
      </section>

      {/* AI INSIGHT CARD */}
      <section>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-blue-500/20 animate-pulse" />
          <div className="relative m-[1px] bg-slate-950 border border-slate-800 rounded-3xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-1.5 bg-blue-500/20 rounded-lg">
                <Sparkles className="text-blue-400" size={16} />
              </div>
              <h4 className="text-[10px] font-bold text-blue-400 uppercase tracking-[0.2em]">Smart Insight</h4>
            </div>
            <p className="text-sm text-slate-300 leading-relaxed font-medium italic">
              "{aiInsight}"
            </p>
            <div className="mt-4 flex items-center gap-2 text-[10px] text-slate-500 font-semibold uppercase">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
              Live Analysis Active
            </div>
          </div>
        </motion.div>
      </section>

      {/* --- SINGLE DANGER ZONE SECTION --- */}
      <section className="mt-20 pt-10 border-t border-red-500/10">
        <div className="bg-red-500/5 border border-red-500/10 p-6 rounded-3xl flex items-center justify-between">
          <div>
            <h4 className="text-red-400 font-bold text-sm">Danger Zone</h4>
            <p className="text-slate-500 text-xs">Once you delete a group, there is no going back.</p>
          </div>
          <button
            onClick={onDeleteGroup}
            className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white rounded-xl transition-all font-bold text-xs"
          >
            <Trash2 size={16} />
            Delete Group
          </button>
        </div>
      </section>
    </div>
  );
};

export default Summary;