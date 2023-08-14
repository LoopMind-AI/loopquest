import CreateExperiment from "./experiment_create";
import VariableMonitor from "./variable_monitor";
import ExperimentStream from "./experiment_stream";
import MetricCard from "./metric_card";
import ExperimentProgress from "./experiment_progress";
import { useState, useRef, useEffect } from "react";
import { Experiment } from "@/types/experiment";
import { Environment } from "@/types/environment";

interface EvaluateTabProps {
  env: Environment;
  agent_id: string;
  user_id: string;
}

export default function EvaluateTab({
  env,
  agent_id,
  user_id,
}: EvaluateTabProps) {
  const [image, setImage] = useState("");
  const [currentStep, setCurrentStep] = useState(0);
  const [earlyStopReason, setEarlyStopReason] = useState("");
  const [stream, setStream] = useState(false);
  const [exp, setExp] = useState<Experiment | undefined>(undefined);
  const [expFinished, setExpFinished] = useState(false);
  const [selectedCompareExps, setSelectedCompareExps] = useState<Experiment[]>(
    []
  );
  const eventSource = useRef<EventSource | null>(null);

  const onRunExperiment = () => {
    if (!exp) {
      return;
    }
    eventSource.current = new EventSource(
      `/api/experiment/${exp.id}/run?stream_image=${stream}`
    );

    eventSource.current.onmessage = (event) => {
      let step_data = "";
      let image_data = "";
      if (stream) {
        const data_array = event.data.split("\n");
        image_data = data_array[0];
        step_data = data_array[1];
      } else {
        step_data = event.data;
      }
      if (
        step_data === "FINISHED" ||
        step_data === "TERMINATED" ||
        step_data === "TRUNCATED"
      ) {
        if (step_data === "TERMINATED" || step_data === "TRUNCATED") {
          setEarlyStopReason(step_data);
        }
        setExpFinished(true);
        eventSource.current?.close();
        return;
      }

      const step = parseInt(step_data);
      if (stream) {
        setImage(image_data);
      }
      setCurrentStep(step);
    };
  };

  useEffect(() => {
    return () => {
      if (eventSource.current) {
        eventSource.current.close();
      }
    };
  }, []);

  return (
    <div className="grid grid-col-2">
      <div className="row-span-2 p-4">
        <CreateExperiment
          env={env}
          agent_id={agent_id}
          user_id={user_id}
          stream={stream}
          setStream={setStream}
          exp={exp}
          setExp={setExp}
          selectedCompareExps={selectedCompareExps}
          setSelectedCompareExps={setSelectedCompareExps}
          onRunExperiment={onRunExperiment}
          expFinished={expFinished}
          setExpFinished={setExpFinished}
        />
      </div>
      <div className="col-start-2 p-4">
        <MetricCard
          exp_ids={selectedCompareExps.map((exp) => exp.id)}
          refreshSignal={currentStep}
        />
      </div>
      <div className="col-start-2 p-4">
        <ExperimentProgress
          currentStep={currentStep}
          num_steps={exp?.num_steps ? exp.num_steps : 0}
          earlyStopReason={earlyStopReason}
        />
      </div>
      <div className="p-4">
        <ExperimentStream stream={stream} image={image} />
      </div>
      <div className="p-4">
        <VariableMonitor env_id={env.id} exps={selectedCompareExps} />
      </div>
    </div>
  );
}
