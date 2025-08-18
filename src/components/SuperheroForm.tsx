import { useNavigate, useParams } from "react-router";
import {
  useCreateMutation,
  useDetailsQuery,
  useRemoveImageMutation,
  useUpdateMutation,
} from "../api/superheroesApi";
import { useEffect, useState } from "react";

const SuperheroForm = () => {
  const { id } = useParams();

  const navigation = useNavigate();

  const [createHero] = useCreateMutation();
  const [updateHero] = useUpdateMutation();
  const [removeImage] = useRemoveImageMutation();

  const isEdit = Boolean(id);
  const heroId = Number(id);
  const { data } = useDetailsQuery(heroId, { skip: !isEdit });

  const [form, setForm] = useState({
    nickname: "",
    real_name: "",
    origin_description: "",
    superpowers: "" as string, // comma-separated in UI
    catch_phrase: "",
  });

  const [files, setFiles] = useState<File[]>([]);
  const [retainImageIds, setRetainImageIds] = useState<number[]>([]);

useEffect(() => {
  if (data) {
    setForm({
      nickname: data.nickname,
      real_name: data.real_name,
      origin_description: data.origin_description,
      superpowers: Array.isArray(data.superpowers)
        ? data.superpowers.join(", ")
        : data.superpowers || "",
      catch_phrase: data.catch_phrase,
    });
    setRetainImageIds(data.images.map((i) => i.id));
  }
}, [data]);


const onSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  const payload = {
    nickname: form.nickname.trim(),
    real_name: form.real_name.trim(),
    origin_description: form.origin_description.trim(),
    superpowers: form.superpowers
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean),
    catch_phrase: form.catch_phrase.trim(),
  };

  try {
    if (isEdit && heroId) {
      await updateHero({
        id: heroId,
        data: payload as any,
        retainImageIds,
        files,
      }).unwrap();
      navigation('/heroes');
    } else {
      const created = await createHero({
        data: payload as any,
        files,
      }).unwrap();
      navigation(`/superheroes/${created.id}`);
    }
  } catch (err: any) {
    console.error("Error while saving hero:", err);
    alert("Failed to save hero: " + JSON.stringify(err));
  }
};


  return (
    <form onSubmit={onSubmit} style={{ padding: 16, display: "grid", gap: 12 }}>
      <h2>{isEdit ? "Edit" : "Create"} Superhero</h2>

      {["nickname", "real_name", "catch_phrase"].map((k) => (
        <label key={k}>
          {k.replace("_", " ")}
          <br />
          <input
            value={(form as any)[k]}
            onChange={(e) => setForm({ ...form, [k]: e.target.value })}
            required={k !== "catch_phrase"}
          />
        </label>
      ))}
      <label>
        origin_description
        <br />
        <textarea
          value={form.origin_description}
          onChange={(e) =>
            setForm({ ...form, origin_description: e.target.value })
          }
          required
          rows={4}
        />
      </label>
      <label>
        superpowers (comma-separated)
        <br />
        <input
          value={form.superpowers}
          onChange={(e) => setForm({ ...form, superpowers: e.target.value })}
        />
      </label>

      {isEdit && data && (
        <>
          <div>
            <b>Existing images</b>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {data.images.map((img) => {
              const kept = retainImageIds.includes(img.id);
              return (
                <div key={img.id} style={{ position: "relative" }}>
                  <img
                    src={`http://localhost:4000${img.image_url}`}
                    width={120}
                    height={120}
                    style={{
                      objectFit: "cover",
                      opacity: kept ? 1 : 0.4,
                      borderRadius: 8,
                    }}
                  />
                  <div style={{ display: "flex", gap: 6, marginTop: 4 }}>
                    <button
                      type="button"
                      onClick={() =>
                        setRetainImageIds((prev) =>
                          prev.includes(img.id)
                            ? prev.filter((i) => i !== img.id)
                            : [...prev, img.id]
                        )
                      }
                    >
                      {kept ? "Keep" : "Restore"}
                    </button>
                    <button
                      type="button"
                      onClick={async () => {
                        await removeImage({ id: data.id, imageId: img.id });
                        setRetainImageIds(prev => prev.filter(i => i !== img.id));
                      }}
                    >
                      Delete now
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      <label>
        New images
        <br />
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={(e) => setFiles(Array.from(e.target.files || []))}
        />
      </label>

      {files.length > 0 && (
  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
    {files.map((f, i) => (
      <div key={i} style={{ textAlign: "center" }}>
        <img
          src={URL.createObjectURL(f)}
          alt={f.name}
          width={100}
          height={100}
          style={{ objectFit: "cover", borderRadius: 8 }}
        />
        <div style={{ fontSize: 12 }}>{f.name}</div>
      </div>
    ))}
  </div>
)}


      <div style={{ display: "flex", gap: 8 }}>
        <button type="submit">{isEdit ? "Save changes" : "Create"}</button>
        <button type="button" onClick={() => navigation(-1)}>
          Cancel
        </button>
      </div>
    </form>
  );
};

export default SuperheroForm;