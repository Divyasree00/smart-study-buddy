// In-browser Reinforcement Learning Engine using Q-Learning
// State: complexity (1-3), Action: intensity (0=easy, 1=balanced, 2=intensive)
// This is a stateless, in-memory RL that resets on page refresh

type QTable = Record<string, number[]>;

interface RLState {
  complexity: number;
}

interface RLEngine {
  qTable: QTable;
  alpha: number; // Learning rate
  gamma: number; // Discount factor
  epsilon: number; // Exploration rate
}

// Create a singleton RL engine instance
let rlEngine: RLEngine = {
  qTable: {},
  alpha: 0.1,
  gamma: 0.9,
  epsilon: 0.2,
};

const getStateKey = (state: RLState): string => {
  return `c${state.complexity}`;
};

const initializeState = (stateKey: string): void => {
  if (!rlEngine.qTable[stateKey]) {
    // Initialize Q-values for 3 actions: easy(0), balanced(1), intensive(2)
    rlEngine.qTable[stateKey] = [0, 0, 0];
  }
};

export const chooseAction = (state: RLState): number => {
  const stateKey = getStateKey(state);
  initializeState(stateKey);

  // Epsilon-greedy action selection
  if (Math.random() < rlEngine.epsilon) {
    // Explore: choose random action
    return Math.floor(Math.random() * 3);
  } else {
    // Exploit: choose best action
    const qValues = rlEngine.qTable[stateKey];
    const maxQ = Math.max(...qValues);
    const bestActions = qValues
      .map((q, i) => (q === maxQ ? i : -1))
      .filter((i) => i !== -1);
    return bestActions[Math.floor(Math.random() * bestActions.length)];
  }
};

export const updateQTable = (
  state: RLState,
  action: number,
  reward: number
): void => {
  const stateKey = getStateKey(state);
  initializeState(stateKey);

  // Simple Q-learning update (terminal state, so no next state)
  const currentQ = rlEngine.qTable[stateKey][action];
  const newQ = currentQ + rlEngine.alpha * (reward - currentQ);
  rlEngine.qTable[stateKey][action] = newQ;

  console.log(`RL Update: State=${stateKey}, Action=${action}, Reward=${reward}, NewQ=${newQ.toFixed(3)}`);
};

export const getActionLabel = (action: number): string => {
  const labels = ['Easy', 'Balanced', 'Intensive'];
  return labels[action] || 'Balanced';
};

export const getStudyHoursByAction = (action: number, complexity: number): number => {
  // Base hours depending on intensity
  const baseHours = [8, 15, 25]; // easy, balanced, intensive
  // Adjust by complexity
  const complexityMultiplier = 0.8 + complexity * 0.2;
  return Math.round(baseHours[action] * complexityMultiplier);
};

export const getDaysByAction = (action: number, complexity: number): number => {
  const baseDays = [7, 5, 3]; // easy, balanced, intensive
  const complexityAddition = complexity - 1; // 0, 1, or 2 extra days
  return baseDays[action] + complexityAddition;
};

export const resetRLEngine = (): void => {
  rlEngine = {
    qTable: {},
    alpha: 0.1,
    gamma: 0.9,
    epsilon: 0.2,
  };
};
