import { createAsyncThunk, createAction, createSlice } from '@reduxjs/toolkit';
import { TUser } from '@utils-types';
import {
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  TLoginData,
  TRegisterData,
  updateUserApi
} from '@api';
import { setCookie, getCookie } from '../../utils/cookie';

export const registerUserThunk = createAsyncThunk(
  'user/register',
  async (data: TRegisterData) => await registerUserApi(data)
);

export const loginUserThunk = createAsyncThunk(
  'user/login',
  async (data: TLoginData) => await loginUserApi(data)
);

export const updateUserThunk = createAsyncThunk(
  'user/update',
  async (data: Partial<TRegisterData>) => await updateUserApi(data)
);

export const logoutUserThunk = createAsyncThunk(
  'user/logout',
  async () => await logoutApi()
);

export const setIsAuthChecked = createAction<boolean>('user/setIsAuthChecked');

export const checkUserAuth = createAsyncThunk(
  'user/check',
  async (_, { dispatch }) => {
    try {
      if (getCookie('accessToken')) {
        const res = await getUserApi();
        dispatch(setUser(res.user));
      }
    } catch (e) {
      localStorage.removeItem('refreshToken');
    } finally {
      dispatch(setIsAuthChecked(true));
    }
  }
);

interface UserState {
  user: TUser | null;
  isAuthChecked: boolean;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  user: null,
  isAuthChecked: false,
  loading: false,
  error: null
};

const setPending = (state: UserState) => {
  state.loading = true;
  state.error = null;
};

const setRejected = (state: UserState, action: any) => {
  state.loading = false;
  state.error = 'Ошибка загрузки';
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, { payload }) => {
      state.user = payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(setIsAuthChecked, (state, { payload }) => {
        state.isAuthChecked = payload;
      })

      .addCase(registerUserThunk.pending, setPending)
      .addCase(loginUserThunk.pending, setPending)

      .addCase(registerUserThunk.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.user = payload.user;
        setCookie('accessToken', payload.accessToken);
        localStorage.setItem('refreshToken', payload.refreshToken);
        state.isAuthChecked = true;
      })
      .addCase(loginUserThunk.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.user = payload.user;
        setCookie('accessToken', payload.accessToken);
        localStorage.setItem('refreshToken', payload.refreshToken);
        state.isAuthChecked = true;
      })

      .addCase(registerUserThunk.rejected, setRejected)
      .addCase(loginUserThunk.rejected, setRejected)

      .addCase(updateUserThunk.pending, setPending)
      .addCase(updateUserThunk.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.user = payload.user;
      })
      .addCase(updateUserThunk.rejected, setRejected)

      .addCase(logoutUserThunk.pending, setPending)
      .addCase(logoutUserThunk.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.isAuthChecked = true;
        setCookie('accessToken', '', { expires: -1 });
        localStorage.removeItem('refreshToken');
      })
      .addCase(logoutUserThunk.rejected, setRejected);
  },
  selectors: {
    userSelector: (s) => s.user,
    isAuthCheckedSelector: (s) => s.isAuthChecked,
    userLoadingSelector: (s) => s.loading
  }
});

export const { setUser } = userSlice.actions;
export const { userSelector, isAuthCheckedSelector, userLoadingSelector } =
  userSlice.selectors;

export const userSliceReducer = userSlice.reducer;
