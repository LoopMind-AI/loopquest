import { useState, useEffect } from "react";
import { Experiment } from "@/types/experiment";
import { Environment } from "@/types/environment";
import { set } from "react-hook-form";

export default function StepwiseReplayer({
  exp,
  env,
}: {
  exp: Experiment;
  env: Environment;
}) {
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [episode, setEpisode] = useState(0);
  const [step, setStep] = useState(1);
  const [maxEpisode, setMaxEpisode] = useState<number | undefined>(undefined);
  const [maxStep, setMaxStep] = useState<number | undefined>(undefined);
  useEffect(() => {
    setStep(1);
    setEpisode(0);
  }, [env, exp]);

  useEffect(() => {
    const fetchMaxEpisode = async () => {
      fetch(`/api/step/exp/${exp.id}/env/${env.id}/eps/max`)
        .then((response) => response.json())
        .then((data) => {
          setMaxEpisode(data);
        })
        .catch((error) => console.log(error));
    };
    fetchMaxEpisode();
  }, [exp, env]);

  useEffect(() => {
    const fetchMaxStep = async () => {
      fetch(`/api/step/exp/${exp.id}/env/${env.id}/eps/${episode}/step/max`)
        .then((response) => response.json())
        .then((data) => {
          setMaxStep(data);
        })
        .catch((error) => console.log(error));
    };
    fetchMaxStep();
  }, [episode, exp, env]);

  useEffect(() => {
    const fetchImageUrls = async () => {
      fetch(`/api/step/${exp.id}-${env.id}-${episode}-${step}/image`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Network response was not ok");
          }
          return response.json();
        })
        .then((data) => {
          setImageUrls(data);
        })
        .catch((error) => {
          console.log(error);
        });
    };
    fetchImageUrls();
  }, [episode, step, exp, env]);

  return (
    <div className="card h-full max-auto bg-base-100 bordered m-3">
      <div className="card-body">
        <h2 className="card-title">
          {exp.name}
          <span className="badge badge-outline badge-neutral">{exp.id}</span>
        </h2>
        <label className="label">
          <span className="label-text font-bold">Episode {episode}</span>
          <span className="alt-text font-bold">{maxEpisode}</span>
        </label>
        <input
          type="range"
          min={0}
          max={maxEpisode}
          value={episode}
          className="range"
          onInput={(e) => {
            setEpisode(parseInt(e.currentTarget.value));
          }}
        />
        <label className="label">
          <span className="label-text font-bold">Step {step}</span>
          <span className="alt-text font-bold">{maxStep}</span>
        </label>
        <input
          type="range"
          min={1}
          max={maxStep}
          value={step}
          className="range"
          onInput={(e) => {
            setStep(parseInt(e.currentTarget.value));
          }}
        />
        {imageUrls.length === 0 ? (
          <div className="alert break-words">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="stroke-current shrink-0 h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            Image is not found, please make sure the environment has
            &quot;rgb_array&quot; or &quot;rgb_array_list&quot; mode and
            &quot;render&quot; method is called.
          </div>
        ) : (
          imageUrls.map((imageUrl) => (
            <img
              key={imageUrl}
              src={imageUrl}
              alt={`episode ${episode}, step ${step}`}
              width={500}
              height={500}
            ></img>
          ))
        )}
      </div>
    </div>
  );
}
