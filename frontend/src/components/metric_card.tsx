import axios from "axios";
import { useEffect, useState, useCallback } from "react";
import { Experiment } from "@/types/experiment";
import { Environment } from "@/types/environment";

type RewardWithExpId = {
  exp_id: string;
  exp_name: string;
  mean_reward: number;
  std_reward: number | null;
};

export default function MetricCard({
  exps,
  env,
  refreshSignal,
}: {
  exps: Experiment[];
  env: Environment;
  refreshSignal?: number;
}) {
  const [rewards, setRewards] = useState<RewardWithExpId[]>([]);

  useEffect(() => {
    const refreshMetrics = async () => {
      const data = await Promise.all(
        exps.map(async (exp) => {
          const url = `/api/step/exp/${exp.id}/env/${env.id}/reward/stats`;
          const data = (await axios.get(url)).data;
          return {
            exp_id: exp ? exp.id : "",
            exp_name: exp?.name ? exp.name : "",
            mean_reward: data.mean_reward,
            std_reward: data.std_reward,
          };
        })
      );
      setRewards(data);
    };

    refreshMetrics();
  }, [exps, refreshSignal, env]);

  return (
    <div className="card w-full h-full shadow bg-base-100">
      <div className="card-body">
        <div className="flex justify-between">
          <h2 className="card-title flex-1">Metrics</h2>
        </div>
        <div className="stats w-full h-full">
          {rewards.map((reward_with_expid) => (
            <div key={reward_with_expid.exp_id} className="stat">
              <div className="stat-title">
                Total Reward{" - " + reward_with_expid.exp_name + " "}
                <span className="badge badge-outline badge-neutral">
                  {reward_with_expid.exp_id}
                </span>
              </div>
              <div className="stat-value">
                {reward_with_expid.mean_reward.toFixed(2)}
              </div>
              <div className="stat-desc">
                ±
                {reward_with_expid.std_reward
                  ? reward_with_expid.std_reward.toFixed(2)
                  : "N/A"}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
