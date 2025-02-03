import { NextResponse } from "next/server";
import connect from "@/utils/db";
import Recipe from "@/models/Recipe";

// Définir le type des paramètres
type tParams = Promise<{ id: string }>;

// Méthode GET pour récupérer une recette par ID
export async function GET(request: Request, context: { params: tParams }) {
  // Attendre la résolution des paramètres
  const { id } = await context.params;  // id est maintenant résolu via la promesse

  // Connexion à la base de données
  await connect();

  try {
    // Recherche de la recette dans la base de données par son ID
    const recipe = await Recipe.findById(id);

    // Si la recette n'est pas trouvée, retourner une réponse 404
    if (!recipe) {
      return NextResponse.json({ message: "Recette non trouvée" }, { status: 404 });
    }

    // Retourner la recette trouvée en format JSON
    return NextResponse.json(recipe);
  } catch (error) {
    // En cas d'erreur, retourner une réponse 500 avec un message d'erreur
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
  }
}
