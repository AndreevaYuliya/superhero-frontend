import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import {
	ListQueryParams,
	RemoveImageArgs,
	Superhero,
	SuperheroListItem,
	SuperheroListResponse,
} from '../types/types';

export const superheroesApi = createApi({
	reducerPath: 'superheroesApi',
	baseQuery: fetchBaseQuery({ baseUrl: process.env.REACT_APP_API_URL }),
	tagTypes: ['Superheroes', 'Superhero'],
	endpoints: (b) => ({
		list: b.query<SuperheroListResponse, ListQueryParams>({
			query: ({ limit = 5, page = 1 }) => `heroes?limit=${limit}&page=${page}`,
			transformResponse: (res: SuperheroListResponse, _, arg) => ({
				items: (res.items || []).map((h) => ({
					id: h.id,
					nickname: h.nickname,
					image: h.image,
				})),
				total: res.total,
				limit: res.limit,
				page: arg.page ?? 1,
			}),
			providesTags: (res) =>
				res
					? [
							{ type: 'Superheroes', id: 'LIST' },
							...res.items.map((i) => ({ type: 'Superhero' as const, id: i.id })),
					  ]
					: [{ type: 'Superheroes', id: 'LIST' }],
		}),

		details: b.query<Superhero, number>({
			query: (id) => `heroes/${id}`,
			transformResponse: (r: Superhero & { superpowers: string | string[] }) => ({
				...r,
				superpowers: Array.isArray(r.superpowers)
					? r.superpowers.map((s) => s.trim()).filter(Boolean)
					: r.superpowers
							.split(',')
							.map((s) => s.trim())
							.filter(Boolean),
			}),
			providesTags: (_, __, id) => [{ type: 'Superhero', id }],
		}),

		create: b.mutation<
			Superhero,
			{
				data: Omit<Superhero, 'id' | 'images' | 'superpowers'> & { superpowers: string[] };
				files: File[];
			}
		>({
			query: ({ data, files }) => {
				const form = new FormData();

				Object.entries(data).forEach(([k, v]) => {
					if (Array.isArray(v)) {
						v.forEach((val) => form.append(k, val));
					} else {
						form.append(k, String(v));
					}
				});

				files.forEach((f) => form.append('images', f));

				return { url: 'heroes', method: 'POST', body: form };
			},
			invalidatesTags: [{ type: 'Superheroes', id: 'LIST' }],
		}),

		update: b.mutation<
			Superhero,
			{
				id: number;
				data: Omit<Superhero, 'id' | 'images' | 'superpowers'> & { superpowers: string[] };
				files: File[];
			}
		>({
			query: ({ id, data, files }) => {
				const form = new FormData();

				Object.entries(data).forEach(([k, v]) => {
					if (Array.isArray(v)) {
						v.forEach((val) => form.append(k, String(val)));
					} else {
						form.append(k, String(v));
					}
				});

				files.forEach((f) => form.append('images', f));

				return { url: `heroes/${id}`, method: 'PUT', body: form };
			},
			invalidatesTags: (r) =>
				r
					? [
							{ type: 'Superheroes', id: 'LIST' },
							{ type: 'Superhero', id: r.id },
					  ]
					: [],
		}),

		remove: b.mutation<void, number>({
			query: (id) => ({ url: `heroes/${id}`, method: 'DELETE' }),
			invalidatesTags: [{ type: 'Superheroes', id: 'LIST' }],
		}),

		removeImage: b.mutation<void, RemoveImageArgs>({
			query: ({ id, imageId }) => ({
				url: `heroes/${id}/images/${imageId}`,
				method: 'DELETE',
			}),
			async onQueryStarted({ id, imageId }, { dispatch, queryFulfilled }) {
				const patch = dispatch(
					superheroesApi.util.updateQueryData('details', id, (draft) => {
						draft.images = draft.images.filter((img) => img.id !== imageId);
					}),
				);
				try {
					await queryFulfilled;
				} catch {
					patch.undo();
				}
			},
			invalidatesTags: (_, __, args) => [{ type: 'Superhero', id: args.id }],
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
