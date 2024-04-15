import React, { useState, ChangeEvent, FormEvent } from "react";
import { EvalRequest } from "@/types/eval";

export default function EvalForm({
  envIds,
}: {
  envIds: string[];
  evalRequest: EvalRequest;
  setEvalRequest: React.Dispatch<React.SetStateAction<EvalRequest>>;
}) {
  const [evalRequest, setEvalRequest] = useState<EvalRequest>({
    huggingface_repo_id: "",
    huggingface_filename: "",
    algorithm_name: "PPO",
    env_ids: envIds,
    num_episodes: 10,
    num_steps_per_episode: 1000,
    project_name: "",
    project_description: "",
    experiment_name: "",
    experiment_description: "",
    experiment_configs: {},
    use_thread_pool: true,
    max_workers: 10,
  });
  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setEvalRequest({
      ...evalRequest,
      [name]: value,
    });
  };

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const res = await fetch("/api/eval", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(evalRequest),
    });
    if (res.ok) {
      alert("Evaluation Experiment started successfully!");
    } else {
      alert("Failed to start Evaluation Experiment!");
    }
  }

  return (
    <div className="card">
      <div className="card-body">
        <h2 className="card-title">Start an Evaluation Experiment</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label className="label justify-start">
              Environment IDs:
              <label className="font-bold p-2">{envIds.join(", ")}</label>
            </label>
          </div>
          <div>
            <label className="label">Huggingface Repo ID:</label>
            <input
              className="input input-bordered"
              type="text"
              name="huggingface_repo_id"
              value={evalRequest.huggingface_repo_id}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label className="label">Huggingface Filename:</label>
            <input
              className="input input-bordered"
              type="text"
              name="huggingface_filename"
              value={evalRequest.huggingface_filename}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label className="label">Algorithm Name:</label>
            <select
              className="select select-bordered"
              name="algorithm_name"
              value={evalRequest.algorithm_name}
              onChange={(e) =>
                setEvalRequest({
                  ...evalRequest,
                  algorithm_name: e.target.value,
                })
              }
              required
            >
              <option value="PPO">PPO</option>
              <option value="DQN">DQN</option>
              <option value="SAC">SAC</option>
              <option value="A2C">TD3</option>
            </select>
          </div>
          <div>
            <label className="label">Number of Episodes:</label>
            <input
              className="input input-bordered"
              type="number"
              name="num_episodes"
              value={evalRequest.num_episodes}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label className="label">Number of Steps per Episode:</label>
            <input
              className="input input-bordered"
              type="number"
              name="num_steps_per_episode"
              value={evalRequest.num_steps_per_episode}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label className="label">Project Name:</label>
            <input
              className="input input-bordered"
              type="text"
              name="project_name"
              value={evalRequest.project_name || ""}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label className="label">Project Description:</label>
            <textarea
              className="textarea textarea-bordered"
              name="project_description"
              value={evalRequest.project_description || ""}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label className="label">Experiment Name:</label>
            <input
              className="input input-bordered"
              type="text"
              name="experiment_name"
              value={evalRequest.experiment_name || ""}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label className="label">Experiment Description:</label>
            <textarea
              className="textarea textarea-bordered"
              name="experiment_description"
              value={evalRequest.experiment_description}
              onChange={handleInputChange}
            />
          </div>
          <div className="flex justify-end">
            <button className="btn btn-primary" type="submit">
              Run
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
