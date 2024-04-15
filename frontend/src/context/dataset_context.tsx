import { createContext, useContext, useState } from "react";

type DatasetContextType = {
  expIds: string[];
  setExpIds: React.Dispatch<React.SetStateAction<string[]>>;
};

const DatasetContext = createContext<DatasetContextType>(
  {} as DatasetContextType
);

export const DatasetProvider = ({ children }: { children: any }) => {
  const [expIds, setExpIds] = useState<string[]>([]);

  return (
    <DatasetContext.Provider value={{ expIds, setExpIds }}>
      {children}
    </DatasetContext.Provider>
  );
};

export const useDatasetContext = () => {
  return useContext(DatasetContext);
};
