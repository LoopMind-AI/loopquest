import { Experiment } from "./experiment";

type ExpRewardStats = {
  exp: Experiment;
  reward_mean: number | null;
  reward_std: number | null;
};

export type { ExpRewardStats };
