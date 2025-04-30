import { User } from '../store/types';

export const getUserDisplayName = (user: User): string => {
  const firstName = user.firstName ? user.firstName.trim() : '';
  const lastName = user.lastName ? user.lastName.trim() : '';

  if (firstName && lastName) {
    return `${firstName} ${lastName}`;
  }
  if (firstName) {
    return firstName;
  }
  if (lastName) {
    return lastName;
  }
  return user.email;
};
