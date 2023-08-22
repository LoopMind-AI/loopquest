import { useState, useEffect } from "react";
import Image from "next/image";
import { Experiment } from "@/types/experiment";
import StepwiseReplayer from "./stepwise_replayer";

export default function SimulationReplayer({ exps }: { exps: Experiment[] }) {
  return (
    <div className="card bg-base-100">
      <div className="card-body">
        <h2 className="card-title">Simulation Replayer</h2>
        <div className="flex justify-center">
          {exps.map((exp) => (
            <StepwiseReplayer key={exp.id} exp={exp} />
          ))}
        </div>
      </div>
    </div>
  );
}
