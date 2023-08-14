import { useForm, SubmitHandler } from "react-hook-form";
import { useState } from "react";
import { ExperimentCreate, Experiment } from "@/types/experiment";
import { Environment } from "@/types/environment";
import ExperimentInfo from "./experiment_info";

export default function CreateExperiment({
  env,
  agent_id,
  user_id,
  stream,
  setStream,
  exp,
  setExp,
  selectedCompareExps,
  setSelectedCompareExps,
  onRunExperiment,
  expFinished,
  setExpFinished,
}: {
  env: Environment;
  agent_id: string;
  user_id: string;
  stream: boolean;
  setStream: (stream: boolean) => void;
  exp: Experiment | undefined;
  setExp: (exp: Experiment | undefined) => void;
  selectedCompareExps: Experiment[];
  setSelectedCompareExps: (exps: Experiment[]) => void;
  onRunExperiment: () => void;
  expFinished: boolean;
  setExpFinished: (expFinished: boolean) => void;
}) {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ExperimentCreate>();

  const onSubmit: SubmitHandler<ExperimentCreate> = (data) => {
    data.environment_id = env.id;
    data.agent_id = agent_id;
    data.user_id = user_id;
    const body = JSON.stringify(data);
    fetch("/api/experiment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: body,
    })
      .then((response) => {
        if (!response.ok) {
          alert(
            "Oops, something went wrong during the submission. Please try again later."
          );
          console.log(response);
          return;
        }
        setExpFinished(false);
        setSubmitting(false);
        setSubmitted(true);
        return response.json();
      })
      .catch((error) => {
        console.log(error);
      })
      .then((data) => {
        setExp(data);
        setSelectedCompareExps([data]);
      });
  };

  return (
    <div className="card w-full max-auto shadow bg-base-100">
      <div className="card-body">
        {submitted ? (
          <ExperimentInfo
            env={env}
            user_id={user_id}
            exp={exp}
            selectedCompareExps={selectedCompareExps}
            setSelectedCompareExps={setSelectedCompareExps}
            setSubmitted={setSubmitted}
            onRunExperiment={onRunExperiment}
            expFinished={expFinished}
          />
        ) : (
          <div>
            <h2 className="card-title">Create Experiment</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div>
                <label className="label">
                  <span className="label-text font-bold">Name</span>
                </label>
                <input
                  className="input input-bordered"
                  type="text"
                  {...register("name")}
                />
              </div>
              <div>
                <label className="label">
                  <span className="label-text font-bold">
                    Number of Steps <span style={{ color: "red" }}>*</span>
                  </span>
                </label>
                <input
                  type="number"
                  className="input input-bordered"
                  {...register("num_steps", { required: true })}
                />
                {errors.num_steps && (
                  <label className="label">
                    <span className="label-text-alt" style={{ color: "red" }}>
                      This field is required
                    </span>
                  </label>
                )}
              </div>
              <label className="label grid grid-col-2">
                <span className="label-text font-bold">Render</span>
              </label>
              <input
                type="checkbox"
                checked={stream}
                className="checkbox"
                onChange={(e) => setStream(e.target.checked)}
              />
              {/* <div>
            <label className="label">Start Time</label>
            <input
              className="input input-bordered"
              type="datetime-local"
              {...register("start_time")}
            />
          </div>
          <div>
            <label className="label">Sample Time</label>
            <input
              className="input input-bordered"
              type="datetime-local"
              {...register("sample_time")}
            />
          </div>
          <div>
            <label className="label">Random Seed</label>
            <input
              className="input input-bordered"
              type="number"
              {...register("random_seed")}
            />
          </div>
          <div>
            <label className="label">Configs</label>
            <textarea {...register("configs")} />
          </div>
          <div>
            <label className="label">Agent Configs</label>
            <textarea {...register("agent_configs")} />
          </div>
          <div>
            <label className="label">Goal</label>
            <textarea {...register("goal")} />
          </div> */}
              <div className="card-actions justify-end">
                <button
                  className="btn btn-primary normal-case mt-6 text-lg"
                  type="submit"
                  disabled={submitted}
                >
                  {submitting ? (
                    <span className="loading loading-infinity loading-lg"></span>
                  ) : (
                    "Create Experiment"
                  )}
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
