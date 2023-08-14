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
  const exps = exp ? [exp, ...compExps] : [];
  return (
    <div>
      {exp ? (
        <div className="grid grid-col-2">
          <div className="p-4">
            <div className="card w-full h-full max-auto shadow bg-base-100">
              <div className="card-body">
                <ExperimentSxsTable
                  experiments={exps}
                  current_exp_id={exp.id}
                />
              </div>
            </div>
          </div>
          <div className="col-start-2 p-4">
            <MetricCard exp_ids={exps.map((exp) => exp.id)} />
          </div>
          <div className="p-4">
            <SimulationReplayer exp_id={exp.id} />
          </div>
          <div className="p-4">
            <VariableMonitor env_id={exp.environment_id} exps={exps} />
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
