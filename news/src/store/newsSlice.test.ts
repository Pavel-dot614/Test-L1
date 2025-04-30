import newsSlice, {
  selectNews,
  selectNewsTotal,
  selectNewsLoading,
  selectNewsError,
} from './newsSlice';
import { fetchNews } from './newsSlice';
import { NewsState } from './newsSlice';
import { Post } from './types';

describe('newsSlice Reduser', () => {
  const initialState: NewsState = {
    posts: [],
    total: 0,
    loading: 'idle',
    error: null,
  };

  const createMockPost = (overrides?: Partial<Post>): Post => ({
    id: 1,
    title: 'Test Post',
    text: 'Test text',
    coverPath: '/cover.jpg',
    authorId: 123,
    createdAt: '2024-04-01T12:00:00.000Z',
    updatedAt: '2024-04-01T12:00:00.000Z',
    tags: [],
    views: 0,
    author: {
      id: 123,
      username: 'author',
      avatar: '/avatar.jpg',
    },
    ...overrides,
  });

  it('should handle fetchNews.pending', () => {
    const action = { type: fetchNews.pending.type };
    const state: NewsState = { ...initialState };

    const nextState = newsSlice.reducer(state, action);

    expect(nextState.loading).toBe('pending');
    expect(nextState.error).toBeNull();
  });

  it('should handle fetchNews.fulfilled', () => {
    const mockPosts = [createMockPost()];
    const action = {
      type: fetchNews.fulfilled.type,
      payload: {
        posts: mockPosts,
        total: 1,
      },
    };
    const state: NewsState = { ...initialState, loading: 'pending' };

    const nextState = newsSlice.reducer(state, action);

    expect(nextState.loading).toBe('succeeded');
    expect(nextState.posts).toEqual(mockPosts);
    expect(nextState.total).toBe(1);
    expect(nextState.error).toBeNull();
  });

  it('should handle fetchNews.rejected with error message', () => {
    const action = {
      type: fetchNews.rejected.type,
      error: { message: 'Server error occurred' },
      payload: undefined,
    };
    const state: NewsState = { ...initialState, loading: 'pending' };

    const nextState = newsSlice.reducer(state, action);

    expect(nextState.loading).toBe('failed');
    expect(nextState.error).toBe('Failed to fetch news');
    expect(nextState.posts).toEqual([]);
    expect(nextState.total).toBe(0);
  });

  describe('selectors', () => {
    const mockState: { newsReducer: NewsState } = {
      newsReducer: {
        posts: [createMockPost()],
        total: 5,
        loading: 'succeeded',
        error: null,
      },
    };

    it('selectNews returns posts', () => {
      expect(selectNews(mockState)).toEqual(mockState.newsReducer.posts);
    });

    it('selectNewsTotal returns total', () => {
      expect(selectNewsTotal(mockState)).toBe(5);
    });

    it('selectNewsLoading returns loading', () => {
      expect(selectNewsLoading(mockState)).toBe('succeeded');
    });

    it('selectNewsError returns error', () => {
      expect(selectNewsError(mockState)).toBeNull();
    });
  });
});
