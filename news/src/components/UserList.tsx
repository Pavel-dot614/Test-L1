import { useEffect, FC } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  fetchUsers,
  selectUsers,
  selectUserLoading,
  selectUserError,
} from '../store/userSlice';
import { User } from '../store/types';
import { AppDispatch } from '../store/store';
import styles from './styles/UserList.module.css';
import { getUserDisplayName } from '../utils/getUser';

const UserList: FC = () => {
  const users = useSelector(selectUsers);
  const loading = useSelector(selectUserLoading);
  const error = useSelector(selectUserError);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  if (loading === 'pending') {
    return <div className={styles.container}>Loading users...</div>;
  }

  if (error) {
    return <div className={styles.container}>Error: {error}</div>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Users</h1>
      <ul className={styles.userList}>
        {users.map((user: User) => (
          <li key={user.id} className={styles.userItem}>
            {getUserDisplayName(user)}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
