import Link from "next/link";
import Image from "next/image";

export default function Navbar() {
  return (
    <div className="navbar z-50 bg-base-100 sticky top-0">
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
            <Link href="/datasets">Datasets</Link>
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
      <div className="navbar-end hidden lg:flex"></div>
    </div>
  );
}
