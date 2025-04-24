import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';

interface AuthState {
  token: string | null;
  user: User | null;
  loading: 'idle' | 'pending' | 'succeeded' | 'failed';
  error: string | null;
}

interface User {
  id: number;
  firstName: string | null;
  lastName: string | null;
  email: string;
  avatarPath: string | null;
  createdAt: string;
  updatedAt: string;
}

const initialState: AuthState = {
  token: null,
  user: null,
  loading: 'idle',
  error: null,
};

interface RegisterResponse {
  user: User;
  accessToken: string;
}

interface LoginResponse {
  user: User;
  accessToken: string;
}

interface GetUserResponse {
  id: number;
  firstName: string | null;
  lastName: string | null;
  email: string;
  avatarPath: string | null;
  createdAt: string;
  updatedAt: string;
}

export const registerUser = createAsyncThunk<
  RegisterResponse,
  { email: string; password: string },
  { rejectValue: string }
>('auth/register', async ({ email, password }, { rejectWithValue }) => {
  try {
    const response = await axios.post<RegisterResponse>(
      'https://api.news.academy.dunice.net/users',
      {
        email,
        password,
      },
    );
    return response.data;
  } catch (error: unknown) {
    let errorMessage = 'Registration failed';
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;

      if (axiosError.response && axiosError.response.data) {
        const responseData = axiosError.response.data as { message?: string };
        errorMessage = responseData.message || errorMessage;
      } else {
        errorMessage = axiosError.message || errorMessage;
      }
    } else if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === 'string') {
      errorMessage = error;
    }
    return rejectWithValue(errorMessage);
  }
});

export const loginUser = createAsyncThunk<
  LoginResponse,
  { email: string; password: string },
  { rejectValue: string }
>('auth/login', async ({ email, password }, { rejectWithValue }) => {
  try {
    const response = await axios.post<LoginResponse>(
      'https://api.news.academy.dunice.net/auth/login',
      {
        email,
        password,
      },
    );
    return response.data;
  } catch (error: unknown) {
    let errorMessage = 'Login failed';
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;

      if (axiosError.response && axiosError.response.data) {
        const responseData = axiosError.response.data as { message?: string };
        errorMessage = responseData.message || errorMessage;
      } else {
        errorMessage = axiosError.message || errorMessage;
      }
    } else if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === 'string') {
      errorMessage = error;
    }
    return rejectWithValue(errorMessage);
  }
});

interface RootState {
  auth: AuthState;
}

export const getUser = createAsyncThunk<
  GetUserResponse,
  void,
  { rejectValue: string; state: RootState }
>('auth/getUser', async (_, { rejectWithValue, getState }) => {
  const token = selectToken(getState());
  if (!token) {
    return rejectWithValue('No token found');
  }

  try {
    const response = await axios.get<GetUserResponse>(
      'https://api.news.academy.dunice.net/auth/me',
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  } catch (error: unknown) {
    let errorMessage = 'Failed to get user';
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;

      if (axiosError.response && axiosError.response.data) {
        const responseData = axiosError.response.data as { message?: string };
        errorMessage = responseData.message || errorMessage;
      } else {
        errorMessage = axiosError.message || errorMessage;
      }
    } else if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === 'string') {
      errorMessage = error;
    }
    return rejectWithValue(errorMessage);
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: state => {
      state.token = null;
      state.user = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(registerUser.pending, state => {
        state.loading = 'pending';
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = 'succeeded';
        state.token = action.payload.accessToken;
        state.user = action.payload.user;
        state.error = null;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.payload || 'Registration failed';
      })
      .addCase(loginUser.pending, state => {
        state.loading = 'pending';
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = 'succeeded';
        state.token = action.payload.accessToken;
        state.user = action.payload.user;
        state.error = null;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.payload || 'Login failed';
      })
      .addCase(getUser.pending, state => {
        state.loading = 'pending';
        state.error = null;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.loading = 'succeeded';
        state.user = action.payload;
        state.error = null;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.payload || 'Failed to get user';
        state.token = null;
        state.user = null;
      });
  },
});

export const { logout } = authSlice.actions;
export const selectToken = (state: { auth: { token: string | null } }) =>
  state.auth.token;
export const selectUser = (state: { auth: { user: User | null } }) =>
  state.auth.user;
export const selectAuthLoading = (state: {
  auth: { loading: 'idle' | 'pending' | 'succeeded' | 'failed' };
}) => state.auth.loading;
export const selectAuthError = (state: { auth: { error: string | null } }) =>
  state.auth.error;

export default authSlice.reducer;
