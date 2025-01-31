"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

// Fonction pour récupérer les recettes depuis l'API
const fetchRecipes = async () => {
  try {
    const res = await fetch("/api/recipes", {
      cache: "no-store", // Désactive la mise en cache côté serveur
    });

    if (!res.ok) {
      throw new Error("Erreur lors du chargement des recettes");
    }
    return res.json();
  } catch (error) {
    console.error("Erreur lors du chargement des recettes :", error);
    return [];
  }
};

export default function Home() {
  const [recipes, setRecipes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fonction pour charger les recettes périodiquement
  const loadRecipes = async () => {
    setLoading(true);
    const data = await fetchRecipes();
    setRecipes(data);
    setLoading(false);
  };

  useEffect(() => {
    loadRecipes(); // Chargement initial des recettes

    // Mettre à jour les recettes toutes les 10 secondes (pour les tests)
    const interval = setInterval(() => {
      console.log("🔄 Mise à jour hebdomadaire des recettes...");
      loadRecipes();
    }, 7 * 24 * 60 * 60 * 1000); // 7 jours en millisecondes

    return () => clearInterval(interval); // Nettoyage de l'intervalle lorsque le composant est démonté
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-8 bg-fuchsia-50">
      {/* Hero Section */}
      <div className="w-full relative flex flex-col h-[calc(100vh-6rem)] md:h-[calc(100vh-9rem)] lg:flex-row p-8 ">
        <div className="flex-1 flex items-center justify-center flex-col gap-8 text-white font-bold z-10">
          <h1 className="text-3xl text-center text-red-500 uppercase p-4 md:p-10 md:text-6xl xl:text-8xl">
            Prêt à relever le défi ?
          </h1>
        </div>
        <div className="w-full flex-1 relative">
          <Image
            src="/assets/food.jpg"
            alt="Food"
            fill
            className="object-cover rounded-lg"
          />
          <div className="absolute inset-0 bg-black opacity-30 rounded-lg"></div>
        </div>
      </div>

      {/* Section des recettes */}
      <h1 className="text-4xl font-bold pt-6 pb-3 text-left mb-10">
  Recettes de la semaine
</h1>
{loading ? (
  <p className="text-gray-500">Chargement des recettes...</p>
) : (
  <div className="flex flex-wrap justify-start">
    {recipes.length > 0 ? (
      recipes.map((recipe) => (
        <div
          key={recipe._id}
          className="flex-none bg-white overflow-hidden rounded-lg mb-4 cursor-pointer basis-full md:basis-1/2 lg:basis-1/3 px-2"
        >
          <div className="w-full h-80 overflow-hidden rounded-md">
            <Image
              src={recipe.photo}
              alt={recipe.titre}
              width={300}
              height={200}
              className="object-cover w-full h-full"
              priority
            />
          </div>
          <div className="px-5 py-4">
            <h2 className="text-3xl font-semibold mt-4">{recipe.titre}</h2>
            <p className="text-gray-600">{recipe.pays}</p>
            <Link
              href={`/recipe/${recipe._id}`}
              className="text-blue-500 mt-2 inline-block hover:text-blue-700 transition-colors duration-300"
            >
              Commencer le défi →
            </Link>
          </div>
        </div>
      ))
    ) : (
      <p className="text-gray-500">Aucune recette disponible</p>
    )}
  </div>
)}
    </main>
  );
}