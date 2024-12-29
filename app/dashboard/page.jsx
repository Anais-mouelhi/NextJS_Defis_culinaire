"use client"; // Marque ce fichier comme un composant client

import { useEffect, useState } from "react";
import Image from 'next/image';

export default function Recipes() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Image de fallback par défaut
  const fallbackImage = "https://via.placeholder.com/256x256?text=Image+Not+Found";

  // Fonction pour obtenir la clé de la semaine actuelle (par exemple, "2023-W52")
  const getCurrentWeekKey = () => {
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const weekNumber = Math.ceil(
      ((now - startOfYear) / 86400000 + startOfYear.getDay() + 1) / 7
    );
    return `${now.getFullYear()}-W${weekNumber}`;
  };

  // Fonction pour générer l'image de la recette à partir du titre
  const generateRecipeImage = async (title) => {
    try {
      const response = await fetch("/api/generateImage", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: `A detailed dish of ${title}` }),
      });

      const data = await response.json();
      if (data.imageUrl) {
        return data.imageUrl;
      } else {
        throw new Error("Image not found");
      }
    } catch (err) {
      console.error("Error generating image:", err);
      return null;
    }
  };

  useEffect(() => {
    const fetchRecipes = async () => {
      const currentWeekKey = getCurrentWeekKey(); // Obtenez la clé de la semaine actuelle
      const storedData = localStorage.getItem(currentWeekKey); // Vérifiez si les recettes sont déjà stockées

      if (storedData) {
        // Si les recettes existent déjà dans localStorage pour la semaine actuelle
        setRecipes(JSON.parse(storedData));
        setLoading(false);
      } else {
        try {
          const response = await fetch("/api/generateRecipe", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ area: "Japon" }),
          });

          const data = await response.json();

          if (data.recipes) {
            const recipesWithImages = await Promise.all(
              data.recipes.map(async (recipe) => {
                const imageUrl = await generateRecipeImage(recipe.title);
                return { ...recipe, imageUrl: imageUrl || fallbackImage };
              })
            );
            setRecipes(recipesWithImages);

            // Enregistrer les recettes dans localStorage pour la semaine actuelle
            localStorage.setItem(currentWeekKey, JSON.stringify(recipesWithImages));
          } else {
            setError("No recipes found.");
          }
        } catch (err) {
          console.error(err);
          setError("Error fetching recipes.");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchRecipes(); // Appeler la fonction pour récupérer les recettes
  }, []); // Le tableau vide signifie que ce code sera exécuté une seule fois au montage du composant

  const handleClick = (title) => {
    // Redirection vers la page de détail avec le titre en paramètre
    window.location.href = `/detail_recette?title=${encodeURIComponent(title)}`;
  };

  if (loading) {
    return <p className="text-center py-10">Loading recipes...</p>;
  }

  if (error) {
    return <p className="text-center py-10 text-red-600">{error}</p>;
  }

  return (
    <div className="container mx-auto px-4 py-10 max-w-4xl">
      <h2 className="text-3xl font-bold text-center mb-6">World Recipes</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {recipes.map((recipe, index) => (
          <div key={index} className="bg-white p-4 duration-300">
            {/* Afficher l'image de la recette avec une taille réduite */}
            {recipe.imageUrl ? (
             <Image 
                src={recipe.imageUrl}
                alt={`Dish from ${recipe.country}`}
                className="w-full h-[350px] object-cover mb-4"
              />
            ) : (
              <div className="w-full h-[250px] bg-gray-300 flex items-center justify-center text-white">
                Image not available
              </div>
            )}

            <h3 className="text-lg font-semibold text-gray-500 mb-2">
              {recipe.country}
            </h3>
            <h4 className="text-xl font-bold text-gray-800 mb-4">
              {recipe.title}
            </h4>

            <div className="flex justify-between items-center">
              <button
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
                onClick={() => handleClick(recipe.title)} // Lancer la redirection
              >
                Faire le défi
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
