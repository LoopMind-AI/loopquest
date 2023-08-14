import { Experiment } from "@/types/experiment";

export default function ExperimentSxsTable({
  experiments,
  current_exp_id,
}: {
  experiments: Experiment[];
  current_exp_id?: string;
}) {
  return (
    <table className="table">
      <thead>
        <tr>
          <th>ID</th>
          {experiments.map((exp) => (
            <th key={exp.id}>
              {exp?.id}{" "}
              {current_exp_id && exp.id === current_exp_id && (
                <span className="badge badge-primary badge-outline">
                  Current
                </span>
              )}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        <tr>
          <th>Name</th>
          {experiments.map((exp) => (
            <th key={exp.id}>{exp?.name}</th>
          ))}
        </tr>
        <tr>
          <th>Environment ID</th>
          {experiments.map((exp) => (
            <th key={exp.id}>{exp?.environment_id}</th>
          ))}
        </tr>
        <tr>
          <th>Environment Configs</th>
          {experiments.map((exp) => (
            <th key={exp.id}>{exp?.environment_configs}</th>
          ))}
        </tr>
        <tr>
          <th>Agent ID</th>
          {experiments.map((exp) => (
            <th key={exp.id}>{exp?.agent_id}</th>
          ))}
        </tr>
        <tr>
          <th>Agent Configs</th>
          {experiments.map((exp) => (
            <th key={exp.id}>{exp?.agent_configs}</th>
          ))}
        </tr>
        <tr>
          <th>Num Episodes</th>
          {experiments.map((exp) => (
            <th key={exp.id}>{exp?.num_episodes}</th>
          ))}
        </tr>
        <tr>
          <th>Num Steps</th>
          {experiments.map((exp) => (
            <th key={exp.id}>{exp?.num_steps}</th>
          ))}
        </tr>
        <tr>
          <th>Goal</th>
          {experiments.map((exp) => (
            <th key={exp.id}>
              <pre>{JSON.stringify(exp?.goal, null, 2)}</pre>
            </th>
          ))}
        </tr>
      </tbody>
    </table>
  );
}
