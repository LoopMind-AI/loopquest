import { useState, useEffect } from "react";
import Image from "next/image";

export default function SimulationReplayer({ exp_id }: { exp_id: string }) {
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
      fetch(`/api/step/experiment/${exp_id}/episode/${episode}/step/max`)
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
        `/api/step/experiment/${exp_id}/episode/${episode}/step/${step}/image`
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
    <div className="card h-full max-auto shadow bg-base-100">
      <div className="card-body">
        <h2 className="card-title">Simulation Replayer</h2>
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
        {imageUrls.map((imageUrl) => (
          <Image
            key={imageUrl}
            src={imageUrl}
            alt={`episode ${episode}, step ${step}`}
            width={500}
            height={500}
          />
        ))}
      </div>
    </div>
  );
}
