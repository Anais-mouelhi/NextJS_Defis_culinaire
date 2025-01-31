import mongoose from "mongoose";

const { Schema } = mongoose;

const recipePostSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true, // Le contenu principal du post (peut inclure des informations comme la recette ou une description)
    },
    imageUrl: {
      type: String,
      required: false, // L'URL de l'image associée au post, si présente
    },
    videoUrl: {
      type: String,
      required: false, // L'URL de la vidéo associée au post, si présente
    },
   userEmail: {
      type: String,  // Utiliser l'email de l'utilisateur connecté pour lier le post
      required: true,
    },
    comments: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", // Référence à l'utilisateur qui a commenté
        required: true
      },
      content: {
        type: String,
        required: true, // Contenu du commentaire
      },
      createdAt: {
        type: Date,
        default: Date.now, // Date du commentaire
      },
    }],
  },
  { timestamps: true }
);

export default mongoose.models.RecipePost || mongoose.model("RecipePost", recipePostSchema);
