import { Environment } from "@/types/environment";
import VariableSpec from "@/components/variable_spec";

interface Props {
  env: Environment;
}

export default function EnvironmentCard(props: Props) {
  return (
    <div>
      <VariableSpec
        title="Observation Space"
        specs={props.env.observation_spec}
      />
      <VariableSpec title="Action Space" specs={props.env.action_spec} />
      <div className="card flex-shrink-0 bg-base-100 m-5">
        <div className="card-body">
          <h2 className="card-title">Detailed Env Specs</h2>
          <p>{props.env.env_spec}</p>
        </div>
      </div>
    </div>
  );
}
