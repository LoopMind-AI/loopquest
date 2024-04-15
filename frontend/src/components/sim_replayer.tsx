import Image from "next/image";
import { Experiment } from "@/types/experiment";
import StepwiseReplayer from "./stepwise_replayer";
import { Environment } from "@/types/environment";

export default function SimulationReplayer({
  exps,
  env,
}: {
  exps: Experiment[];
  env: Environment;
}) {
  return (
    <div className="card bg-base-100">
      <div className="card-body">
        <h2 className="card-title">Simulation Replayer</h2>
        <div className="flex justify-center">
          {exps.map((exp) => (
            <StepwiseReplayer key={exp.id} exp={exp} env={env} />
          ))}
        </div>
      </div>
    </div>
  );
}
