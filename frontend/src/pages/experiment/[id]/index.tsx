import { Experiment } from "@/types/experiment";
import ExperimentWorkspace from "@/components/experiment_workspace";

export default function ExperimentPage({ exp }: { exp: Experiment | null }) {
  return (
    <div className="drawer drawer-open">
      <input id="left-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content flex flex-col items-center justify-center">
        <ExperimentWorkspace exp={exp} compExps={[]} />
      </div>
      <div className="drawer-side">
        <label htmlFor="left-drawer" className="drawer-overlay"></label>
        <ul className="menu p-2 w-60 h-full bg-base-100 text-lg">
          <li>
            <a>Workspace</a>
          </li>
          <li>
            <a>Environment Info</a>
          </li>
        </ul>
      </div>
    </div>
  );
}

import { GetServerSidePropsContext } from "next";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  if (process.env.BACKEND_URL === undefined) {
    return {
      props: { exp: null },
    };
  }
  const { id } = context.params;
  const res = await fetch(`${process.env.BACKEND_URL}/exp/${id}`);
  if (!res.ok) {
    return {
      props: { exp: null },
    };
  }
  const exp = await res.json();
  return {
    props: { exp },
  };
}
