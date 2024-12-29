"use client";

import { useEffect, useState } from "react";
import Image from 'next/image';  // Assurez-vous que cette ligne est présente.

export default function RecipeDetail({ params }) {
  const { title } = params; // Accéder au titre directement via params
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRecipeDetails = async () => {
    try {
      const response = await fetch("/api/generateRecipe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title }),
      });

      const data = await response.json();

      if (response.ok) {
        const foundRecipe = data.recipes.find((r) => r.title === title);
        setRecipe(foundRecipe);
      } else {
        setError(data.error || "Recipe not found");
      }
    } catch (err) {
      setError("Error fetching recipe details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (title) {
      fetchRecipeDetails();
    }
  }, [title]);

  if (loading) {
    return <p className="text-center py-10">Loading recipe details...</p>;
  }

  if (error) {
    return <p className="text-center py-10 text-red-600">{error}</p>;
  }

  if (!recipe) {
    return <p className="text-center py-10">Recipe not found.</p>;
  }

  return (
    <div className="container mx-auto px-4 py-10 max-w-4xl">
      <h2 className="text-3xl font-bold text-center mb-6">Recipe Details</h2>
      <div className="bg-white p-4 rounded-lg shadow-md">
        <Image 
          src={recipe.imageUrl || "https://via.placeholder.com/256x256"}
          alt={recipe.title}
          className="w-full h-[350px] object-cover mb-4"
        />
        <h3 className="text-xl font-semibold text-gray-800 mb-2">{recipe.title}</h3>
        <h4 className="text-lg text-gray-500 mb-4">{recipe.country}</h4>

        <h5 className="text-lg font-bold text-gray-800 mt-4">Ingredients:</h5>
        <ul className="list-disc ml-6 mb-4">
          {recipe.ingredients.map((ingredient, index) => (
            <li key={index}>{ingredient}</li>
          ))}
        </ul>

        <h5 className="text-lg font-bold text-gray-800 mt-4">Instructions:</h5>
        <p className="text-gray-700 mb-4">{recipe.instructions.join(" ")}</p>
      </div>
    </div>
  );
}
