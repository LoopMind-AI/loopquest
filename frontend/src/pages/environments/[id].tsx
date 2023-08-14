import { useRouter } from "next/router";
import { Environment } from "@/types/environment";
import { useState } from "react";
import EnvironmentCard from "@/components/environment_card";
import ExperimentTab from "@/components/experiment_tab";

export default function Page({ env }: { env: Environment }) {
  const [activeTab, setActiveTab] = useState("Environment Card");
  const [fetchExperiments, setFetchExperiments] = useState(false);
  const router = useRouter();

  // This will handle the case when the page has not been generated yet.
  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  function handleTabClick(tabName: string) {
    setActiveTab(tabName);
  }

  function handleExperimentsTabClick() {
    handleTabClick("Experiments");
    setFetchExperiments((prevState) => !prevState);
  }

  function handleStartEvaluationClick() {
    handleTabClick("Evaluate");
  }

  return (
    <div className="card flex-shrink-0 max-w shadow-xl bg-base-100 m-5">
      <div className="card-body">
        <div className="flex flex-row">
          <div className="flex-1">
            <h1 className="text-3xl font-bold">{env.name}</h1>
            <p>Uploaded by {env.user_id}</p>
          </div>
          <div className="flex-none">
            <button
              className="btn btn-primary normal-case text-lg"
              onClick={handleStartEvaluationClick}
            >
              Start Evaluation
            </button>
          </div>
        </div>
        <div className="tabs">
          <a
            className={`tab tab-lg tab-bordered ${
              activeTab === "Environment Card" ? "tab-active" : ""
            }`}
            onClick={() => handleTabClick("Environment Card")}
          >
            Environment Card
          </a>
          <a
            className={`tab tab-lg tab-bordered ${
              activeTab === "Experiments" ? "tab-active" : ""
            }`}
            onClick={() => handleExperimentsTabClick()}
          >
            Experiments
          </a>
          <a
            className={`tab tab-lg tab-bordered ${
              activeTab === "Datasets" ? "tab-active" : ""
            }`}
            onClick={() => handleTabClick("Datasets")}
          >
            Datasets
          </a>
          <a
            className={`tab tab-lg tab-bordered ${
              activeTab === "Discuss" ? "tab-active" : ""
            }`}
            onClick={() => handleTabClick("Discuss")}
          >
            Discuss
          </a>
          <a
            className={`tab tab-lg tab-bordered ${
              activeTab === "LeaderBoard" ? "tab-active" : ""
            }`}
            onClick={() => handleTabClick("LeaderBoard")}
          >
            LeaderBoard
          </a>
        </div>
        <div className="card bg-base-200">
          <div
            style={{
              display: activeTab === "Environment Card" ? "block" : "none",
            }}
          >
            <EnvironmentCard env={env} />
          </div>
          <div
            style={{ display: activeTab === "Experiments" ? "block" : "none" }}
          >
            <ExperimentTab
              user_id={"jinyuxie"}
              env={env}
              fetchExperiments={fetchExperiments}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export async function getStaticPaths() {
  // When this is true (in preview environments) don't
  // prerender any static pages
  // (faster builds, but slower initial page load)
  if (process.env.SKIP_BUILD_STATIC_GENERATION) {
    return {
      paths: [],
      fallback: "blocking",
    };
  }

  // Call an external API endpoint to get posts
  if (!process.env.BACKEND_URL) {
    return { paths: [], fallback: false };
  }
  const url = process.env.BACKEND_URL + "/environment/all/basic";
  const res = await fetch(url);
  if (!res.ok) {
    return { paths: [], fallback: false };
  }
  const envs = await res.json();

  // Get the paths we want to prerender based on posts
  // In production environments, prerender all pages
  // (slower builds, but faster initial page load)
  const paths = envs.map((env: Environment) => ({
    params: { id: env.id },
  }));

  // { fallback: false } means other routes should 404
  return { paths, fallback: false };
}

export const getStaticProps = async ({
  params,
}: {
  params: { id: string };
}) => {
  const url = process.env.BACKEND_URL + "/environment/" + params.id;
  try {
    const res = await fetch(url);
    const data = await res.json();
    return {
      props: {
        env: data,
      },
      revalidate: 10,
    };
  } catch (error) {
    console.error(error);
    return {
      props: {
        env: {},
      },
      revalidate: 10,
    };
  }
};
