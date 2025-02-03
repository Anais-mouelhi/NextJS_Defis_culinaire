import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const generateRecipes = async () => {
  try {
    const prompt = `
      Génère trois recettes de pays différents.
      Format JSON :
      [
        {
          "pays": "Italie",
          "titre": "Pizza Margherita",
          "ingredients": ["Tomate", "Mozzarella", "Basilic"],
          "etapes": ["Préparer la pâte", "Ajouter la garniture"],
          "photo": "https://example.com/pizza.jpg"
        }
      ]
    `;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // ou GPT-4 selon ce que tu préfères
      messages: [{ role: "system", content: prompt }],
      max_tokens: 1000,
    });

    // Parse des recettes générées
    const recipes = JSON.parse(response.choices[0].message.content);
    
    // Filtrer les recettes pour s'assurer qu'elles sont de pays différents
    const uniqueCountries = new Set();
    const uniqueRecipes = [];

    // Limite à 3 recettes et assure qu'elles viennent de pays différents
    for (const recipe of recipes) {
      if (uniqueCountries.size < 3 && !uniqueCountries.has(recipe.pays)) {
        uniqueCountries.add(recipe.pays);
        // Remplacer l'URL de l'image par un domaine fixe (ex: cdn.pixabay.com)
        recipe.photo = recipe.photo.replace("https://example.com", "https://cdn.pixabay.com");
        uniqueRecipes.push(recipe);
      }
    }

    return uniqueRecipes;
  } catch (error) {
    console.error("Erreur IA :", error);
    return [];
  }
};
