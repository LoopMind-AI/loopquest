import React from "react";
import { VectorSpec } from "@/types/environment";

const VAR_DISP_LIMIT = 50;

export default function VariableSpec({
  title,
  specs,
  setSpecs,
  onSave,
}: {
  title: string;
  specs: VectorSpec[];
  setSpecs: React.Dispatch<React.SetStateAction<VectorSpec[]>>;
  onSave: () => void;
}) {
  const [isEditing, setIsEditing] = React.useState<boolean[]>(
    specs.map(() => false) ?? []
  );
  const handleEditSubmitClick = (i: number) => {
    setIsEditing((prevIsEditing) => {
      const newIsEditing = [...prevIsEditing];
      newIsEditing[i] = !prevIsEditing[i];
      if (!newIsEditing[i]) {
        onSave();
      }
      return newIsEditing;
    });
  };

  return (
    <div className="card flex-shrink-0 max-w bg-base-100 m-3">
      <div className="card-body">
        <h2 className="card-title">{title}</h2>
        {specs.map((spec, i) => (
          <div key={i}>
            <code className="bg-base-200">{spec.space}</code>
            <div className="card flex-shrink-0 m-10">
              <table className="table table-zebra">
                <thead>
                  <tr>
                    <th></th>
                    <th>Name</th>
                    <th>Description</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {spec.var_info
                    ?.slice(0, VAR_DISP_LIMIT)
                    .map((var_info, j) => (
                      <tr key={j}>
                        <th>{j + 1}</th>
                        <td>
                          {isEditing[j] ? (
                            <input
                              type="text"
                              className="input w-full max-w-xs bg-transparent input-bordered"
                              placeholder="Add Variable Name"
                              defaultValue={var_info.name ?? ""}
                              onBlur={(event) => {
                                setSpecs((prevState) => {
                                  const newState = JSON.parse(
                                    JSON.stringify(prevState)
                                  );

                                  newState[i].var_info[j].name =
                                    event.target.value;
                                  return newState;
                                });
                              }}
                            />
                          ) : (
                            <p>{var_info.name}</p>
                          )}
                        </td>
                        <td>
                          {isEditing[j] ? (
                            <textarea
                              className="input w-full max-w-xs bg-transparent input-bordered"
                              placeholder="Add Variable Description"
                              defaultValue={var_info.description ?? ""}
                              readOnly={!isEditing[j]}
                              onBlur={(event) => {
                                setSpecs((prevState) => {
                                  const newState = JSON.parse(
                                    JSON.stringify(prevState)
                                  );

                                  newState[i].var_info[j].description =
                                    event.target.value;
                                  return newState;
                                });
                              }}
                            />
                          ) : (
                            <p>{var_info.description}</p>
                          )}
                        </td>
                        <td>
                          <button
                            className="btn btn-sm btn-ghost normal-case"
                            onClick={() => handleEditSubmitClick(j)}
                          >
                            {isEditing[j] ? "Save" : "Edit"}
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
