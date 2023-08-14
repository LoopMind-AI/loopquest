type NamedData = {
  name: string;
  value: number[];
};

type VariableData = {
  label: string;
  data: NamedData[];
};

export type { VariableData };
