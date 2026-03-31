import { getIngredientsApi } from '@api';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import { TIngredient } from '../../utils/types';

export const getIngredientsThunk = createAsyncThunk(
  'ingredients/fetchIngredients',
  async () => await getIngredientsApi()
);

interface IngredientsState {
  ingredients: TIngredient[];
  loading: boolean;
  error: string | null;
}

const initialState: IngredientsState = {
  ingredients: [],
  loading: false,
  error: null
};

export const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getIngredientsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getIngredientsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.ingredients = action.payload;
      })
      .addCase(getIngredientsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = 'Ошибка загрузки ингредиентов';
      });
  },
  selectors: {
    ingredientsSelector: (state) => state.ingredients,
    ingredientsLoadingSelector: (state) => state.loading,
    ingredientsErrorSelector: (state) => state.error
  }
});

export const {
  ingredientsSelector,
  ingredientsLoadingSelector,
  ingredientsErrorSelector
} = ingredientsSlice.selectors;

export const ingredientsSliceReducer = ingredientsSlice.reducer;
