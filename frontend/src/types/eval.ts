type EvalRequest = {
  huggingface_repo_id: string;
  huggingface_filename: string;
  algorithm_name: string;
  env_ids: string[];
  num_episodes: number;
  num_steps_per_episode: number;
  project_name: string | null;
  project_description: string | null;
  experiment_name: string | null;
  experiment_description: string;
  experiment_configs: Record<string, any> | null;
  use_thread_pool: boolean;
  max_workers: number;
};

export type { EvalRequest };
