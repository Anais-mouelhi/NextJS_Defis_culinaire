import { OpenAI } from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return new Response(JSON.stringify({ error: "Prompt is required" }), {
        status: 400,
      });
    }

    // Modifier le prompt pour obtenir des images esthétiques
    const aestheticPrompt = `${prompt}, styled in an elegant and aesthetic way, with soft lighting, minimalistic background, high-quality photography, and an appealing color palette. The food should look vibrant and beautifully plated.`;

    // Appel à l'API d'OpenAI pour générer l'image
    const response = await openai.images.generate({
      prompt: aestheticPrompt,
      n: 1,
      size: "256x256", // Vous pouvez ajuster la taille si nécessaire
    });

    // Log de la réponse pour débogage
    console.log("OpenAI Image Generation Response:", response);

    if (response.data && response.data.length > 0 && response.data[0].url) {
      const imageUrl = response.data[0].url;
      return new Response(
        JSON.stringify({ imageUrl }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    } else {
      throw new Error("No image generated.");
    }
  } catch (error) {
    // Ajout d'un log d'erreur plus détaillé
    console.error("Error during image generation:", error);

    // Afficher la réponse de l'erreur d'OpenAI, si elle existe
    if (error.response) {
      console.error("Error response from OpenAI:", error.response.data);
    }

    // Retourner une image de secours en cas d'erreur
    const fallbackImageUrl = "https://via.placeholder.com/256x256?text=Image+Not+Found";

    return new Response(
      JSON.stringify({ imageUrl: fallbackImageUrl }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
