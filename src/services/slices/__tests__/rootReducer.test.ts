import { combineReducers } from '@reduxjs/toolkit';
import { configureStore } from '@reduxjs/toolkit';
import { userSliceReducer } from '../userSlice';
import { ingredientsSliceReducer } from '../ingredientsSlice';
import { constructorReducer } from '../constructorSlice';
import { feedReducer } from '../feedSlice';
import { orderReducer } from '../orderSlice';

it('тестирование rootReducer', () => {
  const rootReducer = combineReducers({
    user: userSliceReducer,
    ingredients: ingredientsSliceReducer,
    burgerConstructor: constructorReducer,
    order: orderReducer,
    feed: feedReducer
  });

  const store = configureStore({
    reducer: rootReducer
  });

  expect(store.getState()).toEqual(
    rootReducer(undefined, { type: 'UNKNOWN_ACTION' })
  );
});
