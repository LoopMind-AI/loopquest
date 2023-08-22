import Link from "next/link";
import { Experiment } from "@/types/experiment";
import { formatDateTime } from "@/utils/time";
import { statusBadge } from "@/utils/status_badge";

export default function Home({ exps }: { exps: Experiment[] }) {
  return (
    <div>
      <div className="card h-full shadow bg-base-100 m-5">
        <div className="card-body">
          <h2 className="card-title">Experiments</h2>
          <table className="table table-pin-rows">
            {/* head */}
            <thead>
              <tr>
                <th>Experiment ID</th>
                <th>Experiment Name</th>
                <th>Environment ID</th>
                <th>Create Time</th>
                <th>Update Time</th>
                <th>Status</th>
              </tr>
            </thead>
            {/* body */}
            {exps.map((exp) => (
              <tbody key={exp.id}>
                <tr>
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
