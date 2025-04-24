export const getAvatarOrDefault = (
  avatarPath: string | undefined,
  defaultAvatar: string,
): string => {
  return avatarPath && avatarPath.trim() !== '' ? avatarPath : defaultAvatar;
};
