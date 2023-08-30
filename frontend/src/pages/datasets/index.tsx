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
            Load datasets given experiment IDs. You are all set to train your
            cross-domain-cross-embodiment foundation models.
          </p>
          <div className="card text-left">
            <div className="card-body">
              <h2 className="card-title">Single Dataset</h2>
              <div className="mockup-code">
                <pre>
                  <code>from loopquest.datasets import load_dataset</code>
                </pre>
                <pre>
                  <code>ds = load_dataset("exp_id", fetch_images=True)</code>
                </pre>
              </div>
            </div>
          </div>
          <div className="card text-left">
            <div className="card-body">
              <h2 className="card-title">Multiple Datasets</h2>
              <div className="mockup-code">
                <pre>
                  <code>from loopquest.datasets import load_datasets</code>
                </pre>
                <pre>
                  <code>
                    ds = load_datasets(["exp1", "exp2"], fetch_images=True)
                  </code>
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
