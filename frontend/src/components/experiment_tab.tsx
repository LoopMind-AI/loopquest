import ExperimentTable from "./experiment_table";
import ExperimentSxsTable from "./experiment_sxs_table";
import VariableMonitor from "./variable_monitor";
import { useState } from "react";
import { Experiment } from "@/types/experiment";
import { Environment } from "@/types/environment";

export default function ExperimentTab({
  user_id,
  env,
  fetchExperiments,
}: {
  user_id: string;
  env: Environment;
  fetchExperiments: boolean;
}) {
  const [checkedExps, setCheckedExps] = useState<Experiment[]>([]);
  return (
    <div className="grid grid-col-2">
      <div className="p-4">
        <ExperimentTable
          user_id={user_id}
          env_id={env.id}
          checkedExps={checkedExps}
          setCheckedExps={setCheckedExps}
          fetchExperiments={fetchExperiments}
        />
      </div>
      {checkedExps.length > 0 && (
        <div className="p-4">
          <div className="card w-full h-full max-auto shadow bg-base-100">
            <div className="card-body">
              <h2 className="card-title">Experiment Details</h2>
              <ExperimentSxsTable experiments={checkedExps} />
            </div>
          </div>
        </div>
      )}
      {checkedExps.length > 0 && (
        <div className="p-4 col-span-2">
          <VariableMonitor env_id={env.id} exps={checkedExps} />
        </div>
      )}
    </div>
  );
}
