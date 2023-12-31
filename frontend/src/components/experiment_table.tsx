import { Experiment } from "@/types/experiment";
import { formatDateTime } from "@/utils/time";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowsRotate } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect, useCallback } from "react";
import { statusBadge } from "@/utils/status_badge";

export default function ExperimentTable({
  user_id,
  env_id,
  checkedExps,
  setCheckedExps,
  fetchExperiments,
}: {
  user_id: string;
  env_id: string;
  checkedExps: Experiment[];
  setCheckedExps: (exps: Experiment[]) => void;
  fetchExperiments: boolean;
}) {
  const [experiments, setExperiments] = useState<Experiment[]>([]);
  const [loadingExperiments, setLoadingExperiments] = useState(false);

  const onRefresh = useCallback(() => {
    setLoadingExperiments(true);
    fetch("/api/exp/user/" + user_id + "/env/" + env_id)
      .then((response) => response.json())
      .then((data) => {
        setExperiments(data);
      })
      .catch((error) => console.log(error))
      .finally(() => setLoadingExperiments(false));
  }, [user_id, env_id, setExperiments, setLoadingExperiments]);

  useEffect(() => {
    onRefresh();
  }, [onRefresh, fetchExperiments]);

  return (
    <div>
      <div className="flex justify-between">
        <h2 className="card-title flex-1">Experiments</h2>
        <button
          className="flex-none btn btn-default bg-base-100 text-lg"
          onClick={onRefresh}
        >
          <FontAwesomeIcon icon={faArrowsRotate} />
        </button>
      </div>
      <div className="overflow-x-auto h-80">
        <table className="table table-pin-rows">
          {/* head */}
          <thead>
            <tr>
              <th></th>
              <th>ID</th>
              <th>Name</th>
              <th>Create Time</th>
              <th>Update Time</th>
              <th>Status</th>
              <th>Error Message</th>
            </tr>
          </thead>
          <tbody>
            {loadingExperiments ? (
              <tr>
                <td colSpan={7} className="text-center">
                  <span className="loading loading-infinity loading-lg"></span>
                </td>
              </tr>
            ) : (
              experiments.map((exp) => (
                <tr key={exp.id}>
                  <th>
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
                  </th>
                  <td>{exp.id}</td>
                  <td>{exp.name}</td>
                  <td>
                    {exp.creation_time ? formatDateTime(exp.creation_time) : ""}
                  </td>
                  <td>
                    {exp.update_time ? formatDateTime(exp.update_time) : ""}
                  </td>
                  <td>
                    <span
                      className={
                        "badge " + (exp.status ? statusBadge(exp.status) : "")
                      }
                    >
                      {exp.status}
                    </span>
                  </td>
                  <td>
                    {exp.error_message ? (
                      <div className="collapse bg-base-100">
                        <input type="checkbox" />
                        <div className="collapse-title">
                          Click to See the Error Message
                        </div>
                        <div className="collapse-content">
                          <p style={{ width: "200px" }}>{exp.error_message}</p>
                        </div>
                      </div>
                    ) : (
                      ""
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
