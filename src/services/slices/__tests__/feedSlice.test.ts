import {
  feedReducer,
  getFeedsThunk,
  getOrderByNumberThunk,
  getUserOrdersThunk,
  feedSelector,
  feedOrdersSelector,
  orderByNumberSelector,
  userOrdersSelector,
  feedLoadingSelector,
  feedErrorSelector
} from '../feedSlice';
import { TOrder } from '@utils-types';

const initialState = {
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

const mockOrder: TOrder = {
  _id: '1',
  number: 1,
  name: 'Order 1',
  status: 'done',
  ingredients: ['ing1'],
  createdAt: '',
  updatedAt: ''
};

const mockOrders = [mockOrder];

const makeRootState = (feedState: any) => ({ feed: feedState } as any);

describe('feedSlice reducer', () => {
  it('возвращает начальное состояние', () => {
    expect(feedReducer(undefined, { type: 'UNKNOWN_ACTION' })).toEqual(initialState);
  });

  describe('getFeedsThunk', () => {
    it('pending устанавливает loading=true', () => {
      const state = feedReducer(initialState, getFeedsThunk.pending('pending'));

      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('fulfilled сохраняет ленту', () => {
      const payload = { success: true, total: 10, totalToday: 2, orders: mockOrders };
      const state = feedReducer({ ...initialState, loading: true }, getFeedsThunk.fulfilled(payload, 'fulfilled'));

      expect(state.loading).toBe(false);
      expect(state.feed).toEqual(payload);
      expect(state.error).toBeNull();
    });

    it('rejected устанавливает ошибку', () => {
      const state = feedReducer({ ...initialState, loading: true }, getFeedsThunk.rejected(null, 'rejected'));

      expect(state.loading).toBe(false);
      expect(state.error).toBe('Ошибка загрузки заказов');
    });
  });

  describe('getOrderByNumberThunk', () => {
    it('pending очищает orderByNumber', () => {
      const state = feedReducer(initialState, getOrderByNumberThunk.pending('pending', 1));

      expect(state.loading).toBe(true);
      expect(state.orderByNumber).toBeNull();
    });

    it('fulfilled сохраняет заказ', () => {
      const payload = { success: true, orders: [mockOrder] };
      const state = feedReducer({ ...initialState, loading: true }, getOrderByNumberThunk.fulfilled(payload, 'fulfilled', 1));

      expect(state.loading).toBe(false);
      expect(state.orderByNumber).toEqual(mockOrder);
    });

    it('rejected устанавливает ошибку', () => {
      const state = feedReducer({ ...initialState, loading: true }, getOrderByNumberThunk.rejected(null, 'rejected', 1));

      expect(state.loading).toBe(false);
      expect(state.error).toBe('Ошибка загрузки заказа');
    });
  });

  describe('getUserOrdersThunk', () => {
    it('pending устанавливает loading=true', () => {
      const state = feedReducer(initialState, getUserOrdersThunk.pending('pending'));

      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('fulfilled сохраняет заказы', () => {
      const state = feedReducer({ ...initialState, loading: true }, getUserOrdersThunk.fulfilled(mockOrders, 'fulfilled'));

      expect(state.loading).toBe(false);
      expect(state.userOrders).toEqual(mockOrders);
    });

    it('rejected устанавливает ошибку', () => {
      const state = feedReducer({ ...initialState, loading: true }, getUserOrdersThunk.rejected(null, 'rejected'));

      expect(state.loading).toBe(false);
      expect(state.error).toBe('Ошибка загрузки истории заказов');
    });
  });

  describe('селекторы', () => {
    it('feedSelector возвращает объект feed', () => {
      const state = makeRootState({ ...initialState, feed: { success: true, total: 1, totalToday: 1, orders: mockOrders } });

      expect(feedSelector(state)).toEqual({ success: true, total: 1, totalToday: 1, orders: mockOrders });
    });

    it('feedOrdersSelector возвращает заказы', () => {
      const state = makeRootState({ ...initialState, feed: { success: true, total: 1, totalToday: 1, orders: mockOrders } });

      expect(feedOrdersSelector(state)).toEqual(mockOrders);
    });

    it('orderByNumberSelector возвращает заказ', () => {
      const state = makeRootState({ ...initialState, orderByNumber: mockOrder });

      expect(orderByNumberSelector(state)).toEqual(mockOrder);
    });

    it('userOrdersSelector возвращает заказы пользователя', () => {
      const state = makeRootState({ ...initialState, userOrders: mockOrders });

      expect(userOrdersSelector(state)).toEqual(mockOrders);
    });

    it('feedLoadingSelector возвращает loading', () => {
      const state = makeRootState({ ...initialState, loading: true });

      expect(feedLoadingSelector(state)).toBe(true);
    });

    it('feedErrorSelector возвращает ошибку', () => {
      const state = makeRootState({ ...initialState, error: 'Error' });

      expect(feedErrorSelector(state)).toBe('Error');
    });
  });
});

