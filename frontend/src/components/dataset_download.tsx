import { Experiment } from "@/types/experiment";

export default function DatasetDownload({
  checkedExps,
}: {
  checkedExps: Experiment[];
}) {
  return (
    <div>
      <button
        className="btn btn-neutral"
        onClick={() => window.dataset_modal.showModal()}
      >
        Create Dataset
      </button>
      <dialog id="dataset_modal" className="modal">
        <form method="dialog" className="modal-box w-5/6 max-w-3xl">
          <h3 className="font-bold text-lg">Create dataset</h3>
          <p className="py-4">
            Copy the following code to create the dataset for trainig.
          </p>
          <div className="mockup-code">
            <pre>
              <code>from loopquest.datasets import load_datasets</code>
            </pre>
            <pre>
              <code>
                ds = load_datasets([
                {checkedExps.map((exp) => `"${exp.id}"`).join(", ")}],
                fetch_images=True)
              </code>
            </pre>
          </div>
          <div className="modal-action">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn">Close</button>
          </div>
        </form>
      </dialog>
    </div>
  );
}
