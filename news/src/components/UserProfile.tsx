import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import {
  fetchUserById,
  selectUser,
  selectUserLoading,
  selectUserError,
} from '../store/userSlice';
import { AppDispatch } from '../store/store';
import styles from './styles/UserProfile.module.css';
import { getAvatarOrDefault } from '../utils/userUtils';

const UserProfile: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const user = useSelector(selectUser);
  const loading = useSelector(selectUserLoading);
  const error = useSelector(selectUserError);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (userId) {
      dispatch(fetchUserById(parseInt(userId, 10)));
    }
  }, [dispatch, userId]);

  const defaultAvatar = '/images/default_avatar.png';
  const avatarPath = user
    ? getAvatarOrDefault(user.avatarPath, defaultAvatar)
    : defaultAvatar;

  if (loading === 'pending') {
    return <div className={styles.container}>Loading user data...</div>;
  }

  if (error) {
    return <div className={styles.container}>Error: {error}</div>;
  }

  if (!user) {
    return <div className={styles.container}>User not found.</div>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>User Profile</h1>
      <img src={avatarPath} alt="User Avatar" className={styles.avatar} />
      <p className={styles.info}>
        Name: {user.firstName} {user.lastName}
      </p>
      <p className={styles.info}>Email: {user.email}</p>
      <p className={styles.info}>Rating: {user.rating}</p>
    </div>
  );
};

export default UserProfile;
