import { screen } from '@testing-library/react';
import NewsList from './NewsList';
import { renderWithProvider } from '../test-utils/utils-for-tests';

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => jest.fn(),
}));

const basePreloadedState = {
  newsReducer: {
    posts: [],
    total: 0,
    loading: 'idle',
    error: null,
  },
};

const createMockPost = (overrides = {}) => ({
  id: 1,
  title: 'Test News Title',
  text: 'Sample text',
  coverPath: '/cover.jpg',
  authorId: 123,
  createdAt: '2024-01-01T00:00:00.000Z',
  updatedAt: '2024-01-01T00:00:00.000Z',
  tags: [{ id: 1, value: 'react' }],
  views: 10,
  author: {
    id: 123,
    username: 'author123',
    avatar: '/avatar.jpg',
    firstName: 'John',
    lastName: 'Doe',
  },
  ...overrides,
});

describe('NewsList Component', () => {
  it('renders without crashing', () => {
    renderWithProvider(<NewsList />, {
      preloadedState: {
        newsReducer: {
          posts: [],
          total: 0,
          loading: 'idle',
          error: null,
        },
      },
    });

    const newsHeading = screen.getByRole('heading', { name: /News/i });
    expect(newsHeading).toBeInTheDocument();
  });

  it('shows loading message when loading is pending', () => {
    renderWithProvider(<NewsList />, {
      preloadedState: {
        ...basePreloadedState,
        newsReducer: {
          ...basePreloadedState.newsReducer,
          loading: 'pending',
        },
      },
    });

    const loadingText = screen.getByText(/Loading news/i);
    expect(loadingText).toBeInTheDocument();
  });

  it('shows error message when loading failed', () => {
    renderWithProvider(<NewsList />, {
      preloadedState: {
        ...basePreloadedState,
        newsReducer: {
          ...basePreloadedState.newsReducer,
          loading: 'failed',
          error: 'Network error',
        },
      },
    });

    const errorText = screen.getByText(/Error: Network error/i);
    expect(errorText).toBeInTheDocument();
  });

  it('renders list of news when loading succeeded', () => {
    renderWithProvider(<NewsList />, {
      preloadedState: {
        newsReducer: {
          posts: [createMockPost()],
          total: 1,
          loading: 'succeeded',
          error: null,
        },
      },
    });

    const postTitle = screen.getByText(/Test News Title/i);
    expect(postTitle).toBeInTheDocument();

    const authorName = screen.getByText(/Author: John Doe/i);
    expect(authorName).toBeInTheDocument();

    const tag = screen.getByText(/#react/i);
    expect(tag).toBeInTheDocument();

    const totalNews = screen.getByText(/Total news: 1/i);
    expect(totalNews).toBeInTheDocument();
  });

  it('renders multiple news posts correctly', () => {
    renderWithProvider(<NewsList />, {
      preloadedState: {
        newsReducer: {
          posts: [
            createMockPost({
              id: 1,
              title: 'First Post',
              tags: [{ id: 1, value: 'react' }],
              author: {
                id: 1,
                username: 'user1',
                avatar: '/avatar1.jpg',
                firstName: 'Alice',
                lastName: 'Smith',
              },
            }),
            createMockPost({
              id: 2,
              title: 'Second Post',
              tags: [{ id: 2, value: 'redux' }],
              author: {
                id: 2,
                username: 'user2',
                avatar: '/avatar2.jpg',
                firstName: 'Bob',
                lastName: 'Johnson',
              },
            }),
          ],
          total: 2,
          loading: 'succeeded',
          error: null,
        },
      },
    });

    expect(screen.getByText(/First Post/i)).toBeInTheDocument();
    expect(screen.getByText(/Second Post/i)).toBeInTheDocument();

    expect(screen.getByText(/Author: Alice Smith/i)).toBeInTheDocument();
    expect(screen.getByText(/Author: Bob Johnson/i)).toBeInTheDocument();

    expect(screen.getByText(/#react/i)).toBeInTheDocument();
    expect(screen.getByText(/#redux/i)).toBeInTheDocument();

    expect(screen.getByText(/Total news: 2/i)).toBeInTheDocument();
  });
});
