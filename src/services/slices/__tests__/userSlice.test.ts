import {
  userSliceReducer,
  setUser,
  clearError,
  setIsAuthChecked,
  registerUserThunk,
  loginUserThunk,
  updateUserThunk,
  logoutUserThunk,
  userSelector,
  isAuthCheckedSelector,
  userLoadingSelector,
  errorSelector
} from '../userSlice';
import { TUser } from '@utils-types';
import { setCookie } from '../../../utils/cookie';

jest.mock('../../../utils/cookie', () => ({ setCookie: jest.fn() }));

describe('userSlice reducer', () => {
  const initialState = {
    user: null,
    isAuthChecked: false,
    loading: false,
    error: null
  };

  const mockUser: TUser = { email: 'test@test.com', name: 'Test User' };
  const authPayload = { user: mockUser, accessToken: 'access', refreshToken: 'refresh' };

  beforeEach(() => jest.clearAllMocks());

  it('возвращает initialState при неизвестном action', () => {
    expect(userSliceReducer(undefined, { type: 'UNKNOWN_ACTION' })).toEqual(initialState);
  });

  it('setUser устанавливает пользователя', () => {
    const state = userSliceReducer(initialState, setUser(mockUser));

    expect(state.user).toEqual(mockUser);
  });

  it('clearError очищает ошибку', () => {
    const state = userSliceReducer({ ...initialState, error: 'Ошибка' }, clearError());

    expect(state.error).toBeNull();
  });

  it('setIsAuthChecked устанавливает флаг', () => {
    const state = userSliceReducer(initialState, setIsAuthChecked(true));

    expect(state.isAuthChecked).toBe(true);
  });

  it('registerUserThunk pending', () => {
    const state = userSliceReducer(initialState, { type: registerUserThunk.pending.type });

    expect(state).toEqual({ ...initialState, loading: true, error: null });
  });

  it('registerUserThunk fulfilled', () => {
    const state = userSliceReducer(initialState, { type: registerUserThunk.fulfilled.type, payload: authPayload });

    expect(state).toEqual({ ...initialState, loading: false, user: mockUser, isAuthChecked: true });
    expect(setCookie).toHaveBeenCalledWith('accessToken', authPayload.accessToken);
  });

  it('registerUserThunk rejected', () => {
    const state = userSliceReducer(initialState, { type: registerUserThunk.rejected.type, payload: 'Ошибка регистрации' });

    expect(state).toEqual({ ...initialState, loading: false, error: 'Ошибка регистрации' });
  });

  it('loginUserThunk pending', () => {
    const state = userSliceReducer(initialState, { type: loginUserThunk.pending.type });

    expect(state).toEqual({ ...initialState, loading: true, error: null });
  });

  it('loginUserThunk fulfilled', () => {
    const state = userSliceReducer(initialState, { type: loginUserThunk.fulfilled.type, payload: authPayload });

    expect(state).toEqual({ ...initialState, loading: false, user: mockUser, isAuthChecked: true });
    expect(setCookie).toHaveBeenCalledWith('accessToken', authPayload.accessToken);
  });

  it('loginUserThunk rejected', () => {
    const state = userSliceReducer(initialState, { type: loginUserThunk.rejected.type, payload: 'Ошибка входа' });

    expect(state).toEqual({ ...initialState, loading: false, error: 'Ошибка входа' });
  });

  it('updateUserThunk pending', () => {
    const state = userSliceReducer(initialState, { type: updateUserThunk.pending.type });

    expect(state).toEqual({ ...initialState, loading: true, error: null });
  });

  it('updateUserThunk fulfilled', () => {
    const state = userSliceReducer(initialState, { type: updateUserThunk.fulfilled.type, payload: { user: mockUser } });

    expect(state).toEqual({ ...initialState, loading: false, user: mockUser });
  });

  it('updateUserThunk rejected', () => {
    const state = userSliceReducer(initialState, { type: updateUserThunk.rejected.type, payload: 'Ошибка обновления данных' });

    expect(state).toEqual({ ...initialState, loading: false, error: 'Ошибка обновления данных' });
  });

  it('logoutUserThunk pending', () => {
    const state = userSliceReducer(initialState, { type: logoutUserThunk.pending.type });

    expect(state).toEqual({ ...initialState, loading: true, error: null });
  });

  it('logoutUserThunk fulfilled', () => {
    const prevState = { ...initialState, user: mockUser };
    const state = userSliceReducer(prevState, { type: logoutUserThunk.fulfilled.type });

    expect(state).toEqual({ ...initialState, loading: false, user: null, isAuthChecked: true });
  });

  it('logoutUserThunk rejected', () => {
    const state = userSliceReducer(initialState, { type: logoutUserThunk.rejected.type, payload: 'Ошибка выхода' });

    expect(state).toEqual({ ...initialState, loading: false, error: 'Ошибка выхода' });
  });

  it('селекторы возвращают данные', () => {
    const state = {
      user: {
        ...initialState,
        user: mockUser,
        isAuthChecked: true,
        loading: true,
        error: 'Ошибка'
      }
    } as any;

    expect(userSelector(state)).toEqual(mockUser);
    expect(isAuthCheckedSelector(state)).toBe(true);
    expect(userLoadingSelector(state)).toBe(true);
    expect(errorSelector(state)).toBe('Ошибка');
  });
});
