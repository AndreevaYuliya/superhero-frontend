import { Link, useSearchParams } from "react-router";
import Pagination from "./Pagination";
import { useListQuery } from "../api/superheroesApi";

const SuperheroList = () => {
  const [params, setParams] = useSearchParams();

  const page = Number(params.get("page") || "1");
  const limit = 5;
  const offset = (page - 1) * limit;

  const { data, isFetching } = useListQuery({ limit, page });

  console.log(data)

  return (
    <div style={{ padding: 16 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 12,
        }}
      >
        <h2>Superheroes</h2>
        <Link to="/heroes/new">+ Create</Link>
      </div>

      {isFetching && <div>Loading…</div>}

      <div style={{ display: "grid", gap: 12 }}>
{(data?.items ?? []).map((h) => {
  console.log("Hero image:", h.image);
  return (
    <Link
      key={h.id}
      to={`/heroes/${h.id}`}
      style={{ textDecoration: "none", color: "inherit" }}
    >
      <div
        style={{
          border: "1px solid #ddd",
          borderRadius: 8,
          padding: 12,
          display: "flex",
          gap: 12,
        }}
      >
       <img
          src={h.image ? `http://localhost:4000${h.image}` : "http://via.placeholder.com/100x100?text=No+Image"}
            alt={h.nickname}
            width={100}
            height={100}
            style={{ objectFit: "cover", borderRadius: 8 }}
        />

        <div>
          <div style={{ fontWeight: 700 }}>{h.nickname}</div>
        </div>
      </div>
    </Link>
  );
})}


      </div>

      <Pagination
        page={page}
        pageSize={limit}
        total={data?.total || 0}
        onPageChange={(p) => setParams({ page: String(p) })}
      />
    </div>
  );
};

export default SuperheroList;
