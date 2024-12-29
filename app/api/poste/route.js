import { connectMongoDB } from "../../../lib/mongodb";
import User from "../../../models/user";
import Post from "../../../models/Post"; // Modèle pour les posts
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    // Récupérer les données envoyées dans la requête
    const { email, content, image } = await req.json();

    // Se connecter à la base de données MongoDB
    await connectMongoDB();

    // Vérifier si l'utilisateur existe en utilisant l'email
    const user = await User.findOne({ email }).select("_id name");

    // Si l'utilisateur n'existe pas, retourner une erreur
    if (!user) {
      return NextResponse.json({ message: "Utilisateur non trouvé !" }, { status: 404 });
    }

    // Créer un nouveau post
    const newPost = new Post({
      content,   // Le contenu du message
      image,     // L'URL de l'image (si fournie)
      user: user._id, // Associer le post à l'utilisateur
      userName: user.name, // Ajouter le nom de l'utilisateur
    });

    // Sauvegarder le post dans la base de données
    await newPost.save();

    // Retourner une réponse réussie avec le post
    return NextResponse.json({ message: "Post créé avec succès !", post: newPost }, { status: 201 });
  } catch (error) {
    console.error("Erreur lors de la création du post : ", error);
    return NextResponse.json({ message: "Erreur lors de la création du post" }, { status: 500 });
  }
}
