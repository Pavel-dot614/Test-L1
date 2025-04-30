import { FC } from 'react';
import { Link } from 'react-router-dom';

type PostMetaProps = {
  author: {
    id: number;
    firstName: string;
    lastName: string;
  };
  createdAt: string;
};

const PostMeta: FC<PostMetaProps> = ({ author, createdAt }) => {
  const formattedDate = new Date(createdAt).toLocaleDateString();

  return (
    <div>
      <p>
        By{' '}
        <Link to={`/users/${author.id}`}>
          {author.firstName} {author.lastName}
        </Link>
      </p>
      <p>Published: {formattedDate}</p>
    </div>
  );
};

export default PostMeta;
