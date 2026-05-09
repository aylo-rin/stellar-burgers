import {
  orderReducer,
  clearOrder,
  clearError,
  postNewOrderThunk,
  getUserOrdersThunk,
  userOrdersSelector,
  newOrderSelector,
  orderRequestSelector,
  orderLoadingSelector,
  orderErrorSelector
} from '../orderSlice';
import { TOrder } from '@utils-types';

describe('orderSlice reducer', () => {
  const initialState = {
    userOrders: [],
    newOrder: { order: null, name: '' },
    isCreatingOrder: false,
    isLoadingOrders: false,
    error: null
  };

  const mockOrder: TOrder = {
    _id: '69d3dde0a64177001b331c20',
    ingredients: ['ing1'],
    status: 'done',
    name: 'Био-марсианский люминесцентный краторный бургер',
    number: 103765,
    createdAt: '2026-04-06T16:22:56.962Z',
    updatedAt: '2026-04-06T16:22:57.200Z'
  };

  it('возвращает initialState при неизвестном action', () => {
    expect(orderReducer(undefined, { type: 'UNKNOWN_ACTION' })).toEqual(initialState);
  });

  it('clearOrder очищает новый заказ', () => {
    const state = orderReducer(
      { ...initialState, newOrder: { order: mockOrder, name: 'Test' } },
      clearOrder()
    );

    expect(state.newOrder).toEqual({ order: null, name: '' });
  });

  it('clearError очищает error', () => {
    const state = orderReducer({ ...initialState, error: 'Ошибка' }, clearError());

    expect(state.error).toBeNull();
  });

  it('postNewOrderThunk pending', () => {
    const state = orderReducer(initialState, { type: postNewOrderThunk.pending.type });

    expect(state.isCreatingOrder).toBe(true);
    expect(state.error).toBeNull();
  });

  it('postNewOrderThunk fulfilled', () => {
    const payload = { order: mockOrder, name: 'Био-марсианский люминесцентный краторный бургер' };
    const state = orderReducer(initialState, { type: postNewOrderThunk.fulfilled.type, payload });

    expect(state.isCreatingOrder).toBe(false);
    expect(state.newOrder).toEqual(payload);
  });

  it('postNewOrderThunk rejected', () => {
    const state = orderReducer(initialState, { type: postNewOrderThunk.rejected.type });

    expect(state.isCreatingOrder).toBe(false);
    expect(state.error).toBe('Ошибка создания заказа');
  });

  it('getUserOrdersThunk pending', () => {
    const state = orderReducer(initialState, { type: getUserOrdersThunk.pending.type });

    expect(state.isLoadingOrders).toBe(true);
    expect(state.error).toBeNull();
  });

  it('getUserOrdersThunk fulfilled', () => {
    const payload = [mockOrder];
    const state = orderReducer(initialState, { type: getUserOrdersThunk.fulfilled.type, payload });

    expect(state.isLoadingOrders).toBe(false);
    expect(state.userOrders).toEqual(payload);
    expect(state.error).toBeNull();
  });

  it('getUserOrdersThunk rejected', () => {
    const state = orderReducer(initialState, { type: getUserOrdersThunk.rejected.type });

    expect(state.isLoadingOrders).toBe(false);
    expect(state.error).toBe('Ошибка загрузки заказов');
  });

  it('селекторы возвращают значения', () => {
    const state = {
      order: {
        ...initialState,
        userOrders: [mockOrder],
        newOrder: { order: mockOrder, name: 'Био-марсианский люминесцентный краторный бургер' },
        isCreatingOrder: true,
        isLoadingOrders: true,
        error: 'Ошибка'
      }
    } as any;

    expect(userOrdersSelector(state)).toEqual([mockOrder]);
    expect(newOrderSelector(state)).toEqual({ order: mockOrder, name: 'Био-марсианский люминесцентный краторный бургер' });
    expect(orderRequestSelector(state)).toBe(true);
    expect(orderLoadingSelector(state)).toBe(true);
    expect(orderErrorSelector(state)).toBe('Ошибка');
  });
});

describe('orderSlice thunks', () => {
  const mockOrder: TOrder = {
    _id: '69d3dde0a64177001b331c20',
    ingredients: ['ing1'],
    status: 'done',
    name: 'Био-марсианский люминесцентный краторный бургер',
    number: 103765,
    createdAt: '2026-04-06T16:22:56.962Z',
    updatedAt: '2026-04-06T16:22:57.200Z'
  };

  it('postNewOrderThunk успешный запрос', async () => {
    const api = require('@api');
    const payload = { order: mockOrder, name: 'Био-марсианский люминесцентный краторный бургер' };
    jest.spyOn(api, 'orderBurgerApi').mockResolvedValue(payload);

    const dispatch = jest.fn();
    const thunk = postNewOrderThunk(['ing1']);
    await thunk(dispatch, () => ({}), undefined);

    expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({ type: postNewOrderThunk.pending.type }));
    expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({ type: postNewOrderThunk.fulfilled.type, payload }));
  });

  it('postNewOrderThunk ошибка запроса', async () => {
    const api = require('@api');
    jest.spyOn(api, 'orderBurgerApi').mockRejectedValue(new Error('API error'));

    const dispatch = jest.fn();
    const thunk = postNewOrderThunk(['ing1']);
    await thunk(dispatch, () => ({}), undefined);

    expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({ type: postNewOrderThunk.pending.type }));
    expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({ type: postNewOrderThunk.rejected.type, error: expect.objectContaining({ message: expect.any(String) }) }));
  });

  it('getUserOrdersThunk успешный запрос', async () => {
    const api = require('@api');
    const payload = [mockOrder];
    jest.spyOn(api, 'getOrdersApi').mockResolvedValue(payload);

    const dispatch = jest.fn();
    const thunk = getUserOrdersThunk();
    await thunk(dispatch, () => ({}), undefined);

    expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({ type: getUserOrdersThunk.pending.type }));
    expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({ type: getUserOrdersThunk.fulfilled.type, payload }));
  });

  it('getUserOrdersThunk ошибка запроса', async () => {
    const api = require('@api');
    jest.spyOn(api, 'getOrdersApi').mockRejectedValue(new Error('API error'));

    const dispatch = jest.fn();
    const thunk = getUserOrdersThunk();
    await thunk(dispatch, () => ({}), undefined);

    expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({ type: getUserOrdersThunk.pending.type }));
    expect(dispatch).toHaveBeenCalledWith(expect.objectContaining({ type: getUserOrdersThunk.rejected.type, error: expect.objectContaining({ message: expect.any(String) }) }));
  });
});
