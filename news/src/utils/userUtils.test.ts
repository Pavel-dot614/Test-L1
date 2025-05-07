import { getAvatarOrDefault } from './userUtils';

describe('getAvatarOrDefault Function', () => {
  const defaultAvatar = '/images/default_avatar.png';

  it('should return the avatarPath if it is provided', () => {
    const avatarPath = '/images/user_avatar.png';
    const result = getAvatarOrDefault(avatarPath, defaultAvatar);
    expect(result).toBe(avatarPath);
  });

  it('should return the defaultAvatar if avatarPath is undefined', () => {
    const result = getAvatarOrDefault(undefined, defaultAvatar);
    expect(result).toBe(defaultAvatar);
  });

  it('should return the defaultAvatar if avatarPath is an empty string', () => {
    const result = getAvatarOrDefault('', defaultAvatar);
    expect(result).toBe(defaultAvatar);
  });

  it('should return a custom default avatar if provided', () => {
    const customDefaultAvatar = '/images/custom_default.png';
    const result = getAvatarOrDefault(undefined, customDefaultAvatar);
    expect(result).toBe(customDefaultAvatar);
  });
});
