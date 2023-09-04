import { Experiment } from "@/types/experiment";
import { Environment } from "@/types/environment";
import ExperimentWorkspace from "@/components/experiment_workspace";
import EnvironmentCard from "@/components/environment_card";
import { GetServerSidePropsContext } from "next";
import { useState } from "react";
import ExperimentTable from "@/components/experiment_table";
import Link from "next/link";
import DatasetDownload from "@/components/dataset_download";

export default function ExperimentPage({
  exp,
  env,
}: {
  exp: Experiment | null;
  env: Environment | null;
}) {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [checkedExps, setCheckedExps] = useState<Experiment[]>(
    exp ? [exp] : []
  );

  return (
    <div className="drawer drawer-open">
      <input id="left-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col m-4">
        <div style={{ display: activeTab === "Dashboard" ? "block" : "none" }}>
          <div className="flex justify-between m-2">
            <div className="breadcrumbs">
              <ul>
                <li>
                  <Link href="/">Home</Link>
                </li>
                <li>
                  <a>{exp?.environment_id}</a>
                </li>
                <li>{exp?.name}</li>
              </ul>
            </div>
            <button
              className="btn btn-primary"
              onClick={() => setActiveTab("Experiments")}
            >
              Compare
            </button>
          </div>
          <ExperimentWorkspace exp={exp} compExps={checkedExps} />
        </div>
        <div style={{ display: activeTab === "EnvInfo" ? "block" : "none" }}>
          {env ? <EnvironmentCard env={env} /> : null}
        </div>
        <div
          style={{ display: activeTab === "Experiments" ? "block" : "none" }}
        >
          {exp ? (
            <div className="card bg-base-100">
              <div className="card-body">
                <ExperimentTable
                  user_id={exp.user_id}
                  env_id={exp.environment_id}
                  checkedExps={checkedExps}
                  setCheckedExps={setCheckedExps}
                  fetchExperiments={false}
                />
                <div className="card-actions justfiy-end">
                  <DatasetDownload checkedExps={checkedExps} />
                  <button
                    className="btn btn-primary"
                    onClick={() => setActiveTab("Dashboard")}
                  >
                    Compare
                  </button>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
      <div className="drawer-side">
        <label htmlFor="left-drawer" className="drawer-overlay"></label>
        <ul className="menu p-2 w-60 h-full bg-base-100 text-lg">
          <li>
            <a
              onClick={() => setActiveTab("Dashboard")}
              className={activeTab === "Dashboard" ? "btn-neutral rounded" : ""}
            >
              Dashboard
            </a>
          </li>
          <li>
            <a
              className={
                activeTab === "Experiments" ? "btn-neutral rounded" : ""
              }
              onClick={() => setActiveTab("Experiments")}
            >
              Experiments
            </a>
          </li>
          <li>
            <a
              className={activeTab === "EnvInfo" ? "btn-neutral rounded" : ""}
              onClick={() => setActiveTab("EnvInfo")}
            >
              Environment Info
            </a>
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
    `${process.env.BACKEND_URL}/env/${exp.environment_id}`
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
