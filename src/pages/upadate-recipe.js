import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { useGetUserID } from '../hooks/useGetUserID';
import { useCookies } from 'react-cookie';

const Upadaterecipe = () => {
  const userID = useGetUserID();
  const navigate = useNavigate();
  const { recipeId } = useParams();
  const [cookies, setCookies] = useCookies(["access_token"]);

  const [recipe, setRecipe] = useState({
    name: '',
    ingredients: [],
    instructions: '',
    imageUrl: '',
    cookingTime: 0,
    userOwner: userID,
  });

  // Add useEffect to fetch the recipe data based on the recipe ID
  useEffect(() => {
    const fetchRecipe = async () => {
       try {
        const response = await axios.get(process.env.REACT_APP_END_POINT_RECIPES+`recipes/${recipeId}`);
        setRecipe(response.data);
      } catch (error) {
        console.error('Error fetching recipe:', error);
      }
    };

    fetchRecipe();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setRecipe((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleAddIngredient = () => {
    setRecipe((prevRecipe) => ({
      ...prevRecipe,
      ingredients: [...prevRecipe.ingredients, ''],
    }));
  };

  const handleRemoveIngredient = (index) => {
    const updatedIngredients = [...recipe.ingredients];
    updatedIngredients.splice(index, 1);
    setRecipe((prevRecipe) => ({
      ...prevRecipe,
      ingredients: updatedIngredients,
    }));
  };

  const handleIngredientChange = (event, index) => {
    const { value } = event.target;
    const ingredients = [...recipe.ingredients];
    ingredients[index] = value;
    setRecipe((prevRecipe) => ({
      ...prevRecipe,
      ingredients,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log(recipe);

     
    try {
      await axios.put(process.env.REACT_APP_END_POINT_RECIPES+`recipes/update/${recipeId}`, recipe,
      {
        headers: { authorization: cookies.access_token },
      });
      alert('Recipe updated!');
      navigate('/');
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="create-recipe">
      <h2>Update Recipe</h2>
      <hr/>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={recipe.name}
            onChange={handleChange}
            className="form-input"
          />
        </div>
    
        <div className="form-group">
          <label htmlFor="ingredients">Ingredients</label>
          {recipe.ingredients.map((ingredient, index) => (
            <div key={index} className="input-group mb-2">
              <input
                type="text"
                name="ingredients"
                value={ingredient}
                onChange={(event) => handleIngredientChange(event, index)}
                className="form-control"
              />
              <div className="input-group-append">
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => handleRemoveIngredient(index)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={handleAddIngredient}
          className="btn btn-secondary mb-3"
        >
          Add Ingredient
        </button>
    
        <div className="form-group">
          <label htmlFor="instructions">Instructions</label>
          <textarea
            id="instructions"
            name="instructions"
            value={recipe.instructions}
            onChange={handleChange}
            className="form-input"
          ></textarea>
        </div>
    
        <div className="form-group">
          <label htmlFor="imageUrl">Image URL</label>
          <input
            type="text"
            id="imageUrl"
            name="imageUrl"
            value={recipe.imageUrl}
            onChange={handleChange}
            className="form-input"
          />
        </div>
    
        <div className="form-group">
          <label htmlFor="cookingTime">Cooking Time (minutes)</label>
          <input
            type="number"
            id="cookingTime"
            name="cookingTime"
            value={recipe.cookingTime}
            onChange={handleChange}
            className="form-input"
          />
        </div>
    
        <button type="submit" className="btn btn-primary my-3">
          upadate Recipe
        </button>
      </form>
    </div>
    
      );
};
export default Upadaterecipe;
