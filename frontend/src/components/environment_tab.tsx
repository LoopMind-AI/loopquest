import EnvironmentCard from "./environment_card";
import { Environment } from "@/types/environment";

export default function EnvironmentTab({ envs }: { envs: Environment[] }) {
  return (
    <div className="card">
      <div className="card-body">
        <div className="card-title">Environments</div>
        <div className="join join-vertical w-full bg-base-100">
          {envs.map((env) => (
            <div className="collapse collapse-arrow join-item border border-base-300">
              <input type="checkbox" name="my-accordion-4" />
              <div className="collapse-title text-lg font-bold">{env.id}</div>
              <div className="collapse-content">
                <EnvironmentCard env={env} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
