// Lightweight in-browser RL (no persistence)

type State = {
  complexity: number;
};

const ACTIONS = [0, 1, 2]; // 0=Easy, 1=Balanced, 2=Intensive

// In-memory Q-table
const Q: Record<string, Record<number, number>> = {};

const getStateKey = (state: State) => `c:${state.complexity}`;

export const chooseAction = (state: State): number => {
  const key = getStateKey(state);
  if (!Q[key]) {
    Q[key] = { 0: 0, 1: 0, 2: 0 };
  }

  // ε-greedy (simple)
  const epsilon = 0.2;
  if (Math.random() < epsilon) {
    return ACTIONS[Math.floor(Math.random() * ACTIONS.length)];
  }

  return ACTIONS.reduce((best, a) =>
    Q[key][a] > Q[key][best] ? a : best
  );
};

export const updateQTable = (
  state: State,
  action: number,
  reward: number
) => {
  const key = getStateKey(state);
  if (!Q[key]) {
    Q[key] = { 0: 0, 1: 0, 2: 0 };
  }
  Q[key][action] += reward;
};

export const getActionLabel = (action: number) => {
  return ['Easy', 'Balanced', 'Intensive'][action] ?? 'Balanced';
};

// RL-suggested totals (NOT user input)
export const getStudyHoursByAction = (
  action: number,
  complexity: number
) => {
  const base = complexity === 1 ? 6 : complexity === 2 ? 8 : 12;
  return base + action * 2;
};

export const getDaysByAction = (
  action: number,
  complexity: number
) => {
  const base = complexity === 1 ? 2 : complexity === 2 ? 3 : 4;
  return Math.max(1, base + action);
};
