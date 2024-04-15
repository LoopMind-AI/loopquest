import { useEffect } from "react";
import { Experiment } from "@/types/experiment";
import { Environment } from "@/types/environment";
import MetricCard from "@/components/metric_card";
import VariableMonitor from "@/components/variable_monitor";
import SimulationReplayer from "@/components/sim_replayer";

export default function ExperimentWorkspace({
  exps,
  env,
}: {
  exps: Experiment[];
  env: Environment;
}) {
  return (
    <div>
      <div className="w-full max-auto grid-col-1 xl:grid-col-2">
        <div className="xl:col-start-2 p-2">
          <MetricCard exps={exps} env={env} />
        </div>
        <div className="p-2 xl:col-span-2 w-full">
          <SimulationReplayer exps={exps} env={env} />
        </div>
        <div className="p-2 xl:col-span-2 w-full">
          <VariableMonitor env={env} exps={exps} />
        </div>
      </div>
    </div>
  );
}
