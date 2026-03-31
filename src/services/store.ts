import { configureStore } from '@reduxjs/toolkit';
import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';
import { userSliceReducer } from './slices/userSlice';
import { ingredientsSliceReducer } from './slices/ingredientsSlice';
import { constructorReducer } from './slices/constructorSlice';
import { feedReducer } from './slices/feedSlice';
import { orderReducer } from './slices/orderSlice';

const store = configureStore({
  reducer: {
    user: userSliceReducer,
    ingredients: ingredientsSliceReducer,
    burgerConstructor: constructorReducer,
    order: orderReducer,
    feed: feedReducer
  },
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export const useDispatch = () => dispatchHook<AppDispatch>();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
