import { useEffect } from 'react';
import { Route, Routes, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getUser, selectToken } from './store/authSlice';
import { AppDispatch } from './store/store';
import NewsList from './components/NewsList';
import NewsDetail from './components/NewsDetail';
import UserProfile from './components/UserProfile';
import UserProfileEdit from './components/userProfileEdit';
import UserList from './components/UserList';
import RegisterForm from './components/RegisterForm';
import LoginForm from './components/LoginForm';

function App() {
  const dispatch = useDispatch<AppDispatch>();
  const token = useSelector(selectToken);
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      dispatch(getUser());
    }
  }, [dispatch, token]);

  useEffect(() => {
    if (token) {
      navigate('/');
    }
  }, [token, navigate]);

  return (
    <div>
      <nav>
        <ul>
          <li>
            <Link to="/">News</Link>
          </li>
          <li>
            <Link to="/users/1">User Profile</Link>
          </li>
          <li>
            <Link to="/users/1/edit">Edit User Profile</Link>
          </li>
          <li>
            <Link to="/users">Users</Link>
          </li>
          <li>
            <Link to="/register">Register</Link>
          </li>
          <li>
            <Link to="/login">Login</Link>
          </li>
        </ul>
      </nav>
      <Routes>
        <Route path="/" element={<NewsList />} />
        <Route path="/posts/:postId" element={<NewsDetail />} />
        <Route path="/users/:userId" element={<UserProfile />} />
        <Route path="/users/:userId/edit" element={<UserProfileEdit />} />
        <Route path="/users" element={<UserList />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/login" element={<LoginForm />} />
      </Routes>
    </div>
  );
}

export default App;
