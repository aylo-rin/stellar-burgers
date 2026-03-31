import { createSlice, nanoid, PayloadAction } from '@reduxjs/toolkit';
import { TIngredient, TConstructorIngredient } from '@utils-types';
import { RootState } from '../store';

export interface ConstructorState {
  burger: {
    bun: TConstructorIngredient | null;
    ingredients: TConstructorIngredient[];
  };
}

export const initialState: ConstructorState = {
  burger: {
    bun: null,
    ingredients: []
  }
};

export const constructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    addIngredient: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        if (action.payload.type === 'bun') {
          state.burger.bun = action.payload;
        } else {
          state.burger.ingredients.push(action.payload);
        }
      },
      prepare: (ingredient: TIngredient) => ({
        payload: {
          ...ingredient,
          id: nanoid()
        }
      })
    },

    moveIngredient: (
      state,
      action: PayloadAction<{ from: number; to: number }>
    ) => {
      const { from, to } = action.payload;

      if (
        from < 0 ||
        to < 0 ||
        from >= state.burger.ingredients.length ||
        to >= state.burger.ingredients.length
      )
        return;

      const items = state.burger.ingredients;
      const [movedItem] = items.splice(from, 1);
      items.splice(to, 0, movedItem);
    },

    removeIngredient: (state, action: PayloadAction<string>) => {
      state.burger.ingredients = state.burger.ingredients.filter(
        (ing) => ing.id !== action.payload
      );
    },

    clearBurger: (state) => {
      state.burger.bun = null;
      state.burger.ingredients = [];
    }
  }
});

export const burgerConstructorSelector = (state: RootState) =>
  state.burgerConstructor.burger;

export const { addIngredient, removeIngredient, clearBurger, moveIngredient } =
  constructorSlice.actions;

export const constructorReducer = constructorSlice.reducer;
