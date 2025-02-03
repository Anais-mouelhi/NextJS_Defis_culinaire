'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image'; // Import the Image component

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
    <div className="max-w-3xl mx-auto p-6 bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-6 text-center">Threads</h1>
      <Link href="/create-post">
        <button className="bg-blue-600 text-white px-6 py-3 rounded-lg mb-6 transition transform hover:bg-blue-700 hover:scale-105">
          Créer un Nouveau Post
        </button>
      </Link>

      <ul className="space-y-8">
        {Array.isArray(posts) && posts.length > 0 ? (
          posts.map((post) => (
            <li key={post._id} className="bg-gray-800 p-6 rounded-lg shadow-lg hover:shadow-2xl transition duration-300">
              <div className="flex items-center mb-4">
                <div className="rounded-full bg-gray-700 w-12 h-12 flex items-center justify-center mr-4">
                  <span className="text-xl text-white">{post.userId?.email?.charAt(0) || '?'}</span>
                </div>
                <div>
                  <p className="text-sm text-gray-400">{post.userId?.email || 'Utilisateur inconnu'}</p>
                  <p className="text-xs text-gray-500">{new Date(post.createdAt).toLocaleDateString()}</p>
                </div>
              </div>

              <h2 className="text-2xl font-semibold text-gray-100 mb-3">{post.title}</h2>
              <p className="text-gray-300 mb-4">{post.content}</p>

              {post.mediaUrl && (
                <div className="overflow-hidden rounded-lg mb-4">
                  <Image
                    className="w-full h-64 object-cover transform hover:scale-105 transition duration-300"
                    src={post.mediaUrl}
                    alt={`Media for ${post.title}`}
                    width={500}
                    height={300}
                    layout="responsive"
                  />
                </div>
              )}

              <Link href={`/posts/${post._id}`} className="text-blue-500 hover:text-blue-700 text-sm">
                Lire plus ➔
              </Link>
            </li>
          ))
        ) : (
          <p className="text-center text-gray-500">Aucun post disponible.</p>
        )}
      </ul>
    </div>
  );
};

export default ThreadsPage;
