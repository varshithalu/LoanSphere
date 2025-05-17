exports.evaluateRisk = ({ amount, tenure }) => {
    const score = Math.random() * 100;
    return score > 60 ? 'approved' : score > 40 ? 'conditional' : 'rejected';
  };
  