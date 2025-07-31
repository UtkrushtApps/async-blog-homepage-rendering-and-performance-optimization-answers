// pages/api/posts.ts
import type { NextApiRequest, NextApiResponse } from 'next'

// Define the Post type
export type Post = {
  id: string;
  title: string;
  excerpt: string;
  author: string;
  date: string; // ISO string
};

// Mock post data
const posts: Post[] = [
  {
    id: '1',
    title: 'How Async/Await Improves Readability',
    excerpt: "Let's look at why async code is easier to write with await.",
    author: 'Alice',
    date: new Date('2024-04-01').toISOString(),
  },
  {
    id: '2',
    title: 'Top 5 NextJs Performance Tips',
    excerpt: 'Boost your NextJs sites with these simple tips.',
    author: 'Bob',
    date: new Date('2024-04-12').toISOString(),
  },
  {
    id: '3',
    title: 'Interview With a TypeScript Maintainer',
    excerpt: "An exclusive Q&A about the future of TypeScript.",
    author: 'Carla',
    date: new Date('2024-06-01').toISOString(),
  },
];

async function simulateDelay(ms: number) {
  // Optionally simulate slow API by random ms
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Post[] | { error: string }>
) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method Not Allowed' });
    return;
  }
  // Randomly fail for demonstration
  if (Math.random() < 0.10) {
    await simulateDelay(400);
    res.status(500).json({ error: 'Internal server error' });
    return;
  }
  await simulateDelay(350 + Math.random() * 300);
  res.status(200).json(posts);
}
