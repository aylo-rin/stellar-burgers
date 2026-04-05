import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getOrdersApi, orderBurgerApi } from '@api';
import { TOrder } from '@utils-types';

export const postNewOrderThunk = createAsyncThunk(
  'order/postNewOrder',
  async (ingredients: string[]) => await orderBurgerApi(ingredients)
);

export const getUserOrdersThunk = createAsyncThunk(
  'order/getUserOrders',
  async () => await getOrdersApi()
);

interface OrderState {
  userOrders: TOrder[];
  newOrder: {
    order: Partial<TOrder> | null;
    name: string;
  };
  isCreatingOrder: boolean;
  isLoadingOrders: boolean;
  error: string | null;
}

const initialState: OrderState = {
  userOrders: [],
  newOrder: {
    order: null,
    name: ''
  },
  isCreatingOrder: false,
  isLoadingOrders: false,
  error: null
};

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearOrder: (state) => {
      state.newOrder = { order: null, name: '' };
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(postNewOrderThunk.pending, (state) => {
        state.isCreatingOrder = true;
        state.error = null;
      })
      .addCase(postNewOrderThunk.fulfilled, (state, action) => {
        state.isCreatingOrder = false;
        state.newOrder = {
          order: action.payload.order,
          name: action.payload.name
        };
      })
      .addCase(postNewOrderThunk.rejected, (state) => {
        state.isCreatingOrder = false;
        state.error = 'Ошибка создания заказа';
      })
      .addCase(getUserOrdersThunk.pending, (state) => {
        state.isLoadingOrders = true;
        state.error = null;
      })
      .addCase(getUserOrdersThunk.fulfilled, (state, action) => {
        state.isLoadingOrders = false;
        state.userOrders = action.payload;
      })
      .addCase(getUserOrdersThunk.rejected, (state) => {
        state.isLoadingOrders = false;
        state.error = 'Ошибка загрузки заказов';
      });
  },
  selectors: {
    userOrdersSelector: (state) => state.userOrders,
    newOrderSelector: (state) => state.newOrder,
    orderRequestSelector: (state) => state.isCreatingOrder,
    orderLoadingSelector: (state) => state.isLoadingOrders,
    orderErrorSelector: (state) => state.error
  }
});

export const {
  userOrdersSelector,
  newOrderSelector,
  orderRequestSelector,
  orderLoadingSelector,
  orderErrorSelector
} = orderSlice.selectors;

export const { clearOrder, clearError } = orderSlice.actions;

export const orderReducer = orderSlice.reducer;
