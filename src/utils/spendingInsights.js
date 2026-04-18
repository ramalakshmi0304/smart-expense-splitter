export const generateInsights = (expenses) => {
  if (expenses.length < 5) return "Add more expenses to see AI insights.";

  const now = new Date();
  const lastWeek = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  const thisWeekTotal = expenses
    .filter(e => new Date(e.created_at) > lastWeek)
    .reduce((sum, e) => sum + parseFloat(e.amount), 0);

  const prevWeekTotal = expenses
    .filter(e => new Date(e.created_at) <= lastWeek)
    .reduce((sum, e) => sum + parseFloat(e.amount), 0);

  if (prevWeekTotal > 0) {
    const diff = ((thisWeekTotal - prevWeekTotal) / prevWeekTotal) * 100;
    return diff > 0 
      ? `📈 Your spending increased by ${diff.toFixed(0)}% this week.`
      : `📉 Great job! You spent ${Math.abs(diff).toFixed(0)}% less than last week.`;
  }

  return "You're off to a great start tracking your shared costs!";
};