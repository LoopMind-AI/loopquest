import Link from "next/link";
import { Experiment } from "@/types/experiment";
import { Project } from "@/types/project";
import { GetServerSidePropsContext } from "next";
import { useState } from "react";
import ExperimentWorkspace from "@/components/experiment_workspace";
import EnvironmentTab from "@/components/environment_tab";
import ExperimentTab from "@/components/experiment_tab";
import MetricsTab from "@/components/metrics_tab";
import SideBar from "@/components/side_bar";
import { Environment } from "@/types/environment";
import moment from "moment";

export default function ProjectHome({
  proj,
  exps,
  envs,
}: {
  proj: Project | null;
  exps: Experiment[];
  envs: Environment[];
}) {
  const [activeTab, setActiveTab] = useState("Workspace");
  const [checkedExps, setCheckedExps] = useState<Experiment[]>(
    exps.length > 0 ? [exps[0]] : []
  );
  const [currEnv, setCurrEnv] = useState<Environment>(
    envs.length > 0 ? envs[0] : ({} as Environment)
  );

  return (
    <div className="drawer drawer-open">
      <input id="left-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col m-4">
        <div className="breadcrumbs m-5">
          <ul>
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <Link href={`/project/${proj?.id}`}>Project {proj?.name}</Link>
            </li>
            {activeTab === "Workspace" && (
              <li>
                {proj && proj.environment_ids && (
                  <select
                    value={currEnv.id}
                    className="select select-primary bg-base-200"
                    onChange={(e) => {
                      const envId = e.target.value;
                      const newEnv = envs.find((env) => env.id === envId);
                      if (newEnv) {
                        setCurrEnv(newEnv);
                      }
                    }}
                  >
                    {proj.environment_ids.map((env_id) => {
                      return (
                        <option key={env_id} value={env_id}>
                          {env_id}
                        </option>
                      );
                    })}
                  </select>
                )}
              </li>
            )}
          </ul>
        </div>
        {activeTab === "Workspace" && (
          <ExperimentWorkspace exps={checkedExps} env={currEnv} />
        )}
        {activeTab === "Experiments" && (
          <ExperimentTab
            exps={exps}
            checkedExps={checkedExps}
            setCheckedExps={setCheckedExps}
          />
        )}
        {activeTab === "Environments" && <EnvironmentTab envs={envs} />}
        {activeTab === "Metrics" && (
          <MetricsTab
            exps={exps}
            envs={envs}
            setActiveTab={setActiveTab}
            setCheckedExps={setCheckedExps}
            setCurrEnv={setCurrEnv}
          />
        )}
      </div>
      <SideBar
        exps={exps}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        checkedExps={checkedExps}
        setCheckedExps={setCheckedExps}
      />
    </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  if (process.env.BACKEND_URL === undefined) {
    return {
      props: { proj: null, exps: [] },
    };
  }

  const proj_id = context.params?.proj_id;
  if (proj_id === undefined) {
    return {
      props: { proj: null, exps: [], envs: [] },
    };
  }

  const proj_res = await fetch(`${process.env.BACKEND_URL}/project/${proj_id}`);
  if (!proj_res.ok) {
    return {
      props: { proj: null, exps: [], envs: [] },
    };
  }
  const proj = await proj_res.json();

  const exp_promises = proj.experiment_ids.map(async (exp_id: string) => {
    const exp_res = await fetch(`${process.env.BACKEND_URL}/exp/${exp_id}`);
    return await exp_res.json();
  });
  // Sort from newest to oldest.
  const exps = (await Promise.all(exp_promises)).sort((exp1, exp2) => {
    const time1 = moment(exp1.update_time);
    const time2 = moment(exp2.update_time);
    const timedelta = time2.diff(time1);
    return timedelta;
  });

  const env_promises = proj.environment_ids.map(async (env_id: string) => {
    const env_res = await fetch(`${process.env.BACKEND_URL}/env/${env_id}`);
    return await env_res.json();
  });
  const envs = await Promise.all(env_promises);

  return { props: { proj, exps, envs } };
}
