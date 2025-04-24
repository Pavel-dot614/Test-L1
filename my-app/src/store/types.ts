export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  avatarPath: string;
  createdAt: string;
  updatedAt: string;
  rating?: number;
}

export interface UpdateUserRequest {
  email?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  file?: File | null;
}

export interface Tag {
  id: number;
  value: string;
  createdAt: string;
  updatedAt: string;
}

export interface Post {
  id: number;
  title: string;
  text: string;
  coverPath: string | null;
  authorId: number;
  createdAt: string;
  updatedAt: string;
  rating: number;
  commentsCount: number;
  author: User;
  tags: Tag[];
}

export interface NewsResponse {
  posts: Post[];
  total: number;
}
