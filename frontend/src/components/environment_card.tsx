import { Environment, VarNode } from "@/types/environment";
import VarTreeView from "@/components/variable_tree_view";
import { useState, useEffect } from "react";

export default function EnvironmentCard({ env }: { env: Environment }) {
  const [envInfo, setEnvInfo] = useState<Environment>(env);
  const [obsRootNode, setObsRootNode] = useState<VarNode>(
    env.observation_metadata
      ? env.observation_metadata
      : ({ path: "", tree_path: "", name: "" } as VarNode)
  );
  const [actRootNode, setActRootNode] = useState<VarNode>(
    env.action_metadata
      ? env.action_metadata
      : ({ path: "", tree_path: "", name: "" } as VarNode)
  );
  useEffect(() => {
    setEnvInfo((prevEnvInfo) => {
      if (
        prevEnvInfo.observation_metadata !== obsRootNode ||
        prevEnvInfo.action_metadata !== actRootNode
      ) {
        let newEnvInfo = { ...prevEnvInfo };
        newEnvInfo.observation_metadata = obsRootNode;
        newEnvInfo.action_metadata = actRootNode;

        fetch(`/api/env/${env.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newEnvInfo),
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
        return newEnvInfo;
      }
      return prevEnvInfo;
    });
  }, [obsRootNode, actRootNode]);

  return (
    <div className="card">
      <div className="card-body">
        <VarTreeView
          title={"Observations"}
          rootNode={obsRootNode}
          setRootNode={setObsRootNode}
        />
        <VarTreeView
          title={"Actions"}
          rootNode={actRootNode}
          setRootNode={setActRootNode}
        />
        <div className="card bg-base-100 bordered">
          <div className="card-body">
            <h2 className="card-title">Env Specs</h2>
            <p>{env.env_spec}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
