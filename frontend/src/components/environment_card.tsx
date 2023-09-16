import { Environment, VectorSpec } from "@/types/environment";
import VariableSpec from "@/components/variable_spec";
import { useState, useEffect } from "react";

export default function EnvironmentCard({ env }: { env: Environment }) {
  const [envSpecs, setEnvSpecs] = useState<Environment>(env);
  const [obsSpecs, setObsSpecs] = useState<VectorSpec[]>(
    env.observation_spec ?? []
  );
  const [actSpecs, setActSpecs] = useState<VectorSpec[]>(env.action_spec ?? []);
  useEffect(() => {
    setEnvSpecs((prevState) => {
      const newState = { ...prevState };
      newState.observation_spec = obsSpecs;
      newState.action_spec = actSpecs;
      return newState;
    });
  }, [obsSpecs, actSpecs]);
  const onSave = () => {
    fetch(`/api/env/${env.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(envSpecs),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        console.log("Environment saved successfully!");
      })
      .catch((error) => {
        console.error("There was a problem saving the environment:", error);
      });
  };

  return (
    <div className="card m-5">
      <div className="card-body">
        <h2 className="card-title">{envSpecs.name}</h2>
        <VariableSpec
          title="Observation Space"
          specs={obsSpecs}
          setSpecs={setObsSpecs}
          onSave={onSave}
        />
        <VariableSpec
          title="Action Space"
          specs={actSpecs}
          setSpecs={setActSpecs}
          onSave={onSave}
        />
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
