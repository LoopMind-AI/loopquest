import React, { useState, useEffect } from "react";
import { MultiSelect } from "react-multi-select-component";
import { Environment, VarNode } from "@/types/environment";
import LineChart from "./line_chart";
import axios from "axios";
import { VariableData } from "@/types/variable_data";
import { Experiment } from "@/types/experiment";

type SelectOption = {
  label: string;
  value: string;
};

function getLeafVarAsSelectOptions(
  root: VarNode,
  parent_label: string
): SelectOption[] {
  const label =
    parent_label === "" ? `${root.name}` : `${parent_label}/${root.name}`;
  if (root.children.length === 0) {
    return [
      {
        label: label,
        value: root.path ? root.path : "",
      },
    ];
  }
  return root.children
    .map((node) => getLeafVarAsSelectOptions(node, label))
    .flat();
}

export default function VariableMonitor({
  env,
  exps,
}: {
  env: Environment;
  exps: Experiment[];
}) {
  const [episode, setEpisode] = useState(0);
  const [maxEpisode, setMaxEpisode] = useState<number | undefined>(undefined);
  const [selectedObservations, setSelectedObservations] = useState<
    SelectOption[]
  >([]);
  const [selectedActions, setSelectedActions] = useState<SelectOption[]>([]);
  const [selectReward, setSelectReward] = useState(false);
  const [observationData, setObservationData] = useState<VariableData[]>([]);
  const [actionData, setActionData] = useState<VariableData[]>([]);
  const [rewardData, setRewardData] = useState<VariableData | undefined>(
    undefined
  );
  useEffect(() => {
    setEpisode(0);
  }, [env, exps]);

  useEffect(() => {
    const fetchMaxEpisode = async () => {
      const max_episodes = await Promise.all(
        exps.map(async (exp) => {
          const url = `/api/step/exp/${exp.id}/env/${env.id}/eps/max`;
          return (await axios.get(url)).data;
        })
      );
      setMaxEpisode(Math.max(...max_episodes));
    };
    fetchMaxEpisode();
  }, [exps, env]);

  const obs_label_and_paths = env.observation_metadata
    ? getLeafVarAsSelectOptions(env.observation_metadata, "")
    : [];
  const act_label_and_paths = env.action_metadata
    ? getLeafVarAsSelectOptions(env.action_metadata, "")
    : [];

  useEffect(() => {
    const onUpdateChart = async () => {
      const observation_data = await Promise.all(
        selectedObservations.map(async (selection) => {
          const data = exps.map(async (exp) => {
            const url = `/api/step/exp/${exp.id}/env/${env.id}/eps/${episode}/obs${selection.value}`;
            return {
              name: exp.name as string,
              value: (await axios.get(url)).data,
            };
          });
          return { label: selection.label, data: await Promise.all(data) };
        })
      );
      setObservationData(observation_data);

      const action_data = await Promise.all(
        selectedActions.map(async (selection) => {
          const data = exps.map(async (exp) => {
            const url = `/api/step/exp/${exp.id}/env/${env.id}/eps/${episode}/act${selection.value}`;
            return {
              name: exp.name as string,
              value: (await axios.get(url)).data,
            };
          });
          return { label: selection.label, data: await Promise.all(data) };
        })
      );
      setActionData(action_data);

      if (selectReward) {
        const reward_data = await Promise.all(
          exps.map(async (exp) => {
            const url = `/api/step/exp/${exp.id}/env/${env.id}/eps/${episode}/reward`;
            return {
              name: exp.name as string,
              value: (await axios.get(url)).data,
            };
          })
        );
        setRewardData({ label: "reward", data: reward_data });
      } else {
        setRewardData(undefined);
      }
    };
    onUpdateChart();
  }, [selectedObservations, selectedActions, selectReward, exps, env, episode]);

  return (
    <div className="card h-full w-full shadow bg-base-100">
      <div className="card-body">
        <h1 className="card-title">
          Visualize Observation and Action Variables
        </h1>
        <div className="grid grid-col-3">
          <div className="p-2 col-start-1">
            <label className="label font-bold">Observation</label>
            <MultiSelect
              options={obs_label_and_paths}
              value={selectedObservations}
              onChange={setSelectedObservations}
              labelledBy="Select"
            />
          </div>
          <div className="p-2 col-start-2">
            <label className="label font-bold">Action</label>
            <MultiSelect
              options={act_label_and_paths}
              value={selectedActions}
              onChange={setSelectedActions}
              labelledBy="Select"
            />
          </div>
          <div className="p-2 col-start-3">
            <label className="label font-bold">Reward</label>
            <input
              type="checkbox"
              className="checkbox"
              checked={selectReward}
              onChange={(e) => setSelectReward(e.target.checked)}
            />
          </div>
        </div>
        <div>
          <label className="label">
            <span className="label-text font-bold">Episode {episode}</span>
            <span className="alt-text font-bold">{maxEpisode}</span>
          </label>
          <input
            type="range"
            min={0}
            max={maxEpisode}
            value={episode}
            className="range"
            onInput={(e) => {
              setEpisode(parseInt(e.currentTarget.value));
            }}
          />
        </div>
        <div className="grid grid-col-1">
          {observationData.map((data) => {
            return (
              <div key={data.label} className="p-3">
                <LineChart line_data={data} />
              </div>
            );
          })}
          {actionData.map((data) => {
            return (
              <div key={data.label} className="p-3">
                <LineChart line_data={data} />;
              </div>
            );
          })}
          {rewardData && (
            <div key={rewardData.label} className="p-3">
              <LineChart line_data={rewardData} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
