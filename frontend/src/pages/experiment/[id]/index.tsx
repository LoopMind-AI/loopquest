import { Experiment } from "@/types/experiment";
import { Environment } from "@/types/environment";
import ExperimentWorkspace from "@/components/experiment_workspace";
import EnvironmentCard from "@/components/environment_card";
import { GetServerSidePropsContext } from "next";
import { useState } from "react";
import ExperimentTable from "@/components/experiment_table";

export default function ExperimentPage({
  exp,
  env,
}: {
  exp: Experiment | null;
  env: Environment | null;
}) {
  const [activeTab, setActiveTab] = useState("Workspace");
  const [checkedExps, setCheckedExps] = useState<Experiment[]>(
    exp ? [exp] : []
  );

  return (
    <div className="drawer drawer-open">
      <input id="left-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col items-center justify-center">
        <div style={{ display: activeTab === "Workspace" ? "block" : "none" }}>
          <ExperimentWorkspace exp={exp} compExps={checkedExps} />
        </div>
        <div style={{ display: activeTab === "EnvInfo" ? "block" : "none" }}>
          {env ? <EnvironmentCard env={env} /> : null}
        </div>
        <div
          style={{ display: activeTab === "Experiments" ? "block" : "none" }}
        >
          {exp ? (
            <ExperimentTable
              user_id={exp.user_id}
              env_id={exp.environment_id}
              checkedExps={checkedExps}
              setCheckedExps={setCheckedExps}
              fetchExperiments={true}
            />
          ) : null}
        </div>
      </div>
      <div className="drawer-side">
        <label htmlFor="left-drawer" className="drawer-overlay"></label>
        <ul className="menu p-2 w-60 h-full bg-base-100 text-lg">
          <li>
            <a onClick={() => setActiveTab("Workspace")}>Workspace</a>
          </li>
          <li>
            <a onClick={() => setActiveTab("Experiments")}>Experiments</a>
          </li>
          <li>
            <a onClick={() => setActiveTab("EnvInfo")}>Environment Info</a>
          </li>
        </ul>
      </div>
    </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  if (process.env.BACKEND_URL === undefined) {
    return {
      props: { exp: null },
    };
  }
  const id = context.params?.id;
  if (id === undefined) {
    return {
      props: { exp: null },
    };
  }
  const exp_res = await fetch(`${process.env.BACKEND_URL}/exp/${id}`);
  if (!exp_res.ok) {
    return {
      props: { exp: null, env: null },
    };
  }
  const exp = await exp_res.json();
  const env_res = await fetch(
    `${process.env.BACKEND_URL}/env?id=${exp.environment_id}`
  );
  if (!env_res.ok) {
    return {
      props: { exp: exp, env: null },
    };
  }
  const env = await env_res.json();
  return {
    props: { exp: exp, env: env },
  };
}
