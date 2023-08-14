export default function About() {
  return (
    <div>
      <div className="hero min-h-screen bg-base-200">
        <div className="hero-content text-center">
          <div className="max-w-xl">
            <h1 className="text-3xl font-bold">Our Mission</h1>
            <p className="py-6">
              Enrich and organize the world&apos;s decision-making data and make
              it universally available to accelerate the era of the Artificial
              General Intelligence (AGI) that interacts with the physical world
              to prosper the humanity.
            </p>
            <h1 className="text-3xl font-bold">Team</h1>
            <p className="py-6">
              We are a small team who share the beliefs of AI can prosper the
              humanity by interacting with the physical world if it is deployed
              responsibly.
              <br />
              Inspired? Come{" "}
              <a
                className="link link-primary"
                href="mailto:contactus@loopmind.ai"
              >
                Join us!
              </a>
            </p>
            <h1 className="text-3xl font-bold">Contact</h1>
            <p className="py-6">
              Join our{" "}
              <a
                className="link link-primary"
                href="https://discord.gg/FTnFYeSy9r"
                target="_blank"
              >
                Discord Community
              </a>
              , or send us email at{" "}
              <a
                className="link link-primary"
                href="mailto:contactus@loopmind.ai"
              >
                contactus@loopmind.ai
              </a>
              .
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
