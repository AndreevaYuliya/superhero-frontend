import { Link, useNavigate, useParams } from "react-router";
import { useDetailsQuery, useRemoveMutation } from "../api/superheroesApi";

const SuperheroDetails = () => {
  const { id = "" } = useParams();

  const navigation = useNavigate();

  const heroId = Number(id);

  const { data } = useDetailsQuery(heroId);
  const [remove] = useRemoveMutation();

  if (!data) {
    return <div style={{ padding: 16 }}>Loading…</div>;
  }

  return (
    <div style={{ padding: 16 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 12,
        }}
      >
        <h2>{data.nickname}</h2>
        <div style={{ display: "flex", gap: 8 }}>
          <Link to={`/heroes/${id}/edit`}>Edit</Link>
          <button
            onClick={async () => {
              await remove(heroId);
              navigation("/heroes");
            }}
          >
            Delete
          </button>
        </div>
      </div>

      <p>
        <b>Real name:</b> {data.real_name}
      </p>
      <p>
        <b>Catch phrase:</b> {data.catch_phrase}
      </p>
      <p>
        <b>Origin:</b> {data.origin_description}
      </p>
      <p>
        <b>Superpowers:</b> {data.superpowers.join(", ") || "—"}
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, 180px)",
          gap: 12,
          marginTop: 12,
        }}
      >
        {data.images.map((img) => (
          <img
            key={img.id}
            src={img.image_url}
            width={180}
            height={180}
            style={{ objectFit: "cover", borderRadius: 8 }}
          />
        ))}
      </div>
    </div>
  );
};
