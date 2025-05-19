function calculateScore(income, amount, duration) {
  const ratio = amount / (income * duration);
  return ratio < 0.4 ? 80 : 40; // dummy AI logic
}
if (score >= 70) status = 'approved';
else status = 'rejected';
