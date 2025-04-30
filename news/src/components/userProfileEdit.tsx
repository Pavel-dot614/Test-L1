import { useState, useEffect, FC } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import {
  fetchUserById,
  updateUser,
  selectUser,
  selectUserLoading,
  selectUserError,
} from '../store/userSlice';
import { AppDispatch } from '../store/store';
import styles from './styles/UserProfileEdit.module.css';

interface UpdateUserRequest {
  email?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  file?: File | null;
}

const UserProfileEdit: FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const user = useSelector(selectUser);
  const loading = useSelector(selectUserLoading);
  const error = useSelector(selectUserError);
  const dispatch = useDispatch<AppDispatch>();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  useEffect(() => {
    if (userId) {
      dispatch(fetchUserById(parseInt(userId, 10)));
    }
  }, [dispatch, userId]);

  useEffect(() => {
    if (user) {
      setEmail(user.email || '');
      setFirstName(user.firstName || '');
      setLastName(user.lastName || '');
      if (user.avatarPath) {
        setAvatarPreview(user.avatarPath);
      }
    }
  }, [user]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] || null;
    setFile(selectedFile);

    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    } else {
      setAvatarPreview(user?.avatarPath || null);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!userId) {
      console.error('User ID is missing.');
      return;
    }

    const updateData: UpdateUserRequest = {
      email,
      password,
      firstName,
      lastName,
      file,
    };

    const userIdNumber = parseInt(userId, 10);

    if (isNaN(userIdNumber)) {
      console.error('Invalid user ID.');
      return;
    }

    try {
      const resultAction = await dispatch(
        updateUser({ userId: userIdNumber, updateData }),
      );

      if (updateUser.fulfilled.match(resultAction)) {
        alert('Profile updated successfully!');
      } else if (updateUser.rejected.match(resultAction)) {
        alert(`Error updating profile: ${resultAction.payload}`);
      }
    } catch (error) {
      alert('An unexpected error occurred.');
      console.error('Unexpected error:', error);
    }
  };

  if (loading === 'pending') {
    return <div className={styles.container}>Loading...</div>;
  }

  if (error) {
    return <div className={styles.container}>Error: {error}</div>;
  }

  if (!user) {
    return <div className={styles.container}>User not found.</div>;
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Edit Profile</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label htmlFor="email" className={styles.label}>
            Email:
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className={styles.input}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="password" className={styles.label}>
            Password:
          </label>
          <input
            type="password"
            id="password"
            onChange={e => setPassword(e.target.value)}
            className={styles.input}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="firstName" className={styles.label}>
            First Name:
          </label>
          <input
            type="text"
            id="firstName"
            value={firstName}
            onChange={e => setFirstName(e.target.value)}
            className={styles.input}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="lastName" className={styles.label}>
            Last Name:
          </label>
          <input
            type="text"
            id="lastName"
            value={lastName}
            onChange={e => setLastName(e.target.value)}
            className={styles.input}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="file" className={styles.label}>
            Avatar:
          </label>
          <input
            type="file"
            id="file"
            onChange={handleFileChange}
            className={styles.input}
          />
          {avatarPreview && (
            <img
              src={avatarPreview}
              alt="Avatar Preview"
              className={styles.avatarPreview}
            />
          )}
        </div>
        <button
          type="submit"
          disabled={
            loading ===
            ('pending' as 'idle' | 'pending' | 'succeeded' | 'failed')
          }
          className={styles.button}
        >
          {loading ===
          ('pending' as 'idle' | 'pending' | 'succeeded' | 'failed')
            ? 'Updating...'
            : 'Update Profile'}
        </button>
      </form>
    </div>
  );
};

export default UserProfileEdit;
