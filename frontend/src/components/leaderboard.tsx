import { formatDateTime } from "@/utils/time";
import { ExpRewardStats } from "@/types/leaderboard";
import { useDatasetContext } from "@/context/dataset_context";
import React from "react";

export default function Leaderboard({
  rewards,
}: {
  rewards: ExpRewardStats[];
}) {
  const { expIds, setExpIds } = useDatasetContext();
  return (
    <div className="card bg-base-100 m-5">
      <div className="card-body">
        {/* <h2 className="card-title">Leaderboard</h2> */}
        <div className="overflow-x-auto">
          <table className="table w-full">
            <thead>
              <tr>
                <th></th>
                <th>User ID</th>
                <th>Experiment</th>
                <th>Mean Reward</th>
                <th>Std Reward</th>
                <th>Updated Time</th>
              </tr>
            </thead>
            <tbody>
              {rewards.map((reward) => (
                <tr key={reward.exp.id}>
                  <td>
                    <label>
                      <input
                        type="checkbox"
                        className="checkbox"
                        checked={expIds.includes(reward.exp.id)}
                        onChange={(event) => {
                          const isChecked = event.target.checked;
                          if (isChecked) {
                            if (!expIds.includes(reward.exp.id)) {
                              setExpIds([...expIds, reward.exp.id]);
                            }
                          } else {
                            setExpIds(
                              expIds.filter(
                                (id: string) => id !== reward.exp.id
                              )
                            );
                          }
                        }}
                      />
                    </label>
                  </td>
                  <td>{reward.exp.user_id}</td>
                  <td>
                    {reward.exp.name}{" "}
                    <a className="badge badge-outline">{reward.exp.id}</a>
                  </td>
                  <td>{reward.reward_mean?.toFixed(2) ?? "N/A"}</td>
                  <td>{reward.reward_std?.toFixed(2) ?? "N/A"}</td>
                  <td>
                    {reward.exp.update_time &&
                      formatDateTime(reward.exp.update_time)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
