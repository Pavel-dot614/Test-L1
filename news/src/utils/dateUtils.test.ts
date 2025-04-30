import { formatDate, formatTimeAgo } from './dateUtils';

describe('Date Utility Functions', () => {
  it('returns the date in the correct format', () => {
    const date = new Date(2024, 0, 20);
    expect(formatDate(date)).toBe('Saturday, January 20, 2024');
  });

  it('should format time ago in seconds', () => {
    const now = new Date();
    const past = new Date(now.getTime() - 50 * 1000);
    expect(formatTimeAgo(past.toISOString())).toBe('50s ago');
  });

  it('should format time ago in minutes', () => {
    const now = new Date();
    const past = new Date(now.getTime() - 10 * 60 * 1000);
    expect(formatTimeAgo(past.toISOString())).toBe('10m ago');
  });

  it('should format time ago in hours', () => {
    const now = new Date();
    const past = new Date(now.getTime() - 2 * 60 * 60 * 1000);
    expect(formatTimeAgo(past.toISOString())).toBe('2h ago');
  });

  it('should format time ago in days', () => {
    const now = new Date();
    const past = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
    expect(formatTimeAgo(past.toISOString())).toBe('3 days ago');
  });

  it('should format a date with a specific timezone', () => {
    const date = new Date(Date.UTC(2024, 0, 20, 12, 0, 0));
    expect(formatDate(date)).toBe('Saturday, January 20, 2024');
  });

  it('should format a leap year date correctly', () => {
    const date = new Date(2024, 1, 29);
    expect(formatDate(date)).toBe('Thursday, February 29, 2024');
  });
});
