export default function ExperimentStream({
  stream,
  image,
}: {
  stream: boolean;
  image: string;
}) {
  return (
    <div className="card h-full max-auto shadow bg-base-100">
      <div className="card-body">
        <h2 className="card-title">Live Stream</h2>
        {stream ? (
          <figure>
            {image && (
              <img src={`data:image/jpeg;base64,${image}`} alt="streaming" />
            )}
          </figure>
        ) : (
          <p>Render is not turned on or not available right now.</p>
        )}
      </div>
    </div>
  );
}
