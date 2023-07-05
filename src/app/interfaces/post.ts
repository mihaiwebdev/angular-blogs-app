export interface Post {
  id?: string;
  title: string;
  permalink: string;
  excerpt: string;
  content: string;
  category: {
    name: string;
    id: string;
  };
  image: string;
  isFeatured: boolean;
  views: number;
  status: string;
  createdAt: Date;
}
