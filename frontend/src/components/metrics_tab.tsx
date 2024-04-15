import React, { useState } from "react";
import { Experiment } from "@/types/experiment";
import { Environment } from "@/types/environment";
import { useEffect } from "react";

type RewardStats = {
  mean: number | null;
  std: number | null;
};

type RewardWithEnv = {
  env: Environment;
  reward: RewardStats;
};

type ExpRewards = {
  exp: Experiment;
  rewards: RewardWithEnv[];
};

export default function MetricsTab({
  exps,
  envs,
  setCheckedExps,
  setCurrEnv,
  setActiveTab,
}: {
  exps: Experiment[];
  envs: Environment[];
  setCheckedExps: React.Dispatch<React.SetStateAction<Experiment[]>>;
  setCurrEnv: React.Dispatch<React.SetStateAction<Environment>>;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
}) {
  const [rewards, setRewards] = useState<ExpRewards[]>([]);
  useEffect(() => {
    const fetchMetrics = async () => {
      const reward_matrix: ExpRewards[] = await Promise.all(
        exps.map(async (exp) => {
          const rewards: RewardWithEnv[] = await Promise.all(
            envs.map(async (env) => {
              const url = `/api/step/exp/${exp.id}/env/${env.id}/reward/stats`;
              const res = await fetch(url);
              if (!res.ok) {
                return {
                  env: env,
                  reward: {
                    mean: null,
                    std: null,
                  },
                };
              }
              const reward_stats = await res.json();

              return {
                env: env,
                reward: {
                  mean: reward_stats.mean_reward,
                  std: reward_stats.std_reward,
                },
              };
            })
          );
          return {
            exp: exp,
            rewards,
          };
        })
      );
      setRewards(reward_matrix);
    };
    fetchMetrics();
  }, [exps, envs]);

  return (
    <div className="card bg-base-100">
      <div className="card-body">
        <div className="card-title">Metrics</div>
        <table className="table">
          <thead>
            <tr>
              <th></th>
              {envs.map((env) => (
                <th>{env.id}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rewards.map((exp_reward) => (
              <tr key={exp_reward.exp.id}>
                <th>{exp_reward.exp.name}</th>
                {exp_reward.rewards.map((ele) => (
                  <td
                    className="cursor-pointer"
                    onClick={() => {
                      setCheckedExps([exp_reward.exp]);
                      setCurrEnv(ele.env);
                      setActiveTab("Workspace");
                    }}
                  >
                    {ele.reward.mean !== null
                      ? `${ele.reward.mean.toFixed(2)} ± ${
                          ele.reward.std === null
                            ? "N/A"
                            : ele.reward.std.toFixed(2)
                        }`
                      : "N/A"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
