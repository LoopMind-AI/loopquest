import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content text-center">
        <div className="max-w-xxl">
          {/*
           Not sure if Embodied AI is easy to understand or not.
           <h1 className="text-5xl font-bold">The Embodied AI Training and Evaluation Platform</h1> */}
          <h1 className="text-5xl font-bold">
            A Data-Centric Robotics AI Training and Evaluation Platform
          </h1>
          <p className="py-6">
            We host simulation environments and organize the world&apos;s data
            with action labels for robotics foundation model training.
          </p>
          <ul className="space-x-4">
            <button className="btn btn-outline btn-primary normal-case rounded-full text-lg">
              <Link href="/environments">Environments</Link>
            </button>
            <button className="btn btn-outline btn-primary normal-case rounded-full text-lg">
              <Link href="/datasets">Datasets</Link>
            </button>
          </ul>
          <button className="btn btn-neutral normal-case text-xl rounded-full mt-6">
            <Link href="/waitlist">Join Waitlist</Link>
          </button>
        </div>
      </div>
    </div>
  );
}
