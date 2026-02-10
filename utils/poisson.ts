
/**
 * Calculates the Poisson probability for k occurrences with mean lambda.
 * P(k; λ) = (e^-λ * λ^k) / k!
 */
export const poissonProbability = (k: number, lambda: number): number => {
  if (lambda === 0) return k === 0 ? 1 : 0;
  const numerator = Math.exp(-lambda) * Math.pow(lambda, k);
  let denominator = 1;
  for (let i = 1; i <= k; i++) {
    denominator *= i;
  }
  return numerator / denominator;
};

/**
 * Generates an array of probabilities for 0 to maxGoals
 */
export const getGoalProbabilities = (lambda: number, maxGoals: number = 5): number[] => {
  const probs: number[] = [];
  let sum = 0;
  for (let i = 0; i < maxGoals; i++) {
    const p = poissonProbability(i, lambda);
    probs.push(p);
    sum += p;
  }
  // The last entry captures the "maxGoals or more" probability to ensure sum = 1
  probs.push(Math.max(0, 1 - sum));
  return probs;
};
