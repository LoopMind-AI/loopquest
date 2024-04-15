type ProjectCreate = {
  name: string;
  user_id: string;
  description?: string;
  experiment_ids?: string[];
  experiment_names?: string[];
  environment_ids?: string[];
};

type Project = ProjectCreate & {
  id: string;
  creation_time: string;
  update_time?: string;
};

export type { ProjectCreate, Project };
