import ExperimentTable from "./experiment_table";
import ExperimentSxsTable from "./experiment_sxs_table";
import VariableMonitor from "./variable_monitor";
import { useState } from "react";
import { Experiment } from "@/types/experiment";
import { Environment } from "@/types/environment";

export default function ExperimentTab({
  exps,
  checkedExps,
  setCheckedExps,
}: {
  exps: Experiment[];
  checkedExps: Experiment[];
  setCheckedExps: (exps: Experiment[]) => void;
}) {
  return (
    <div className="grid grid-col-2">
      <div className="p-4">
        <ExperimentTable
          exps={exps}
          checkedExps={checkedExps}
          setCheckedExps={setCheckedExps}
        />
      </div>
      {checkedExps.length > 0 && (
        <div className="p-4">
          <ExperimentSxsTable experiments={checkedExps} />
        </div>
      )}
    </div>
  );
}
