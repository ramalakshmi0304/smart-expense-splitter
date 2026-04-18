export const calculateBalances = (members, expenses) => {
  const balances = {};
  
  // Initialize everyone at zero
  members.forEach(m => {
    balances[m.id] = { id: m.id, name: m.name, amount: 0 };
  });

  expenses.forEach(exp => {
    const amount = parseFloat(exp.amount);
    const payerId = exp.paid_by;
    const participants = exp.participants || []; // Array of member IDs

    if (participants.length === 0) return;

    const share = amount / participants.length;

    // The person who paid gets the full amount added back
    if (balances[payerId]) {
      balances[payerId].amount += amount;
    }

    // Everyone who participated (including the payer) has their share deducted
    participants.forEach(pId => {
      if (balances[pId]) {
        balances[pId].amount -= share;
      }
    });
  });

  return Object.values(balances);
};

export const getSettlements = (balances) => {
  let debtors = balances
    .filter(b => b.amount < -0.01)
    .map(b => ({ ...b, amount: Math.abs(b.amount) }))
    .sort((a, b) => b.amount - a.amount);

  let creditors = balances
    .filter(b => b.amount > 0.01)
    .sort((a, b) => b.amount - a.amount);

  const settlements = [];
  let i = 0, j = 0;

  while (i < debtors.length && j < creditors.length) {
    const payAmount = Math.min(debtors[i].amount, creditors[j].amount);
    settlements.push({
      from: debtors[i].name,
      to: creditors[j].name,
      amount: payAmount.toFixed(2)
    });

    debtors[i].amount -= payAmount;
    creditors[j].amount -= payAmount;

    if (debtors[i].amount <= 0.01) i++;
    if (creditors[j].amount <= 0.01) j++;
  }
  return settlements;
};