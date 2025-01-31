import { NextResponse } from "next/server";
import connect from "@/utils/db";
import RecipePost from "@/models/RecipePost";

// Route pour récupérer tous les posts
export const GET = async (request: Request) => {
  try {
    await connect();

    // Récupérer les posts et les peupler avec les informations utilisateur
    const posts = await RecipePost.find()
      .populate("user", "email")  // Populer les utilisateurs pour obtenir leurs emails
      .sort({ createdAt: -1 });  // Trier par date (le plus récent en premier)

    return NextResponse.json(posts);
  } catch (error) {
    console.error("Error fetching posts:", error);
    return new NextResponse("Error fetching posts", { status: 500 });
  }
};
