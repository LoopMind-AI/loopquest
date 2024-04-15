import { Experiment } from "@/types/experiment";
import { formatDateTime } from "@/utils/time";
import { statusBadge } from "@/utils/status_badge";

export default function ExperimentTable({
  exps,
  checkedExps,
  setCheckedExps,
}: {
  exps: Experiment[];
  checkedExps: Experiment[];
  setCheckedExps: (exps: Experiment[]) => void;
}) {
  return (
    <div className="card bg-base-100">
      <div className="card-body">
        <div className="flex justify-between">
          <h2 className="card-title flex-1">Experiments</h2>
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
              {exps.map((exp) => (
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
                      className={`badge ${
                        statusBadge[exp.status]
                      } badge-outline font-medium`}
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
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
