import axios from "axios";
import { useEffect, useState, useCallback } from "react";
import { Experiment } from "@/types/experiment";

type RewardWithExpId = {
  exp_id: string;
  exp_name: string;
  mean_reward: number;
  std_reward: number;
};

export default function MetricCard({
  exps,
  refreshSignal,
}: {
  exps: Experiment[];
  refreshSignal?: number;
}) {
  const [rewards, setRewards] = useState<RewardWithExpId[]>([]);

  useEffect(() => {
    const refreshMetrics = async () => {
      const data = await Promise.all(
        exps.map(async (exp) => {
          const url = `/api/step/exp/${exp.id}/reward/stats`;
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
  }, [exps, refreshSignal]);

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
              <div className="stat-value">{reward_with_expid.mean_reward}</div>
              {/* <div className="stat-desc">±{reward_with_expid.std_reward}</div> */}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
