import Link from "next/link";
import Image from "next/image";
import DatasetDownload from "./dataset_download";
import EvalProject from "./eval_project";

export default function Navbar() {
  return (
    <div className="navbar z-50 bg-base-100 sticky top-0 border">
      <div className="navbar-start">
        <Link
          href="https://loopquest.ai"
          target="_blank"
          className="btn btn-ghost normal-case text-xl"
        >
          <span role="img">{String.fromCodePoint(0x1f4dc)}</span> LoopQuest
        </Link>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 text-lg">
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <Link href="/envs">Environments</Link>
          </li>
          <li>
            <Link href="/docs">Docs</Link>
          </li>
          <li>
            <Link href="/about">About</Link>
          </li>
          <li>
            <Link
              href="https://discord.gg/FTnFYeSy9r"
              target="_blank"
              className="btn btn-ghost"
            >
              <Image src="/discord.svg" alt="Discord" width={30} height={30} />
            </Link>
          </li>
        </ul>
      </div>
      <div className="navbar-end justify-end">
        <div className="flex">
          <div className="p-1">
            <EvalProject />
          </div>
          <div className="p-1">
            <DatasetDownload />
          </div>
        </div>
        {/* <div className="label">Local Instance</div> */}
      </div>
    </div>
  );
}
