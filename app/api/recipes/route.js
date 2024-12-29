import axios from "axios";

const API_BASE_URL = "https://www.themealdb.com/api/json/v1/1";

// Récupérer les zones géographiques
export async function fetchAreas() {
  try {
    const response = await axios.get(`${API_BASE_URL}/list.php?a=list`);
    return response.data.meals.map(area => area.strArea);
  } catch (error) {
    console.error("Erreur lors de la récupération des zones :", error);
    throw error;
  }
}

// Récupérer les recettes par zone
export async function fetchRecipesByArea(area) {
  try {
    const response = await axios.get(`${API_BASE_URL}/filter.php`, {
      params: { a: area },
    });

    return response.data.meals.map(meal => ({
      title: meal.strMeal,
      image: meal.strMealThumb,
      source: `https://www.themealdb.com/meal/${meal.idMeal}`,
      url: `https://www.themealdb.com/meal/${meal.idMeal}`,
    }));
  } catch (error) {
    console.error("Erreur lors de la récupération des recettes :", error);
    throw error;
  }
}
