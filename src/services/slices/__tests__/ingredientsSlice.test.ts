import {
  ingredientsSliceReducer,
  getIngredientsThunk,
  ingredientsSelector,
  ingredientsLoadingSelector,
  ingredientsErrorSelector
} from '../ingredientsSlice';
import { TIngredient } from '@utils-types';

describe('ingredientsSlice reducer', () => {
  const initialState = {
    ingredients: [],
    loading: false,
    error: null
  };

  const mockIngredients: TIngredient[] = [
    {
      _id: '643d69a5c3f7b9001cfa093d',
      name: 'Флюоресцентная булка R2-D3',
      type: 'bun',
      proteins: 44,
      fat: 26,
      carbohydrates: 85,
      calories: 643,
      price: 988,
      image: 'https://code.s3.yandex.net/react/code/bun-01.png',
      image_mobile: 'https://code.s3.yandex.net/react/code/bun-01-mobile.png',
      image_large: 'https://code.s3.yandex.net/react/code/bun-01-large.png'
    }
  ];

  it('pending устанавливает loading=true', () => {
    const state = ingredientsSliceReducer(
      initialState,
      getIngredientsThunk.pending('pending')
    );

    expect(state).toEqual({ ...initialState, loading: true, error: null });
  });

  it('fulfilled сохраняет ингредиенты', () => {
    const state = ingredientsSliceReducer(
      { ...initialState, loading: true },
      getIngredientsThunk.fulfilled(mockIngredients, 'fulfilled')
    );

    expect(state).toEqual({
      ...initialState,
      loading: false,
      error: null,
      ingredients: mockIngredients
    });
  });

  it('rejected сохраняет ошибку', () => {
    const state = ingredientsSliceReducer(
      { ...initialState, loading: true },
      getIngredientsThunk.rejected(null, 'rejected')
    );

    expect(state).toEqual({
      ...initialState,
      loading: false,
      error: 'Ошибка загрузки ингредиентов'
    });
  });

  it('селекторы возвращают значения', () => {
    const state = {
      ingredients: {
        ...initialState,
        ingredients: mockIngredients,
        loading: true,
        error: 'Ошибка'
      }
    } as any;

    expect(ingredientsSelector(state)).toEqual(mockIngredients);
    expect(ingredientsLoadingSelector(state)).toBe(true);
    expect(ingredientsErrorSelector(state)).toBe('Ошибка');
  });
});
