import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const SpendingChart = ({ expenses, members }) => {
  const chartData = useMemo(() => {
    // Debugging: This will show in your browser console
    console.log("Chart Data Check:", { expenses, members });

    if (!expenses?.length || !members?.length) return [];

    const totals = expenses.reduce((acc, exp) => {
      // Logic: Matches the member ID in the expense to the member ID in the members list
      const payer = members.find(m => m.id === exp.paid_by);
      const name = payer ? payer.name : "Unknown";

      acc[name] = (acc[name] || 0) + parseFloat(exp.amount);
      return acc;
    }, {});

    return Object.entries(totals).map(([name, value]) => ({ name, value }));
  }, [expenses, members]);

  const COLORS = ['#60a5fa', '#a855f7', '#2dd4bf', '#fbbf24', '#f87171'];

  if (!chartData.length) return (
    <div className="h-[300px] w-full bg-slate-900/40 border border-slate-800/50 rounded-3xl p-6 flex items-center justify-center">
      <p className="text-slate-500 text-xs font-mono">Waiting for data...</p>
    </div>
  );

  return (
    <div className="h-[300px] w-full bg-slate-900/40 border border-slate-800/50 rounded-3xl p-6">
      <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] mb-4">
        Contribution Breakdown
      </h3>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-₹{index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
            itemStyle={{ color: '#94a3b8' }}
          />
          <Legend iconType="circle" verticalAlign="bottom" height={36}/>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SpendingChart;