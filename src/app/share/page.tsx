'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

interface Post {
  _id: string;
  title: string;
  content: string;
  mediaUrl?: string;
  createdAt: Date;
  userId?: {
    email?: string;
  };
}

const ThreadsPage: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/get-posts');

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setPosts(data.posts);
      } catch (error) {
        setError('Erreur lors de la récupération des posts.');
        console.error('Erreur lors de la récupération des posts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return <p className="text-center mt-4 text-white">Chargement des posts...</p>;
  }

  if (error) {
    return <p className="text-center mt-4 text-red-500">{error}</p>;
  }

  return (
    <div className="max-w-2xl mx-auto p-4 bg-gray-900 text-white">
      <h1 className="text-2xl font-bold mb-4">Threads</h1>
      <Link href="/create-post">
        <button className="bg-blue-500 text-white px-4 py-2 rounded mb-4 hover:bg-blue-600">
          Créer un Nouveau Post
        </button>
      </Link>
      <ul className="space-y-4">
        {Array.isArray(posts) && posts.length > 0 ? (
          posts.map((post) => (
            <li key={post._id} className="border-b border-gray-700 pb-4">
              <div className="flex items-center mb-2">
                <div className="rounded-full bg-gray-700 w-10 h-10 flex items-center justify-center mr-2">
                  <span className="text-sm">{post.userId?.email?.charAt(0) || '?'}</span>
                </div>
                <p className="text-sm text-gray-400">{post.userId?.email || 'Utilisateur inconnu'}</p>
              </div>
              <h2 className="text-xl font-semibold">{post.title}</h2>
              <p className="text-gray-300">{post.content}</p>
              {post.mediaUrl && (
                <img className="mt-2 max-w-full h-auto rounded-lg border border-gray-700" src={post.mediaUrl} alt={`Media for ${post.title}`} />
              )}
            </li>
          ))
        ) : (
          <p>Aucun post disponible.</p>
        )}
      </ul>
    </div>
  );
};

export default ThreadsPage;