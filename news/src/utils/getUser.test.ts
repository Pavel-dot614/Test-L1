import { User } from '../store/types';
import { getUserDisplayName } from './getUser';

describe('getUserDisplayName Function', () => {
  let baseUser: User;
  const EXAMPLE_URL = 'Pavel.soh@example.com';
  const defaultName = 'Pavel';
  const defaultLastName = 'Soh';

  beforeEach(() => {
    baseUser = {
      id: 1,
      firstName: '',
      lastName: '',
      email: EXAMPLE_URL,
      avatarPath: '/avatar.png',
      createdAt: '',
      updatedAt: '',
    };
  });

  const createUser = (firstName: string, lastName: string): User => ({
    ...baseUser,
    firstName,
    lastName,
  });

  it('should return full name if both firstName and lastName are present', () => {
    const user = createUser(defaultName, defaultLastName);
    const result = getUserDisplayName(user);
    expect(result).toBe(`${defaultName} ${defaultLastName}`);
  });

  it('should return firstName if only firstName is present', () => {
    const user = createUser(defaultName, '');
    const result = getUserDisplayName(user);
    expect(result).toBe(defaultName);
  });

  it('should return lastName if only lastName is present', () => {
    const user = createUser('', defaultLastName);
    const result = getUserDisplayName(user);
    expect(result).toBe(defaultLastName);
  });

  it('should return email if neither firstName nor lastName are present', () => {
    const user: User = { ...baseUser, firstName: '', lastName: '' };
    const result = getUserDisplayName(user);
    expect(result).toBe(EXAMPLE_URL);
  });

  it('should handle empty strings for names gracefully', () => {
    const user: User = { ...baseUser, firstName: '', lastName: '' };
    const result = getUserDisplayName(user);
    expect(result).toBe(EXAMPLE_URL);
  });

  it('should handle only spaces for names gracefully', () => {
    const user: User = { ...baseUser, firstName: '   ', lastName: '   ' };
    const result = getUserDisplayName(user);
    expect(result).toBe(EXAMPLE_URL);
  });

  it('should handle a mix of empty string and defined names', () => {
    const user = createUser(defaultName, '');
    const result = getUserDisplayName(user);
    expect(result).toBe(defaultName);
  });
});
