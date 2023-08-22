import React from "react";
import { VectorSpec } from "@/types/environment";

interface Props {
  title: string;
  specs?: VectorSpec[];
}

export default function VariableSpec(props: Props) {
  return (
    <div className="card flex-shrink-0 max-w bg-base-100 m-3">
      <div className="card-body">
        <h2 className="card-title">{props.title}</h2>
        {props.specs?.map((spec, i) => (
          <div key={i}>
            <p>{spec.space}</p>
            <div className="card flex-shrink-0 shadow m-10">
              <table className="table table-zebra">
                <thead>
                  <tr>
                    <th></th>
                    <th>Name</th>
                    <th>Description</th>
                  </tr>
                </thead>
                <tbody>
                  {spec.var_info?.slice(0, 50).map((var_info, i) => (
                    <tr key={i}>
                      <th>{i + 1}</th>
                      <td>
                        <input
                          type="text"
                          className="input input-bordered w-full max-w-xs"
                          placeholder="Add Varible Name"
                          defaultValue={var_info.name ?? ""}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="input input-bordered w-full max-w-xs"
                          placeholder="Add Variable Description"
                          defaultValue={var_info.description ?? ""}
                        />
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
