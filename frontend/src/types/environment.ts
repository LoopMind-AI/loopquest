type VarNode = {
  tree_path: string;
  path: string;
  name?: string;
  description?: string;
  spec?: string;
  children: VarNode[];
};

type Environment = {
  id: string;
  name: string;
  description?: string;
  creation_time: string;
  user_id?: string;
  gym_id?: string;
  env_spec?: string;
  action_metadata?: VarNode;
  observation_metadata?: VarNode;
  reward_upper_limit?: number;
  reward_lower_limit?: number;
  git_repo?: string;
  profile_image?: string;
};

export type { Environment, VarNode };
