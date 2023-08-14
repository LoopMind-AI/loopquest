import { useState, useEffect } from "react";
import { Experiment } from "@/types/experiment";
import { useRouter } from "next/router";
import ExperimentSxsTable from "@/components/experiment_sxs_table";
import MetricCard from "@/components/metric_card";
import VariableMonitor from "@/components/variable_monitor";
import SimulationReplayer from "@/components/sim_replayer";

export default function ExperimentPage() {
  const [exp, setExp] = useState<Experiment | undefined>(undefined);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    if (!router.isReady) return;
    fetch(`/api/experiment/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setExp(data);
      })
      .catch((error) => console.log(error));
  }, [router.isReady]);

  return exp ? (
    <div className="grid grid-col-2">
      <div className="p-4">
        <div className="card w-full h-full max-auto shadow bg-base-100">
          <div className="card-body">
            <ExperimentSxsTable experiments={[exp]} current_exp_id={exp.id} />
          </div>
        </div>
      </div>
      <div className="col-start-2 p-4">
        <MetricCard exp_ids={[exp.id]} />
      </div>
      <div className="p-4">
        <SimulationReplayer exp_id={exp.id} />
      </div>
      <div className="p-4">
        <VariableMonitor env_id={exp.environment_id} exps={[exp]} />
      </div>
    </div>
  ) : (
    <div className="hero">
      <div className="text-center hero-content min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    </div>
  );
}
