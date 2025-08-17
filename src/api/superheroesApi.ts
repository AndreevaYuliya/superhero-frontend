import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export type Superhero = {
  id: number;
  nickname: string;
  real_name: string;
  origin_description: string;
  superpowers: string[];
  catch_phrase: string;
  images: { id: number; image_url: string }[];
};

export const superheroesApi = createApi({
  reducerPath: "superheroesApi",
  baseQuery: fetchBaseQuery({ baseUrl: process.env.API_URL }),
  tagTypes: ["Superheroes", "Superhero"],
  endpoints: (b) => ({
    list: b.query<
      {
        items: {
          id: number;
          nickname: string;
          images?: { _id: number; url: string }[];
        }[];
        total: number;
        limit: number;
        offset: number;
      },
      { limit?: number; offset?: number }
    >({
      query: ({ limit = 5, offset = 0 }) =>
        `superheroes?limit=${limit}&offset=${offset}`,
      providesTags: (r) =>
        r
          ? [
              { type: "Superheroes", id: "LIST" },
              ...r.items.map((i) => ({ type: "Superhero" as const, id: i.id })),
            ]
          : [{ type: "Superheroes", id: "LIST" }],
    }),
    details: b.query<Superhero, number>({
      query: (id) => `superheroes/${id}`,
      transformResponse: (r: any): Superhero => ({
        ...r,
        superpowers: String(r.superpowers || "")
          .split(",")
          .map((s: string) => s.trim())
          .filter(Boolean),
      }),
      providesTags: (r) => (r ? [{ type: "Superhero", id: r.id }] : []),
    }),
    create: b.mutation<
      Superhero,
      {
        data: Omit<Superhero, "id" | "images" | "superpowers"> & {
          superpowers: string[];
        };
        files: File[];
      }
    >({
      query: ({ data, files }) => {
        const form = new FormData();
        form.append("data", JSON.stringify(data));
        files.forEach((f) => form.append("images", f));
        return { url: "superheroes", method: "POST", body: form };
      },
      invalidatesTags: [{ type: "Superheroes", id: "LIST" }],
    }),
    update: b.mutation<
      Superhero,
      {
        id: number;
        data: Omit<Superhero, "id" | "images" | "superpowers"> & {
          superpowers: string[];
        };
        retainImageIds: number[];
        files: File[];
      }
    >({
      query: ({ id, data, retainImageIds, files }) => {
        const form = new FormData();
        form.append("data", JSON.stringify({ ...data, retainImageIds }));
        files.forEach((f) => form.append("images", f));
        return { url: `superheroes/${id}`, method: "PUT", body: form };
      },
      invalidatesTags: (r) =>
        r
          ? [
              { type: "Superheroes", id: "LIST" },
              { type: "Superhero", id: r.id },
            ]
          : [],
    }),
    remove: b.mutation<void, number>({
      query: (id) => ({ url: `superheroes/${id}`, method: "DELETE" }),
      invalidatesTags: [{ type: "Superheroes", id: "LIST" }],
    }),
    removeImage: b.mutation<void, { id: number; imageId: number }>({
      query: ({ id, imageId }) => ({
        url: `superheroes/${id}/images/${imageId}`,
        method: "DELETE",
      }),
      invalidatesTags: (_, __, args) => [{ type: "Superhero", id: args.id }],
    }),
  }),
});

export const {
  useListQuery,
  useDetailsQuery,
  useCreateMutation,
  useUpdateMutation,
  useRemoveMutation,
  useRemoveImageMutation,
} = superheroesApi;
