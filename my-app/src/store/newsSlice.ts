import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios, { AxiosError } from 'axios';
import { NewsResponse, Post } from './types';

interface NewsState {
  posts: Post[];
  total: number;
  loading: 'idle' | 'pending' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: NewsState = {
  posts: [],
  total: 0,
  loading: 'idle',
  error: null,
};

export interface FetchNewsParams {
  search?: string;
  tags?: string;
  authorId?: number;
  author?: string;
  offset?: number;
  limit?: number;
  order?: 'asc' | 'desc';
}

export const fetchNews = createAsyncThunk<
  NewsResponse,
  FetchNewsParams,
  { rejectValue: string }
>('news/fetchNews', async (params: FetchNewsParams) => {
  try {
    const { search, tags, authorId, author, offset, limit, order } = params;

    let url = 'https://api.news.academy.dunice.net/posts';
    const queryParams = new URLSearchParams();

    if (search) queryParams.append('search', search);
    if (tags) queryParams.append('tags', tags);
    if (authorId) queryParams.append('authorId', String(authorId));
    if (author) queryParams.append('author', author);
    if (offset) queryParams.append('offset', String(offset));
    if (limit) queryParams.append('limit', String(limit));
    if (order) queryParams.append('order', order);

    if (queryParams.toString()) {
      url += '?' + queryParams.toString();
    }

    const response = await axios.get<NewsResponse>(url);
    return response.data;
  } catch (error: unknown) {
    let errorMessage = 'Failed to fetch news';
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

const newsSlice = createSlice({
  name: 'news',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchNews.pending, state => {
        state.loading = 'pending';
        state.error = null;
      })
      .addCase(fetchNews.fulfilled, (state, action) => {
        state.loading = 'succeeded';
        state.posts = action.payload.posts;
        state.total = action.payload.total;
        state.error = null;
      })
      .addCase(fetchNews.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.payload || 'Failed to fetch news';
        state.posts = [];
        state.total = 0;
      });
  },
});

export default newsSlice.reducer;
export const selectNews = (state: { news: { posts: Post[] } }) =>
  state.news.posts;
export const selectNewsTotal = (state: { news: { total: number } }) =>
  state.news.total;
export const selectNewsLoading = (state: {
  news: { loading: 'idle' | 'pending' | 'succeeded' | 'failed' };
}) => state.news.loading;
export const selectNewsError = (state: { news: { error: string | null } }) =>
  state.news.error;
