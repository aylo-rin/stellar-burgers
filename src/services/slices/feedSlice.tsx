import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getFeedsApi, getOrderByNumberApi, getOrdersApi } from '@api';
import { TOrder } from '@utils-types';
import { TFeedsResponse } from '@api';

export const getFeedsThunk = createAsyncThunk(
  'feed/getFeeds',
  async () => await getFeedsApi()
);

export const getOrderByNumberThunk = createAsyncThunk(
  'feed/getOrderByNumber',
  async (orderNumber: number) => await getOrderByNumberApi(orderNumber)
);

export const getUserOrdersThunk = createAsyncThunk(
  'feed/getUserOrders',
  async () => await getOrdersApi()
);

export interface FeedState {
  feed: TFeedsResponse;
  orderByNumber: TOrder | null;
  userOrders: TOrder[];
  loading: boolean;
  error: string | null;
}

const initialState: FeedState = {
  feed: {
    success: false,
    total: 0,
    totalToday: 0,
    orders: []
  },
  orderByNumber: null,
  userOrders: [],
  loading: false,
  error: null
};

export const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getFeedsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getFeedsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.feed = action.payload;
      })
      .addCase(getFeedsThunk.rejected, (state) => {
        state.loading = false;
        state.error = 'Ошибка загрузки заказов';
      })
      .addCase(getOrderByNumberThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.orderByNumber = null;
      })
      .addCase(getOrderByNumberThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.orderByNumber = action.payload.orders[0] || null;
      })
      .addCase(getOrderByNumberThunk.rejected, (state) => {
        state.loading = false;
        state.error = 'Ошибка загрузки заказа';
      })
      .addCase(getUserOrdersThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getUserOrdersThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.userOrders = action.payload;
      })
      .addCase(getUserOrdersThunk.rejected, (state) => {
        state.loading = false;
        state.error = 'Ошибка загрузки истории заказов';
      });
  },
  selectors: {
    feedSelector: (state) => state.feed,
    feedOrdersSelector: (state) => state.feed.orders,
    orderByNumberSelector: (state) => state.orderByNumber,
    userOrdersSelector: (state) => state.userOrders,
    feedLoadingSelector: (state) => state.loading,
    feedErrorSelector: (state) => state.error
  }
});

export const {
  feedSelector,
  feedOrdersSelector,
  orderByNumberSelector,
  userOrdersSelector,
  feedLoadingSelector,
  feedErrorSelector
} = feedSlice.selectors;

export const feedReducer = feedSlice.reducer;
