import { useState, useRef, useEffect } from "react";
import { useEvalContext } from "@/context/eval_context";
import EvalForm from "./eval_form";
import { EvalRequest } from "@/types/eval";

export default function EvalProject() {
  const { envIds } = useEvalContext();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalRef = useRef<HTMLDialogElement | null>(null);

  useEffect(() => {
    if (!modalRef.current) return;
    if (isModalOpen) {
      modalRef.current.showModal();
    } else if (modalRef.current.open) {
      modalRef.current.close();
    }
  }, [isModalOpen]);

  return (
    <div>
      <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
        Run Evaluation
        {envIds.length > 0 && (
          <div className="badge badge-secondary ">{envIds.length}</div>
        )}
      </button>
      {isModalOpen && (
        <dialog ref={modalRef} className="modal">
          <div className="modal-box w-5/6 max-w-3xl">
            <EvalForm
              envIds={envIds}
              evalRequest={evalRequest}
              setEvalRequest={setEvalRequest}
            />

            <div className="modal-action">
              {/* if there is a button in form, it will close the modal */}
              <button className="btn" onClick={() => setIsModalOpen(false)}>
                Close
              </button>
              <button
                className="btn"
                onClick={() => {
                  setEnvIds([]);
                  setIsModalOpen(false);
                }}
              >
                Clear Environments
              </button>
            </div>
          </div>
        </dialog>
      )}
    </div>
  );
}
