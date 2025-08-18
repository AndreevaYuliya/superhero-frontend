// src/api/superheroesApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export type SuperheroListItem = {
  id: number;
  nickname: string;
  image?: string; // single image for list
};

export type Superhero = {
  id: number;
  nickname: string;
  real_name: string;
  origin_description: string;
  superpowers: string | string[];
  catch_phrase: string;
  images: { id: number; image_url: string }[]; // full images for details
};

export const superheroesApi = createApi({
  reducerPath: "superheroesApi",
  baseQuery: fetchBaseQuery({ baseUrl: process.env.REACT_APP_API_URL }),
  tagTypes: ["Superheroes", "Superhero"],
  endpoints: (b) => ({
    list: b.query<
  { items: SuperheroListItem[]; total: number; limit: number; page: number },
  { limit?: number; page?: number }
>({
  query: ({ limit = 5, page = 1 }) => `heroes?limit=${limit}&page=${page}`,
  transformResponse: (res: any, meta, arg) => ({
    items: (res.items || []).map((h: any) => ({
      id: h.id,
      nickname: h.nickname,
      image: h.image, // only first image
    })),
    total: res.total,
    limit: res.limit,
    page: arg.page ?? 1, // ✅ use arg.page here
  }),
      providesTags: (res) =>
        res
          ? [
              { type: "Superheroes", id: "LIST" },
              ...res.items.map((i) => ({ type: "Superhero" as const, id: i.id })),
            ]
          : [{ type: "Superheroes", id: "LIST" }],
    }),

    details: b.query<Superhero, number>({
      query: (id) => `heroes/${id}`,
      transformResponse: (r: any): Superhero => ({
        ...r,
        superpowers: String(r.superpowers || "")
          .split(",")
          .map((s: string) => s.trim())
          .filter(Boolean),
      }),
      providesTags: (_, __, id) => [{ type: "Superhero", id }],    }),

    create: b.mutation<
      Superhero,
      { data: Omit<Superhero, "id" | "images" | "superpowers"> & { superpowers: string[] }; files: File[] }
    >({
      query: ({ data, files }) => {
        const form = new FormData();
        Object.entries(data).forEach(([k, v]) => {
          if (Array.isArray(v)) {
            v.forEach((val) => form.append(k, val));
          } else {
            form.append(k, v as any);
          }
        });
        files.forEach((f) => form.append("images", f));
        return { url: "heroes", method: "POST", body: form };
      },
      invalidatesTags: [{ type: "Superheroes", id: "LIST" }],
    }),

   update: b.mutation<
  Superhero,
  {
    id: number;
    data: Omit<Superhero, "id" | "images" | "superpowers"> & { superpowers: string[] };
    retainImageIds: number[];
    files: File[];
  }
>({
  query: ({ id, data, retainImageIds, files }) => {
    const form = new FormData();

    Object.entries(data).forEach(([k, v]) => {
      if (Array.isArray(v)) {
        v.forEach((val) => form.append(k, String(val)));
      } else {
        form.append(k, String(v));
      }
    });

    // 👇 отправляем JSON-строкой
    form.append("retainImageIds", JSON.stringify(retainImageIds));

    files.forEach((f) => form.append("images", f));

    return { url: `heroes/${id}`, method: "PUT", body: form };
  },
  invalidatesTags: (r) =>
    r ? [{ type: "Superheroes", id: "LIST" }, { type: "Superhero", id: r.id }] : [],
}),


    remove: b.mutation<void, number>({
      query: (id) => ({ url: `heroes/${id}`, method: "DELETE" }),
      invalidatesTags: [{ type: "Superheroes", id: "LIST" }],
    }),

    removeImage: b.mutation<void, { id: number; imageId: number }>({
  query: ({ id, imageId }) => ({
    url: `heroes/${id}/images/${imageId}`,
    method: "DELETE",
  }),
  // ⚡ Оптимистично выкидываем картинку из кэша деталей
  async onQueryStarted({ id, imageId }, { dispatch, queryFulfilled }) {
    const patch = dispatch(
      superheroesApi.util.updateQueryData("details", id, (draft) => {
        draft.images = draft.images.filter((img: any) => img.id !== imageId);
      })
    );
    try {
      await queryFulfilled; // сервер ок — оставляем патч
    } catch {
      patch.undo(); // сервер упал — откатываем
    }
  },
  // Можно оставить для надёжности, чтобы потом подтянуть свежие данные
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
