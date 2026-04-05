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

type RejectError = string;

export const registerUserThunk = createAsyncThunk<
  any,
  TRegisterData,
  { rejectValue: RejectError }
>('user/register', async (data, { rejectWithValue }) => {
  try {
    return await registerUserApi(data);
  } catch (err: any) {
    const message = err.response?.data?.message || 'Ошибка регистрации';

    return rejectWithValue(message);
  }
});

export const loginUserThunk = createAsyncThunk<
  any,
  TLoginData,
  { rejectValue: RejectError }
>('user/login', async (data, { rejectWithValue }) => {
  try {
    return await loginUserApi(data);
  } catch (err: any) {
    const message = err.response?.data?.message || 'Ошибка входа';

    return rejectWithValue(message);
  }
});

export const updateUserThunk = createAsyncThunk<
  any,
  Partial<TRegisterData>,
  { rejectValue: RejectError }
>('user/update', async (data, { rejectWithValue }) => {
  try {
    return await updateUserApi(data);
  } catch (err: any) {
    const message = err.response?.data?.message || 'Ошибка обновления данных';

    return rejectWithValue(message);
  }
});

export const logoutUserThunk = createAsyncThunk<
  void,
  void,
  { rejectValue: RejectError }
>('user/logout', async (_, { rejectWithValue }) => {
  try {
    await logoutApi();
  } catch (err: any) {
    return rejectWithValue('Ошибка выхода');
  }
});

export const setIsAuthChecked = createAction<boolean>('user/setIsAuthChecked');

export const checkUserAuth = createAsyncThunk(
  'user/check',
  async (_, { dispatch }) => {
    try {
      if (getCookie('accessToken')) {
        const res = await getUserApi();
        dispatch(setUser(res.user));
      }
    } catch {
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
  state.error = action.payload || 'Что-то пошло не так';
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, { payload }) => {
      state.user = payload;
    },
    clearError: (state) => {
      state.error = null;
    }
  },

  extraReducers: (builder) => {
    builder
      .addCase(setIsAuthChecked, (state, { payload }) => {
        state.isAuthChecked = payload;
      })

      .addCase(registerUserThunk.pending, setPending)
      .addCase(registerUserThunk.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.user = payload.user;
        setCookie('accessToken', payload.accessToken);
        localStorage.setItem('refreshToken', payload.refreshToken);
        state.isAuthChecked = true;
      })
      .addCase(registerUserThunk.rejected, setRejected)

      .addCase(loginUserThunk.pending, setPending)
      .addCase(loginUserThunk.fulfilled, (state, { payload }) => {
        state.loading = false;
        state.user = payload.user;
        setCookie('accessToken', payload.accessToken);
        localStorage.setItem('refreshToken', payload.refreshToken);
        state.isAuthChecked = true;
      })
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
    userLoadingSelector: (s) => s.loading,
    errorSelector: (s) => s.error
  }
});

export const { setUser, clearError } = userSlice.actions;

export const {
  userSelector,
  isAuthCheckedSelector,
  userLoadingSelector,
  errorSelector
} = userSlice.selectors;

export const userSliceReducer = userSlice.reducer;
