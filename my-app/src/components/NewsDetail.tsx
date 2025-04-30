import React, { FC, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { selectNewsLoading, selectNewsError } from '../store/newsSlice';
import { Post } from '../store/types';
import axios from 'axios';
import styles from './styles/NewsDetail.module.css';
import { formatDate, formatTimeAgo } from '../utils/dateUtils';
import PostMeta from './PostMeta';

const NewsDetail: FC = () => {
  const { postId } = useParams<{ postId: string }>();
  const [post, setPost] = React.useState<Post | null>(null);
  const loading = useSelector(selectNewsLoading);
  const error = useSelector(selectNewsError);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get<Post>(
          `https://api.news.academy.dunice.net/posts/${postId}`,
        );
        setPost(response.data);
      } catch (error) {
        console.error('Error fetching news detail:', error);
      }
    };

    if (postId) {
      fetchPost();
    }
  }, [postId]);

  if (loading === 'pending') {
    return <div>Loading news detail...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!post) {
    return <div>News not found.</div>;
  }

  const formattedDate = post.createdAt
    ? formatDate(new Date(post.createdAt))
    : 'Unknown date';
  const timeAgo = post.createdAt
    ? formatTimeAgo(post.createdAt)
    : 'Unknown time';

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>{post.title}</h1>
      <PostMeta
  author={post.author}
  createdAt={post.createdAt}
/>
      <p className={styles.date}>
        Published on: {formattedDate} ({timeAgo})
      </p>
      <p className={styles.text}>{post.text}</p>
      <div className={styles.tags}>
        Tags:{' '}
        {post.tags.map(tag => (
          <span key={tag.id} className={styles.tag}>
            #{tag.value}{' '}
          </span>
        ))}
      </div>
    </div>
  );
};

export default NewsDetail;
