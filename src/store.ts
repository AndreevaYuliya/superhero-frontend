import { useDispatch } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { superheroesApi } from './api/superheroesApi';

export const store = configureStore({
	reducer: { [superheroesApi.reducerPath]: superheroesApi.reducer },
	middleware: (gDM) => gDM().concat(superheroesApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();

setupListeners(store.dispatch);
