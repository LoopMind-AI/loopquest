import { Environment } from "@/types/environment";
import VariableSpec from "@/components/variable_spec";

export default function EnvironmentCard({ env }: { env: Environment }) {
  return (
    <div className="card m-5">
      <div className="card-body">
        <h2 className="card-title">{env.name}</h2>
        <VariableSpec title="Observation Space" specs={env.observation_spec} />
        <VariableSpec title="Action Space" specs={env.action_spec} />
        <div className="card bg-base-100 max-w m-3">
          <div className="card-body">
            <h2 className="card-title">Detailed Env Specs</h2>
            <p>{env.env_spec}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
