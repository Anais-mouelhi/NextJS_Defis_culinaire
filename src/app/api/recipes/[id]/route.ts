import { NextResponse } from "next/server";
import dbConnect from "@/utils/db";
import Recipe from "@/models/Recipe";

// Gérer la requête GET pour récupérer une recette par ID
export async function GET(request: Request, { params }: { params: { id: string } }) {
  await dbConnect();

  try {
    const recipe = await Recipe.findById(params.id);
    if (!recipe) {
      return NextResponse.json({ message: "Recette non trouvée" }, { status: 404 });
    }
    return NextResponse.json(recipe);
  } catch (error) {
    return NextResponse.json({ message: "Erreur serveur", error }, { status: 500 });
  }
}
