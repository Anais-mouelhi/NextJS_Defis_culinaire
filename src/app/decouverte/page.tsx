"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

interface Cuisine {
  id: number;
  name: string;
  image: string;
  description: string;
  articleUrl: string;
}

const DiscoveryPage = () => {
  const worldCuisines: Cuisine[] = [
    {
      id: 1,
      name: "Cuisine Japonaise",
      image: "https://images.pexels.com/photos/8951404/pexels-photo-8951404.jpeg",
      description: "Découvrez les délices du Japon avec des recettes savoureuses.",
      articleUrl: "https://www.cuisine-japon.fr/",
    },
    {
      id: 2,
      name: "Cuisine Italienne",
      image: "https://images.pexels.com/photos/2233729/pexels-photo-2233729.jpeg",
      description: "Les classiques de l&apos;Italie qui régalent vos papilles.",  
      articleUrl: "https://www.lacuisineitalienne.fr/",
    },
    {
      id: 3,
      name: "Cuisine Marocaine",
      image: "https://images.pexels.com/photos/2519390/pexels-photo-2519390.jpeg",
      description: "Les parfums et saveurs envoûtants du Maroc.",
      articleUrl: "https://www.la-cuisine-marocaine.com/",
    },
  ];

  return (
    <div className="p-8 bg-gradient-to-r from-green-50 via-white to-yellow-50">
      <h1 className="text-4xl font-bold text-center mb-8 text-green-700">
        🌱 Découverte des Tendances Culinaires du Monde
      </h1>

      {/* Section À la Une */}
      <section className="mb-12">
        <motion.div
          className="relative rounded-lg overflow-hidden mb-6"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <Image
            src="https://images.pexels.com/photos/70497/pexels-photo-70497.jpeg"
            alt="Cuisine du monde"
            width={1200}
            height={400}
            className="w-full rounded-2xl shadow-lg"
          />
          <h2 className="absolute bottom-4 left-6 text-white font-bold text-3xl bg-black bg-opacity-50 px-4 py-2 rounded-md">
            Tendances À Ne Pas Manquer
          </h2>
        </motion.div>
      </section>

      {/* Liste des cuisines */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {worldCuisines.map((cuisine) => (
          <motion.a
            key={cuisine.id}
            href={cuisine.articleUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-white rounded-2xl shadow-xl p-4 hover:scale-105 transition-transform cursor-pointer"
            whileHover={{ y: -5 }}
          >
            <Image
              src={cuisine.image}
              alt={cuisine.name}
              width={400}
              height={250}
              className="rounded-xl object-cover w-full h-64"
            />
            <h3 className="text-xl font-semibold mt-4 mb-2 text-green-600">
              {cuisine.name}
            </h3>
            <p className="text-gray-600">{cuisine.description}</p>
            <span className="block mt-4 text-blue-500 hover:text-blue-700">
              Lire l&apos;article ➔  {/* Escaped apostrophe here */}
            </span>
          </motion.a>
        ))}
      </div>
    </div>
  );
};

export default DiscoveryPage;
