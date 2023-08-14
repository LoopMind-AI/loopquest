type ScalarInfo = {
  name?: string;
  description?: string;
};

type VectorSpec = {
  name?: string;
  space: string;
  size: number;
  var_info?: ScalarInfo[];
};

type Environment = {
  id: string;
  name: string;
  description?: string;
  creation_time: string;
  user_id?: string;
  gym_id?: string;
  env_spec?: string;
  action_spec?: VectorSpec[];
  observation_spec?: VectorSpec[];
  reward_upper_limit?: number;
  reward_lower_limit?: number;
  git_repo?: string;
  profile_image?: string;
};

export type { Environment, VectorSpec };
