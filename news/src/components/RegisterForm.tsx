import React, { useState, FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  registerUser,
  selectAuthLoading,
  selectAuthError,
} from '../store/authSlice';
import { AppDispatch } from '../store/store';
import { useNavigate } from 'react-router-dom';
import styles from './styles/RegisterForm.module.css';

const RegisterForm: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch<AppDispatch>();
  const loading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const resultAction = await dispatch(registerUser({ email, password }));
      if (registerUser.fulfilled.match(resultAction)) {
        navigate('/profile');
      } else {
        console.error('Registration failed:', resultAction.payload);
      }
    } catch (error) {
      console.error('An unexpected error occurred:', error);
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Register</h1>
      {error && <div className={styles.error}>{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label htmlFor="email" className={styles.label}>
            Email:
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
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
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            className={styles.input}
          />
        </div>
        <button
          type="submit"
          disabled={loading === 'pending'}
          className={styles.button}
        >
          {loading === 'pending' ? 'Registering...' : 'Register'}
        </button>
      </form>
    </div>
  );
};

export default RegisterForm;
