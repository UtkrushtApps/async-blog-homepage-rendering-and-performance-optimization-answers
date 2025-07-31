// pages/index.tsx
import { useEffect, useState } from 'react';
import type { NextPage } from 'next';
import type { Post } from '../types/post';

const fetchPosts = async (): Promise<Post[]> => {
  const res = await fetch('/api/posts');
  if (!res.ok) {
    throw new Error('Failed to fetch posts');
  }
  const data: Post[] = await res.json();
  return data;
};

const notifyLoad = async () => {
  // Fire-and-forget: don't block UI
  await fetch('/api/notify', {
    method: 'POST',
  });
};

const BlogHome: NextPage = () => {
  const [posts, setPosts] = useState<Post[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let canceled = false;
    (async () => {
      try {
        setLoading(true);
        const data = await fetchPosts();
        if (!canceled) {
          setPosts(data);
          setError(null);
          // Notification should only fire on successful load
          // but it is fire-and-forget and not awaited
          notifyLoad();
        }
      } catch (err: any) {
        if (!canceled) {
          setError(err?.message || 'Unknown error');
          setPosts(null);
        }
      } finally {
        if (!canceled) {
          setLoading(false);
        }
      }
    })();
    return () => {
      canceled = true;
    };
  }, []);

  return (
    <main style={{ maxWidth: 680, margin: '0 auto', padding: '2rem' }}>
      <h1>Recent Posts</h1>
      {loading && <p>Loading posts...</p>}
      {error && <p style={{ color: 'red' }}>Failed to load: {error}</p>}
      {!loading && !error && posts && posts.length > 0 && (
        <ul>
          {posts.map((post) => (
            <li key={post.id} style={{ marginBottom: '1rem' }}>
              <article>
                <h2>{post.title}</h2>
                <small>
                  By {post.author} &mdash;{' '}
                  {new Date(post.date).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </small>
                <p>{post.excerpt}</p>
              </article>
            </li>
          ))}
        </ul>
      )}
      {!loading && !error && posts && posts.length === 0 && <p>No posts found.</p>}
    </main>
  );
};

export default BlogHome;
