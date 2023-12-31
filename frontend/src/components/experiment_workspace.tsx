import { Experiment } from "@/types/experiment";
import ExperimentSxsTable from "@/components/experiment_sxs_table";
import MetricCard from "@/components/metric_card";
import VariableMonitor from "@/components/variable_monitor";
import SimulationReplayer from "@/components/sim_replayer";

export default function ExperimentWorkspace({
  exp,
  compExps,
}: {
  exp: Experiment | null;
  compExps: Experiment[];
}) {
  return (
    <div className="">
      {exp ? (
        <div className="w-full max-auto grid-col-1 xl:grid-col-2">
          <div className="p-2 w-full">
            <div className="card shadow bg-base-100">
              <div className="card-body">
                <ExperimentSxsTable
                  experiments={compExps}
                  current_exp_id={exp.id}
                />
              </div>
            </div>
          </div>
          <div className="xl:col-start-2 p-2">
            <MetricCard exps={compExps} />
          </div>
          <div className="p-2 xl:col-span-2 w-full">
            <SimulationReplayer exps={compExps} />
          </div>
          <div className="p-2 xl:col-span-2 w-full">
            <VariableMonitor env_id={exp.environment_id} exps={compExps} />
          </div>
        </div>
      ) : (
        <div className="hero">
          <div className="text-center hero-content min-h-screen">
            <h2 className="text-2xl font-bold">
              Experiment is not loaded correctly
            </h2>
          </div>
        </div>
      )}
    </div>
  );
}
