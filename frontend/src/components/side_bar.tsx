import { useDatasetContext } from "@/context/dataset_context";
import { Experiment } from "@/types/experiment";
import React from "react";

export default function SideBar({
  exps,
  activeTab,
  setActiveTab,
  checkedExps,
  setCheckedExps,
}: {
  exps: Experiment[];
  activeTab: string;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
  checkedExps: Experiment[];
  setCheckedExps: React.Dispatch<React.SetStateAction<Experiment[]>>;
}) {
  const { expIds, setExpIds } = useDatasetContext();
  return (
    <div className="drawer-side bg-base-100">
      <label htmlFor="left-drawer" className="drawer-overlay"></label>
      <div>
        <ul className="menu p-2 w-60 h-full bg-base-100 text-lg">
          <li>
            <a
              onClick={() => setActiveTab("Workspace")}
              className={activeTab === "Workspace" ? "btn-neutral rounded" : ""}
            >
              Workspace
            </a>
          </li>
          <li>
            <a
              onClick={() => setActiveTab("Metrics")}
              className={activeTab === "Metrics" ? "btn-neutral rounded" : ""}
            >
              Metrics
            </a>
          </li>
          <li>
            <a
              className={
                activeTab === "Experiments" ? "btn-neutral rounded" : ""
              }
              onClick={() => setActiveTab("Experiments")}
            >
              Experiments
            </a>
          </li>
          <li>
            <a
              className={
                activeTab === "Environments" ? "btn-neutral rounded" : ""
              }
              onClick={() => setActiveTab("Environments")}
            >
              Environments
            </a>
          </li>
        </ul>
      </div>
      <div className="border-t-2 border-gray-200"></div>
      <div className="card bg-base-100">
        <div className="card-body">
          <div className="card-title">Select Experiments</div>
          <table className="table bg-base-100">
            <tbody>
              {exps.map((exp) => (
                <tr key={exp.id}>
                  <td>
                    <label>
                      <input
                        type="checkbox"
                        className="checkbox"
                        checked={checkedExps
                          .map((exp) => exp.id)
                          .includes(exp.id)}
                        onChange={(event) => {
                          const isChecked = event.target.checked;
                          if (isChecked) {
                            setCheckedExps([...checkedExps, exp]);
                          } else {
                            setCheckedExps(
                              checkedExps.filter((key) => key.id !== exp.id)
                            );
                          }
                        }}
                      />
                    </label>
                  </td>
                  <td>{exp.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="card-actions">
            <button
              className="btn btn-neutral"
              onClick={() => {
                const expIdsToAdd = checkedExps
                  .filter((exp) => !expIds.includes(exp.id))
                  .map((exp) => exp.id);
                setExpIds([...expIds].concat(expIdsToAdd));
              }}
            >
              Add To Datasets
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
