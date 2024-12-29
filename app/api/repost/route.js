import { connectMongoDB } from "../../../lib/mongodb"; // Connexion MongoDB
import Post from "../../../models/post"; // Modèle pour les posts
import Repost from "../../../models/repost"; // Modèle pour les reposts
import { ObjectId } from "mongoose"; // Utiliser mongoose pour manipuler les ObjectId

export async function POST(req) {
  try {
    // Récupérer les données envoyées par le frontend
    const { email, content, image, originalPostId } = await req.json();

    // Vérification des champs nécessaires
    if (!content || !originalPostId) {
      return new Response(
        JSON.stringify({ message: "Le contenu et l'ID du post original sont nécessaires" }),
        { status: 400 }
      );
    }

    // Connexion à MongoDB via mongoose
    await connectMongoDB();

    // Trouver le post original par son ID
    const originalPost = await Post.findById(originalPostId);

    // Vérifiez si le post original existe
    if (!originalPost) {
      return new Response(
        JSON.stringify({ message: "Post original non trouvé" }),
        { status: 404 }
      );
    }

    // S'assurer que la propriété reposts existe, sinon initialiser un tableau vide
    originalPost.reposts = originalPost.reposts || [];

    // Créer un objet repost
    const repost = new Repost({
      originalPostId,
      userEmail: email,
      content: content,
      image: image || "",
    });

    // Sauvegarder le repost dans la collection Reposts
    await repost.save();

    // Ajouter le repost au tableau des reposts du post original
    originalPost.reposts.push(repost._id); // Maintenant, reposts existe toujours comme tableau

    // Sauvegarder le post original après avoir ajouté le repost
    await originalPost.save();

    return new Response(
      JSON.stringify({ message: "Repost ajouté avec succès", repost }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur lors du repost:", error);
    return new Response(
      JSON.stringify({ message: "Erreur serveur" }),
      { status: 500 }
    );
  }
}
