import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Utensils, Car, ShoppingBag, Film, Heart, Settings, Banknote } from 'lucide-react';
import { supabase } from '../services/supabase';

// Helper to map category strings to Lucide icons
const getCategoryIcon = (category) => {
  const icons = {
    Food: <Utensils size={18} className="text-orange-400" />,
    Transport: <Car size={18} className="text-blue-400" />,
    Shopping: <ShoppingBag size={18} className="text-pink-400" />,
    Entertainment: <Film size={18} className="text-purple-400" />,
    Health: <Heart size={18} className="text-red-400" />,
    Utilities: <Settings size={18} className="text-slate-400" />,
    General: <Banknote size={18} className="text-emerald-400" />,
  };
  return icons[category] || icons.General;
};

const ExpenseList = ({ expenses, members, onDelete }) => {
  
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this expense?");
    if (!confirmDelete) return;

    const { error } = await supabase.from('expenses').delete().eq('id', id);
    if (error) {
      console.error("Error deleting:", error.message);
    } else if (onDelete) {
      onDelete(id);
    }
  };

  const getPayerName = (id) => {
    return members.find(m => m.id === id)?.name || "Unknown";
  };

  if (expenses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-slate-500 border-2 border-dashed border-slate-800 rounded-3xl">
        <Banknote size={48} className="mb-4 opacity-20" />
        <p>No expenses found. Start by adding one above!</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <AnimatePresence mode='popLayout'>
        {expenses.map((expense, index) => (
          <motion.div
            key={expense.id}
            layout
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ delay: index * 0.05 }}
            className="group relative flex items-center justify-between p-4 bg-slate-900/40 hover:bg-slate-800/60 border border-slate-700/50 rounded-2xl transition-all"
          >
            <div className="flex items-center gap-4">
              {/* Icon Container */}
              <div className="w-12 h-12 flex items-center justify-center bg-slate-800 rounded-xl border border-slate-700 group-hover:border-slate-500 transition-colors">
                {getCategoryIcon(expense.category)}
              </div>

              {/* Expense Details */}
              <div>
                <h4 className="font-semibold text-slate-100">{expense.description}</h4>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span className="bg-slate-800 px-2 py-0.5 rounded text-slate-400 border border-slate-700">
                    {expense.category}
                  </span>
                  <span>•</span>
                  <span>Paid by <span className="text-blue-400">{getPayerName(expense.paid_by)}</span></span>
                </div>
              </div>
            </div>

            {/* Right Side: Amount & Actions */}
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-lg font-bold text-white">${Number(expense.amount).toFixed(2)}</p>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider">
                  {new Date(expense.created_at).toLocaleDateString()}
                </p>
              </div>

              <button
                onClick={() => handleDelete(expense.id)}
                className="opacity-0 group-hover:opacity-100 p-2 hover:bg-red-500/10 hover:text-red-400 text-slate-500 rounded-lg transition-all"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ExpenseList;