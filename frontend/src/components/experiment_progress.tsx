export default function ExperimentProgress({
  currentStep,
  num_steps,
  earlyStopReason,
}: {
  currentStep: number;
  num_steps: number;
  earlyStopReason: string;
}) {
  return (
    <div className="card h-full max-auto shadow bg-base-100">
      <div className="card-body">
        <h2 className="card-title">Progress</h2>
        <p>
          Step <b>{currentStep}</b> / {num_steps}
        </p>
        <progress
          className="progress w-56"
          value={num_steps === 0 ? 0 : (currentStep / num_steps) * 100}
          max="100"
        ></progress>
        {earlyStopReason && (
          <p style={{ color: "red" }}>
            The evaluation is <b>{earlyStopReason}</b>.
          </p>
        )}
      </div>
    </div>
  );
}
