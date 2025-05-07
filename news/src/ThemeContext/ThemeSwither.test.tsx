import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeContext } from './ThemeContext';
import ThemeSwitcher from './ThemeSwither';

describe('ThemeSwitcher', () => {
  it('renders current theme and toggles it on click', () => {
    const toggleTheme = jest.fn();

    render(
      <ThemeContext.Provider value={{ theme: 'dark', toggleTheme }}>
        <ThemeSwitcher />
      </ThemeContext.Provider>,
    );

    expect(screen.getByText(/current theme: dark/i)).toBeInTheDocument();

    fireEvent.click(screen.getByText(/toggle theme/i));

    expect(toggleTheme).toHaveBeenCalledTimes(1);
  });
});
