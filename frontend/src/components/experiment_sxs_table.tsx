import { Experiment } from "@/types/experiment";

export default function ExperimentSxsTable({
  experiments,
  current_exp_id,
}: {
  experiments: Experiment[];
  current_exp_id?: string;
}) {
  experiments.forEach((exp) => console.log(JSON.stringify(exp?.configs)));
  return (
    <div className="card bg-base-100">
      <div className="card-body">
        <h2 className="card-title">Experiment Comparison</h2>
        <table className="table">
          <tbody>
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
            <tr>
              <th>Name</th>
              {experiments.map((exp) => (
                <th key={exp.id}>{exp?.name}</th>
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
              <th>Configs</th>
              {experiments.map((exp) => (
                <th key={exp.id}>{JSON.stringify(exp?.configs, null, 4)}</th>
              ))}
            </tr>
            <tr>
              <th>Policy Repo ID</th>
              {experiments.map((exp) => (
                <th key={exp.id}>{exp.policy_repo_id}</th>
              ))}
            </tr>
            <tr>
              <th>Policy Filename</th>
              {experiments.map((exp) => (
                <th key={exp.id}>{exp.policy_filename}</th>
              ))}
            </tr>
            <tr>
              <th>Random Seed</th>
              {experiments.map((exp) => (
                <th key={exp.id}>{exp.random_seed}</th>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
