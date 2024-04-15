import Link from "next/link";
import { Project } from "@/types/project";
import { formatDateTime } from "@/utils/time";
import { useMemo, useState } from "react";

export default function Home({ projects }: { projects: Project[] }) {
  const rowsPerPage = 10;
  const [page, setPage] = useState(1);
  const displayProjects = useMemo(() => {
    return projects.slice((page - 1) * rowsPerPage, page * rowsPerPage);
  }, [projects, page]);
  const totalPages = useMemo(() => {
    return Math.ceil(projects.length / rowsPerPage);
  }, [projects]);
  const pageNumbers = useMemo(() => {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }, [totalPages]);

  return (
    <div>
      <div className="card shadow bg-base-100 m-5 overflow-x-auto h-full">
        <div className="card-body">
          <h2 className="card-title">Projects</h2>
          <table className="table table-pin-rows">
            {/* head */}
            <thead>
              <tr>
                <th></th>
                <th>Project ID</th>
                <th>Project Name</th>
                <th>Environments</th>
                <th>Create Time</th>
                <th>Update Time</th>
              </tr>
            </thead>
            {/* body */}
            {displayProjects.map((project) => (
              <tbody key={project.id}>
                <tr>
                  <th></th>
                  <td>
                    <Link href={`/project/${project.id}`}>{project.id}</Link>
                  </td>
                  <td>
                    <Link href={`/project/${project.id}`}>{project.name}</Link>
                  </td>
                  <td>
                    {project.environment_ids
                      ? project.environment_ids.join(", ")
                      : ""}
                  </td>
                  <td>{formatDateTime(project.creation_time)}</td>
                  <td>
                    {project.update_time
                      ? formatDateTime(project.update_time)
                      : ""}
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
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps() {
  if (process.env.BACKEND_URL === undefined) {
    return {
      props: { projects: [] },
    };
  }
  // User id is hardcoded to "local_user" for local instance.
  const url = `${process.env.BACKEND_URL}/project/user/local_user`;
  const res = await fetch(url);
  const projects = await res.json();
  return { props: { projects } };
}
