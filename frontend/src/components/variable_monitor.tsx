import React, { useState, useEffect, use } from "react";
import { MultiSelect } from "react-multi-select-component";
import { Environment } from "@/types/environment";
import LineChart from "./line_chart";
import axios from "axios";
import { VariableData } from "@/types/variable_data";
import { Experiment } from "@/types/experiment";

type SelectOption = {
  label: string;
  value: number;
};

export default function VariableMonitor({
  env_id,
  exps,
}: {
  env_id: string;
  exps: Experiment[];
}) {
  const [env, setEnv] = useState<Environment | undefined>(undefined);
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
    fetch(`/api/env?id=${env_id}`)
      .then((response) => response.json())
      .then((data) => {
        setEnv(data);
      })
      .catch((error) => console.log(error));
  }, [env_id]);

  const obs_array =
    env?.observation_spec
      ?.map((vec_spec) => {
        return vec_spec.var_info?.map((var_info) => {
          return var_info.name;
        });
      })
      .flat()
      .map((name, i) => {
        return { label: name ?? `obs_${i}`, value: i };
      }) ?? [];
  const act_array =
    env?.action_spec
      ?.map((vec_spec) => {
        return vec_spec.var_info?.map((var_info) => {
          return var_info.name;
        });
      })
      .flat()
      .map((name, i) => {
        return { label: name ?? `act_${i}`, value: i };
      }) ?? [];

  useEffect(() => {
    const onUpdateChart = async () => {
      const observation_data = await Promise.all(
        selectedObservations.map(async (selection) => {
          const data = exps.map(async (exp) => {
            const url = `/api/step/exp/${exp.id}/obs/${selection.value}`;
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
            const url = `/api/step/exp/${exp.id}/act/${selection.value}`;
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
            const url = `/api/step/exp/${exp.id}/reward`;
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
  }, [selectedObservations, selectedActions, selectReward, exps]);

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
              options={obs_array}
              value={selectedObservations}
              onChange={setSelectedObservations}
              labelledBy="Select"
            />
          </div>
          <div className="p-2 col-start-2">
            <label className="label font-bold">Action</label>
            <MultiSelect
              options={act_array}
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
