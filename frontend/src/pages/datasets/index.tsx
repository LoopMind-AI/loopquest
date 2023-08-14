import Link from "next/link";

export default function Datasets() {
  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content text-center">
        <div className="max-w-xl">
          <h1 className="text-5xl font-bold">
            Observation data should come with action labels.
          </h1>
          <p className="py-6">
            Cross-domain-cross-embodiment robotics data in one schema for
            robotics foundation model training.
          </p>
          <button className="btn btn-neutral normal-case text-lg rounded-full">
            <Link href="/waitlist">Join Waitlist</Link>
          </button>
        </div>
      </div>
    </div>
  );
}
