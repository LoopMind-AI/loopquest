import { createContext, useContext, useState } from "react";

type EvalContextType = {
  envIds: string[];
  setEnvIds: React.Dispatch<React.SetStateAction<string[]>>;
};

const EvalContext = createContext<EvalContextType>({} as EvalContextType);

export const EvalProvider = ({ children }: { children: any }) => {
  const [envIds, setEnvIds] = useState<string[]>([]);

  return (
    <EvalContext.Provider value={{ envIds, setEnvIds }}>
      {children}
    </EvalContext.Provider>
  );
};

export const useEvalContext = () => {
  return useContext(EvalContext);
};
