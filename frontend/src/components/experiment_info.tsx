import React, { experimental_useEffectEvent, useState } from "react";
import { Experiment } from "@/types/experiment";
import { Environment } from "@/types/environment";
import { getTimeDelta } from "@/utils/time";
import ExperimentSxsTable from "./experiment_sxs_table";

export default function ExperimentInfo({
  env,
  user_id,
  exp,
  selectedCompareExps,
  setSelectedCompareExps,
  setSubmitted,
  onRunExperiment,
  expFinished,
}: {
  env: Environment;
  user_id: string;
  exp: Experiment | undefined;
  selectedCompareExps: Experiment[];
  setSelectedCompareExps: (exps: Experiment[]) => void;
  setSubmitted: (submitted: boolean) => void;
  onRunExperiment: () => void;
  expFinished: boolean;
}) {
  const [compareExps, setCompareExps] = useState<Experiment[]>([]);
  const [loadingExps, setLoadingExps] = useState(false);

  const onCompareExperiment = () => {
    setLoadingExps(true);
    fetch("/api/experiment/user/" + user_id + "/environment/" + env.id)
      .then((response) => response.json())
      .then((data) => {
        setCompareExps(data);
      })
      .catch((error) => console.log(error))
      .finally(() => setLoadingExps(false));
  };

  return (
    <div>
      <h2 className="card-title">
        Experiment{" "}
        <span className="badge badge-neutral badge-outline">{exp?.id}</span>
      </h2>
      <div className="card mt-5 mb-5 bordered">
        <ExperimentSxsTable
          experiments={selectedCompareExps}
          current_exp_id={exp?.id}
        />
      </div>

      <div className="card-actions justify-end">
        <div className="grid grid-cols-3 gap-4">
          <div className="dropdown">
            <button
              className="btn btn-accent normal-case text-lg"
              onClick={onCompareExperiment}
            >
              Compare Experiments
            </button>
            <ul className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box">
              {loadingExps ? (
                <li>
                  <a>
                    <span className="loading loading-spinner loading-xs"></span>
                  </a>
                </li>
              ) : (
                compareExps?.map((cmp_exp) => {
                  return (
                    <li
                      key={cmp_exp.id}
                      onClick={() => {
                        const isDuplicate = selectedCompareExps.some(
                          (exp: Experiment) => exp.id === cmp_exp.id
                        );
                        if (!isDuplicate) {
                          setSelectedCompareExps([
                            ...selectedCompareExps,
                            cmp_exp,
                          ]);
                        }
                      }}
                    >
                      <a href="#">
                        {cmp_exp.name} | Created{" "}
                        {getTimeDelta(cmp_exp.creation_time)}
                        <span className="badge badge-accent">{cmp_exp.id}</span>
                      </a>
                    </li>
                  );
                })
              )}
            </ul>
          </div>
          <button
            className="btn btn-secondary normal-case text-lg"
            // TODO: reset all the states in evaluation
            onClick={() => setSubmitted(false)}
          >
            Create Another
          </button>
          <button
            className="btn btn-primary normal-case text-lg"
            onClick={() => onRunExperiment()}
            disabled={expFinished}
          >
            Run Experiment
          </button>
        </div>
      </div>
    </div>
  );
}
