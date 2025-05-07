import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import PostMeta from './PostMeta';

describe('PostMeta Component with props', () => {
  const mockAuthor = {
    id: 42,
    firstName: 'Alice',
    lastName: 'Johnson',
  };

  it('renders author name with link', () => {
    render(
      <MemoryRouter>
        <PostMeta author={mockAuthor} createdAt="2024-04-01T12:00:00Z" />
      </MemoryRouter>,
    );

    const authorLink = screen.getByRole('link', { name: /Alice Johnson/i });
    expect(authorLink).toBeInTheDocument();
    expect(authorLink).toHaveAttribute('href', '/users/42');
  });

  it('renders formatted date', () => {
    render(
      <MemoryRouter>
        <PostMeta author={mockAuthor} createdAt="2024-04-01T12:00:00Z" />
      </MemoryRouter>,
    );

    expect(screen.getByText(/Published:/)).toBeInTheDocument();
  });
});
