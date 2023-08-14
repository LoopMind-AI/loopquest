import React, { useState } from "react";

function validateEmail(email: String) {
  var re =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

export default function Waitlist() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [employer, setEmployer] = useState("");
  const [howHeard, setHowHeard] = useState("");
  const [interestedFeature, setInterestedFeature] = useState("");
  const [usagePlan, setUsagePlan] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    const body = JSON.stringify({
      name: name,
      email: email,
      employer: employer,
      how_heard: howHeard,
      interested_feature: interestedFeature,
      usage_plan: usagePlan,
    });
    fetch("/api/waitlist", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: body,
    })
      .then((response) => {
        if (!response.ok) {
          alert(
            "Oops, something went wrong during the submission. Please try again later."
          );
          console.log(response);
          return;
        }
        setSubmitting(false);
        setSubmitted(true);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="hero min-h-screen bg-base-200">
      <div className="hero-content flex-col lg:flex-row-reverse">
        <div className="text-center lg:text-left">
          <h1 className="text-5xl font-bold">
            {submitted ? "Thank you!" : "Join Waitlist!"}
          </h1>
          <p className="py-6">
            {submitted
              ? "We have added you to our waitlist. You will hear from us soon!"
              : "We can't wait to invite you to try our product soon!"}
          </p>
        </div>
        <div className="card flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-bold">
                    Name <span style={{ color: "red" }}>*</span>
                  </span>
                </label>
                <input
                  type="text"
                  placeholder="name"
                  className="input input-bordered"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-bold">
                    Email <span style={{ color: "red" }}>*</span>
                  </span>
                </label>
                <input
                  type="text"
                  placeholder="email"
                  className="input input-bordered"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                {email === "" || validateEmail(email) ? null : (
                  <label className="label">
                    <span className="label-text font-bold">
                      <span style={{ color: "red" }}>
                        Please enter a valid email address.
                      </span>
                    </span>
                  </label>
                )}
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-bold">
                    Employer / Institution{" "}
                    <span style={{ color: "red" }}>*</span>
                  </span>
                </label>
                <input
                  type="text"
                  placeholder="employer / institution"
                  className="input input-bordered"
                  value={employer}
                  onChange={(e) => setEmployer(e.target.value)}
                  required
                />
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-bold">
                    How have you heard about us?{" "}
                    <span style={{ color: "red" }}>*</span>
                  </span>
                </label>
                <select
                  className="select select-bordered"
                  value={howHeard}
                  onChange={(e) => setHowHeard(e.target.value)}
                  required
                >
                  <option disabled value="">
                    Pick One
                  </option>
                  <option value="search_engine">Search Engine</option>
                  <option value="social_media">Social Media</option>
                  <option value="news_media">News / Media</option>
                  <option value="friend">From a friend</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-bold">
                    Which feature you are most interested in?{" "}
                    <span style={{ color: "red" }}>*</span>
                  </span>
                </label>
                <select
                  className="select select-bordered"
                  value={interestedFeature}
                  onChange={(e) => setInterestedFeature(e.target.value)}
                  required
                >
                  <option disabled value="">
                    Pick One
                  </option>
                  <option value="host_environments">
                    Host Environments / Benchmark / Competition
                  </option>
                  <option value="evaluate_agent">Evaluate your agent</option>
                  <option value="label_feedback">
                    Label human feedback during experiment replay
                  </option>
                  <option value="manage_experiments">
                    Manage experiments for A/B testing
                  </option>
                  <option value="access_datasets">
                    Access multi-task-multi-embodiment datasets
                  </option>
                  <option value="all">All</option>
                </select>
              </div>
              <div className="form-control">
                <label className="label">
                  <span className="label-text font-bold">
                    What do you plan to use our platform for?
                  </span>
                </label>
                <textarea
                  className="textarea textarea-bordered h-24"
                  placeholder=""
                  value={usagePlan}
                  onChange={(e) => setUsagePlan(e.target.value)}
                ></textarea>
              </div>
              <div className="form-control mt-6">
                <button className="btn btn-primary" disabled={submitted}>
                  {submitting ? (
                    <span className="loading loading-infinity loading-lg"></span>
                  ) : (
                    "Submit"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
