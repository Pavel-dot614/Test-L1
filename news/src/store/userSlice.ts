import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';
import { User } from './types';
import { RootState } from './store';

export interface UserState {
  users: User[];
  user: User | null;
  loading: 'idle' | 'pending' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: UserState = {
  users: [],
  user: null,
  loading: 'idle',
  error: null,
};

export const fetchUsers = createAsyncThunk('user/fetchUsers', async () => {
  try {
    const response = await axios.get<User[]>(
      'https://api.news.academy.dunice.net/users',
    );
    return response.data;
  } catch (error: unknown) {
    console.error('Error fetching users:', error);
    let errorMessage = 'Failed to fetch users';

    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError;
      errorMessage =
        (axiosError.response?.data as { message?: string })?.message ||
        errorMessage;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === 'string') {
      errorMessage = error;
    }

    throw new Error(errorMessage);
  }
});

export const fetchUserById = createAsyncThunk(
  'user/fetchUserById',
  async (userId: number) => {
    try {
      const response = await axios.get<User>(
        `https://api.news.academy.dunice.net/users/${userId}`,
      );
      return response.data;
    } catch (error: unknown) {
      console.error('Error fetching user:', error);
      let errorMessage = 'Failed to fetch user';

      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;
        errorMessage =
          (axiosError.response?.data as { message?: string })?.message ||
          errorMessage;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }

      throw new Error(errorMessage);
    }
  },
);

export interface UpdateUserRequest {
  email?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  file?: File | null;
}

export const updateUser = createAsyncThunk(
  'user/updateUser',
  async (
    { userId, updateData }: { userId: number; updateData: UpdateUserRequest },
    { rejectWithValue, getState },
  ) => {
    try {
      const rootState = getState() as RootState;
      const token = rootState.auth.token;

      if (!token) {
        throw new Error('Unauthorized');
      }

      const formData = new FormData();
      if (updateData.email) formData.append('email', updateData.email);
      if (updateData.password) formData.append('password', updateData.password);
      if (updateData.firstName)
        formData.append('firstName', updateData.firstName);
      if (updateData.lastName) formData.append('lastName', updateData.lastName);
      if (updateData.file) formData.append('file', updateData.file);

      const response = await axios.patch<User>(
        `https://api.news.academy.dunice.net/users/${userId}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        },
      );
      return response.data;
    } catch (error: unknown) {
      console.error('Error updating user:', error);

      let errorMessage = 'Failed to update user';

      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError;

        if (axiosError.response && axiosError.response.data) {
          const responseData = axiosError.response.data as { message?: string };
          errorMessage =
            responseData.message ||
            axiosError.message ||
            'Failed to update user';
        } else {
          errorMessage = axiosError.message || 'Failed to update user';
        }
      } else if (error instanceof Error) {
        errorMessage = error.message;
      } else if (typeof error === 'string') {
        errorMessage = error;
      }

      return rejectWithValue(errorMessage);
    }
  },
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchUsers.pending, state => {
        state.loading = 'pending';
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = 'succeeded';
        state.users = action.payload;
        state.error = null;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.error.message || 'Failed to fetch users';
      })
      .addCase(fetchUserById.pending, state => {
        state.loading = 'pending';
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.loading = 'succeeded';
        state.user = action.payload;
        state.error = null;
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.error.message || 'Failed to fetch user';
        state.user = null;
      })
      .addCase(updateUser.pending, state => {
        state.loading = 'pending';
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = 'succeeded';
        state.user = action.payload;
        state.error = null;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = (action.payload as string) || 'Failed to update user';
      });
  },
});

export default userSlice;
export const selectUsers = (state: { user: { users: User[] } }) =>
  state.user.users;
export const selectUser = (state: { user: { user: User | null } }) =>
  state.user.user;
export const selectUserLoading = (state: {
  user: { loading: 'idle' | 'pending' | 'succeeded' | 'failed' };
}) => state.user.loading;
export const selectUserError = (state: { user: { error: string | null } }) =>
  state.user.error;
