import { configureStore } from "@reduxjs/toolkit";
import { superheroesApi } from "./api/superheroesApi";
import { setupListeners } from "@reduxjs/toolkit/query";

export const store = configureStore({
  reducer: { [superheroesApi.reducerPath]: superheroesApi.reducer },
  middleware: (gDM) => gDM().concat(superheroesApi.middleware),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;

// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

setupListeners(store.dispatch);
