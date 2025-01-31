import { NextResponse } from "next/server";  // Importation de NextResponse pour retourner une réponse
import Recipe from "@/models/Recipe"; // Importation du modèle Recipe
import connect from "@/utils/db";  // Importation de la fonction pour connecter à la base de données

export async function GET() {
  try {
    // Connexion à la base de données
    await connect();
    
    const recipes = await Recipe.find().sort({ createdAt: -1 }).limit(3);

    // Récupérer toutes les recettes depuis la base de données
    const recettes = await Recipe.find();

    // Si on a des recettes, on renvoie un statut 200 avec les recettes
    return NextResponse.json(recettes, { status: 200 });
  } catch (error) {
    console.error("Erreur lors de la récupération des recettes:", error);
    
    // En cas d'erreur, on renvoie une erreur 500 avec un message d'erreur
    return NextResponse.json({ message: "Erreur lors de la récupération des recettes" }, { status: 500 });
  }
}
