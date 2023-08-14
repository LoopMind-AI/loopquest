type Goal = {
  text: string;
  image?: string[];
  video?: string[];
  observation?: number | string[];
};

type ExperimentCreate = {
  environment_id: string;
  agent_id: string;
  user_id: string;
  num_episodes?: number;
  num_steps?: number;
  name?: string;
  start_time?: string;
  sample_time?: string;
  random_seed?: number;
  environment_configs?: string;
  agent_configs?: string;
  goal?: Goal;
};

type Experiment = ExperimentCreate & {
  id: string;
  creation_time: string;
  update_time?: string;
  status?: string;
  error_message?: string;
};

export type { ExperimentCreate, Experiment };
