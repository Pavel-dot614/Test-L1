import { useState, FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  loginUser,
  selectAuthLoading,
  selectAuthError,
  selectToken,
} from '../store/authSlice';
import { AppDispatch } from '../store/store';
import { useNavigate } from 'react-router-dom';

const LoginForm: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch<AppDispatch>();
  const loading = useSelector(selectAuthLoading);
  const error = useSelector(selectAuthError);
  const token = useSelector(selectToken);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const resultAction = await dispatch(loginUser({ email, password }));

      if (loginUser.fulfilled.match(resultAction)) {
        console.log(
          'Login successful, token:',
          resultAction.payload.accessToken,
        );
        navigate('/');
      } else {
        console.error('Login failed:', resultAction.payload);
      }
    } catch (error) {
      console.error('An unexpected error occurred:', error);
    }
  };

  if (token) {
    navigate('/');
    return null;
  }

  return (
    <div>
      <h1>Login</h1>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={loading === 'pending'}>
          {loading === 'pending' ? 'Logging in...' : 'Login'}
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
