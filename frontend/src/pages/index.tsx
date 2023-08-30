import Link from "next/link";
import { Experiment } from "@/types/experiment";
import { formatDateTime } from "@/utils/time";
import { statusBadge } from "@/utils/status_badge";
import { useMemo, useState } from "react";
import DatasetDownload from "@/components/dataset_download";

export default function Home({ exps }: { exps: Experiment[] }) {
  const rowsPerPage = 10;
  const [page, setPage] = useState(1);
  const [checkedExps, setCheckedExps] = useState<Experiment[]>([]);
  const displayExps = useMemo(() => {
    return exps.slice((page - 1) * rowsPerPage, page * rowsPerPage);
  }, [exps, page]);
  console.log(exps.length);
  const totalPages = useMemo(() => {
    return Math.ceil(exps.length / rowsPerPage);
  }, [exps]);
  const pageNumbers = useMemo(() => {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }, [totalPages]);

  return (
    <div>
      <div className="card shadow bg-base-100 m-5 overflow-x-auto h-full">
        <div className="card-body">
          <h2 className="card-title">Experiments</h2>
          <table className="table table-pin-rows">
            {/* head */}
            <thead>
              <tr>
                <th></th>
                <th>Experiment ID</th>
                <th>Experiment Name</th>
                <th>Environment ID</th>
                <th>Create Time</th>
                <th>Update Time</th>
                <th>Status</th>
              </tr>
            </thead>
            {/* body */}
            {displayExps.map((exp) => (
              <tbody key={exp.id}>
                <tr>
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
                  <td>
                    <Link href={`/experiment/${exp.id}`}>{exp.id}</Link>
                  </td>
                  <td>
                    <Link href={`/experiment/${exp.id}`}>{exp.name}</Link>
                  </td>
                  <td>{exp.environment_id}</td>
                  <td>{formatDateTime(exp.creation_time)}</td>
                  <td>
                    {exp.update_time ? formatDateTime(exp.update_time) : ""}
                  </td>
                  <td>
                    <div
                      className={
                        "badge " + (exp.status ? statusBadge(exp.status) : "")
                      }
                    >
                      {exp.status}
                    </div>
                  </td>
                </tr>
              </tbody>
            ))}
          </table>
          <div className="join justify-center">
            {pageNumbers.map((number) => (
              <button
                key={number}
                className={
                  "join-item btn" + (page === number ? " btn-active" : "")
                }
                onClick={() => setPage(number)}
              >
                {number}
              </button>
            ))}
          </div>
          <div className="card-actions justify-end">
            <DatasetDownload checkedExps={checkedExps} />
          </div>
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps() {
  if (process.env.BACKEND_URL === undefined) {
    return {
      props: { exp: null },
    };
  }
  // NOTE: This is a temporary solution to get all experiments. This will become
  // getting experiments by user_id in the future once the login functionalities
  // are implemented.
  const url = `${process.env.BACKEND_URL}/exp/all`;
  const res = await fetch(url);
  const exps = await res.json();
  return { props: { exps } };
}
