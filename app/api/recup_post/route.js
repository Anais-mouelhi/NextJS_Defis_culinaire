import { connectMongoDB } from "../../../lib/mongodb"; // Import de la fonction pour connecter MongoDB
import Post from "../../../models/post"; // Modèle des posts (à adapter selon ta structure)
import { NextResponse } from "next/server"; // Réponse HTTP Next.js

// Route pour récupérer tous les posts
export async function GET() {
  try {
    await connectMongoDB(); // Se connecter à la base de données MongoDB
    const posts = await Post.find() // Trouver tous les posts dans la collection "Post"
      .sort({ createdAt: -1 }); // Optionnel : trier par date de création, les plus récents en premier
    return NextResponse.json({ posts }); // Retourner la réponse JSON contenant les posts
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Erreur lors de la récupération des posts" },
      { status: 500 }
    );
  }
}
