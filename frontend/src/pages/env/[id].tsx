import { useRouter } from "next/router";
import { Environment } from "@/types/environment";
import { useState } from "react";
import { GetServerSidePropsContext } from "next";
import EnvironmentCard from "@/components/environment_card";
import Leaderboard from "@/components/leaderboard";
import { ExpRewardStats } from "@/types/leaderboard";
import { Experiment } from "@/types/experiment";
import { useEvalContext } from "@/context/eval_context";

export default function EnvPage({
  env,
  rewards,
}: {
  env: Environment;
  rewards: ExpRewardStats[];
}) {
  const { envIds, setEnvIds } = useEvalContext();
  const [activeTab, setActiveTab] = useState("EnvCard");
  const router = useRouter();

  // This will handle the case when the page has not been generated yet.
  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  function handleTabClick(tabName: string) {
    setActiveTab(tabName);
  }

  function handleStartEvaluationClick() {
    if (envIds.includes(env.id)) {
      return;
    }
    setEnvIds([...envIds, env.id]);
  }

  return (
    <div className="bg-base-100">
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
              Add To Project
            </button>
          </div>
        </div>
        <div className="tabs">
          <a
            className={`tab tab-lg tab-bordered ${
              activeTab === "EnvCard" ? "tab-active" : ""
            }`}
            onClick={() => handleTabClick("EnvCard")}
          >
            Environment Card
          </a>
          <a
            className={`tab tab-lg tab-bordered ${
              activeTab === "Datasets" ? "tab-active" : ""
            }`}
            onClick={() => handleTabClick("Datasets")}
          >
            Datasets / Leaderboard
          </a>
        </div>
        <div className="card bg-base-200">
          {activeTab === "EnvCard" && <EnvironmentCard env={env} />}
          {activeTab === "Datasets" && <Leaderboard rewards={rewards} />}
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  if (process.env.BACKEND_URL === undefined) {
    return {
      props: { env: {} as Environment, rewards: [] },
    };
  }

  const env_id = context.params?.id;

  const env_res = await fetch(`${process.env.BACKEND_URL}/env/${env_id}`);
  if (!env_res.ok) {
    return {
      props: { env: {} as Environment, rewards: [] },
    };
  }
  const env: Environment = await env_res.json();

  const exp_res = await fetch(`${process.env.BACKEND_URL}/exp/env/${env_id}`);
  if (!exp_res.ok) {
    return {
      props: { env: env, rewards: [] },
    };
  }

  const exps: Experiment[] = await exp_res.json();
  const rewards: ExpRewardStats[] = (
    await Promise.all(
      exps.map(async (exp) => {
        const res = await fetch(
          `${process.env.BACKEND_URL}/step/exp/${exp.id}/env/${env_id}/reward/stats`
        );
        if (!res.ok) {
          return {
            exp: exp,
            reward_mean: null,
            reward_std: null,
          };
        }
        const reward_stats = await res.json();
        return {
          exp: exp,
          reward_mean: reward_stats.mean_reward,
          reward_std: reward_stats.std_reward,
        };
      })
    )
  ).sort((a, b) => b.reward_mean - a.reward_mean);

  return { props: { env, rewards } };
}
