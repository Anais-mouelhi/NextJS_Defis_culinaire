'use client';

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Image from 'next/image';

export default function PostForm() {
  const { data: session } = useSession();
  const [content, setContent] = useState("");
  const [image, setImage] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [repostContent, setRepostContent] = useState("");
  const [repostImage, setRepostImage] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch("/api/recup_post");
        const data = await response.json();
        if (response.ok) {
          setPosts(data.posts);
        } else {
          setError("Erreur lors de la récupération des posts.");
        }
      } catch (err) {
        console.error("Erreur lors de la récupération des posts :", err);
        setError("Erreur lors de la récupération des posts.");
      }
    };

    fetchPosts();
  }, []);

  const handlePostSubmit = async (e) => {
    e.preventDefault();

    if (!session) {
      setError("Vous devez être connecté pour publier un post.");
      return;
    }

    try {
      const response = await fetch("/api/poste", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: session.user.email, content, image }),
      });

      const data = await response.json();
      if (response.ok) {
        setPosts([data.post, ...posts]);
        setContent("");
        setImage("");
        setSuccess("Post publié avec succès !");
        setError("");
      } else {
        setError(data.message || "Erreur lors de la publication.");
      }
    } catch (err) {
      console.error("Erreur lors de la publication :", err);
      setError("Une erreur est survenue. Essayez à nouveau.");
    }
  };

  const handleRepostSubmit = async (e) => {
    e.preventDefault();

    if (!session) {
      setError("Vous devez être connecté pour republier un post.");
      return;
    }

    try {
      const response = await fetch("/api/repost", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: session.user.email,
          content: repostContent,
          image: repostImage,
          originalPostId: selectedPost._id,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        const updatedPost = { ...selectedPost };
        if (!updatedPost.reposts) {
          updatedPost.reposts = [];
        }
        updatedPost.reposts.push(data.repost);
        setSelectedPost(updatedPost);
        setPosts((prevPosts) =>
          prevPosts.map((post) =>
            post._id === selectedPost._id ? updatedPost : post
          )
        );
        setRepostContent("");
        setRepostImage("");
        setSuccess("Repost publié avec succès !");
        setError("");
      } else {
        setError(data.message || "Erreur lors du repost");
      }
    } catch (err) {
      console.error("Erreur lors du repost :", err);
      setError("Une erreur est survenue. Essayez à nouveau.");
    }
  };

  const handleSelectPost = (post) => {
    setSelectedPost(post);
    setRepostContent("");
    setRepostImage("");
  };

  const handleBackToPosts = () => {
    setSelectedPost(null);
  };

  return (
    <div className="flex max-w-7xl mx-auto p-6 bg-black text-white min-h-screen">
      <div className="w-full lg:w-2/3 pr-6 space-y-6">
        {/* Section : Ajouter un Nouveau Post */}
        <div className="p-6 bg-gray-900 rounded-xl shadow-lg">
          <h4 className="text-xl font-semibold mb-4">Ajouter un Nouveau Post</h4>
          <form onSubmit={handlePostSubmit} className="space-y-4">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Écrivez votre post ici"
              required
              className="w-full p-4 bg-gray-800 border border-gray-700 rounded-lg shadow-md text-gray-200 focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              placeholder="URL de l'image (facultatif)"
              className="w-full p-4 bg-gray-800 border border-gray-700 rounded-lg shadow-md text-gray-200 focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="w-full py-3 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 transition duration-300"
            >
              Publier
            </button>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            {success && <p className="text-green-500 text-sm">{success}</p>}
          </form>
        </div>

        {/* Section : Liste des Posts récents */}
        <h3 className="text-3xl font-bold text-white mb-4">Posts récents</h3>
        {posts.length > 0 ? (
          posts.map((post) => (
            <div
              key={post._id}
              className="p-4 bg-gray-800 rounded-xl shadow-md cursor-pointer hover:bg-gray-700 transition"
              onClick={() => handleSelectPost(post)}
            >
              <h4 className="text-xl font-semibold text-blue-500">
                {post.userName}
              </h4>
              <p className="text-gray-300 mt-2">{post.content}</p>
              {post.image && (
                <Image 
                  src={post.image}
                  alt="Post Image"
                  className="mt-2 rounded-lg max-w-full h-auto"
                />
              )}
              {post.reposts && post.reposts.length > 0 && (
                <p className="text-sm text-gray-400 mt-2">
                  {post.reposts.length === 1
                    ? "Repost 1"
                    : `Reposts ${post.reposts.length}`}
                </p>
              )}
            </div>
          ))
        ) : (
          <p className="text-gray-400">Aucun post à afficher pour le moment.</p>
        )}
      </div>

      {/* Sidebar : Détails du post */}
      {selectedPost && (
        <div className="w-full lg:w-1/3 p-6 bg-gray-900 rounded-xl shadow-lg">
          <h3 className="text-2xl font-semibold mb-4">Détails du Post</h3>
          <button
            onClick={handleBackToPosts}
            className="mb-4 text-blue-500 hover:text-blue-400 transition"
          >
            &larr; Retour aux posts récents
          </button>
          <div className="mb-4">
            <h4 className="text-xl font-semibold">{selectedPost.userName}</h4>
            <p className="text-gray-300 mt-2">{selectedPost.content}</p>
            {selectedPost.image && (
              <Image
                src={selectedPost.image}
                alt="Post Image"
                className="mt-4 rounded-lg max-w-full h-auto"
              />
            )}
            {selectedPost.reposts && selectedPost.reposts.length > 0 && (
              <div className="mt-4">
                <h4 className="text-lg font-semibold">Reposts:</h4>
                {selectedPost.reposts.map((repost, index) => (
                  <div
                    key={index}
                    className="p-4 bg-gray-800 rounded-lg mt-2 shadow-md"
                  >
                    <p className="text-gray-300">{repost.content}</p>
                    {repost.image && (
                      <Image 
                        src={repost.image}
                        alt="Repost Image"
                        className="mt-2 rounded-lg max-w-full h-auto"
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          <form onSubmit={handleRepostSubmit} className="space-y-4 mt-4">
            <textarea
              value={repostContent}
              onChange={(e) => setRepostContent(e.target.value)}
              placeholder="Écrivez votre réponse ici"
              required
              className="w-full p-4 bg-gray-800 border border-gray-700 rounded-lg shadow-md text-gray-200 focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              value={repostImage}
              onChange={(e) => setRepostImage(e.target.value)}
              placeholder="URL de l'image (facultatif)"
              className="w-full p-4 bg-gray-800 border border-gray-700 rounded-lg shadow-md text-gray-200 focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="w-full py-3 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 transition duration-300"
            >
              Publier
            </button>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            {success && <p className="text-green-500 text-sm">{success}</p>}
          </form>
        </div>
      )}
    </div>
  );
}
