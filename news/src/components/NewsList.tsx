import { FC, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  fetchNews,
  selectNews,
  selectNewsLoading,
  selectNewsError,
  selectNewsTotal,
  FetchNewsParams,
} from '../store/newsSlice';
import { Post } from '../store/types';
import { AppDispatch } from '../store/store';
import { Link } from 'react-router-dom';

import styles from './styles/NewsList.module.css';
import { isWeekend } from '../utils/weekend';

const NewsList: FC = () => {
  const news = useSelector(selectNews);
  const total = useSelector(selectNewsTotal);
  const loading = useSelector(selectNewsLoading);
  const error = useSelector(selectNewsError);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const params: FetchNewsParams = {
      order: 'desc',
      limit: 10,
      offset: 0,
    };
    dispatch(fetchNews(params));
  }, [dispatch]);

  if (loading === 'pending') {
    return <div>Loading news...</div>;
  }

  if (loading === 'failed' && error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className={styles.container}>
      <h1>News</h1>
      <p>{isWeekend()}</p>
      <p>Total news: {total}</p>
      <ul>
        {news.map((post: Post) => (
          <li key={post.id} className={styles.item}>
            <Link to={`/posts/${post.id}`} className={styles.link}>
              <h2 className={styles.title}>{post.title}</h2>
            </Link>
            <p>
              Author: {post.author?.firstName} {post.author?.lastName}
            </p>
            <div className={styles.tags}>
              Tags:{' '}
              {post.tags.map(tag => (
                <span key={tag.id} className={styles.tag}>
                  #{tag.value}{' '}
                </span>
              ))}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NewsList;
