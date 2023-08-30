import { useState, useEffect } from "react";
import Image from "next/image";
import { Experiment } from "@/types/experiment";

export default function StepwiseReplayer({ exp }: { exp: Experiment }) {
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [episode, setEpisode] = useState(0);
  const [step, setStep] = useState(0);
  // const [maxEpisode, setMaxEpisode] = useState<number | undefined>(undefined);
  const [maxStep, setMaxStep] = useState<number | undefined>(undefined);

  // useEffect(() => {
  //   const fetchMaxEpisode = async () => {
  //     fetch(`/api/step/experiment/${exp_id}/episode/max`)
  //       .then((response) => response.json())
  //       .then((data) => {
  //         setMaxEpisode(data);
  //       })
  //       .catch((error) => console.log(error));
  //   };
  //   fetchMaxEpisode();
  // }, []);

  useEffect(() => {
    const fetchMaxStep = async () => {
      fetch(`/api/step/experiment/${exp.id}/episode/${episode}/step/max`)
        .then((response) => response.json())
        .then((data) => {
          setMaxStep(data);
        })
        .catch((error) => console.log(error));
    };
    fetchMaxStep();
  }, [episode]);

  useEffect(() => {
    const fetchImageUrls = async () => {
      fetch(
        `/api/step/experiment/${exp.id}/episode/${episode}/step/${step}/image`
      )
        .then((response) => response.json())
        .then((data) => {
          setImageUrls(data);
        })
        .catch((error) => console.log(error));
    };
    fetchImageUrls();
  }, [episode, step]);

  return (
    <div className="card h-full max-auto bg-base-100 bordered m-3">
      <div className="card-body">
        <h2 className="card-title">
          {exp.name}
          <span className="badge badge-outline badge-neutral">{exp.id}</span>
        </h2>
        {/* TODO: add episode slider. */}
        {/* <label className="label">
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
        /> */}
        <label className="label">
          <span className="label-text font-bold">Step {step}</span>
          <span className="alt-text font-bold">{maxStep}</span>
        </label>
        <input
          type="range"
          min={0}
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
            Image is not found, please make sure the environment has "rgb_array"
            or "rgb_array_list" mode and "render" method is called.
          </div>
        ) : (
          imageUrls.map((imageUrl) => (
            <Image
              key={imageUrl}
              src={imageUrl}
              alt={`episode ${episode}, step ${step}`}
              width={500}
              height={500}
            />
          ))
        )}
      </div>
    </div>
  );
}
