type ExperimentCreate = {
  project_id: string;
  user_id: string;
  environment_ids: string[];
  policy_repo_id?: string;
  policy_filename?: string;
  num_episodes?: number;
  num_steps?: number;
  name?: string;
  random_seed?: number;
  configs?: string;
};

type Experiment = ExperimentCreate & {
  id: string;
  creation_time: string;
  update_time?: string;
  status?: string;
  error_message?: string;
};

export type { ExperimentCreate, Experiment };
