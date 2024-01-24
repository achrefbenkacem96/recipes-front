 
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { useCookies } from "react-cookie";

export default function RecipeDetails(props) {
    const { recipeId } = useParams();
    const [recipe, setRecipe] = useState(null);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState(""); // State to track the new comment
    const [cookies, setCookies] = useCookies(["access_token"]);
    const bottomRef = useRef(null);

    useEffect(() => {
      const fetchRecipeDetails = async () => {
        try {
          const response = await axios.get(process.env.REACT_APP_END_POINT_RECIPES+`recipes/${recipeId}`);
          setRecipe(response.data);
          console.log("🚀 ~ file: RecipeDetails.js:23 ~ fetchRecipeDetails ~ response.data:", response.data)
          setComments(response.data.comments);
        } catch (error) {
          console.error(error);
        }
      };
  
      fetchRecipeDetails();
    }, [recipeId]);
    const scrollToBottom = () => {
      bottomRef.current?.scrollIntoView({behavior: 'smooth'});
    }
    // Function to handle comment submission
    const handleCommentSubmit = async () => {
      try {
        // Send a request to the server to add a new comment
        const response = await axios.post(process.env.REACT_APP_END_POINT_RECIPES+`recipes/${recipeId}/comments`, {
          content: newComment,
          userId: window.localStorage.getItem("userID") 
        });
  
        // Update the comments state with the new comment
        const responseRecipes = await axios.get(process.env.REACT_APP_END_POINT_RECIPES+`recipes/${recipeId}`);
        setRecipe(responseRecipes.data);
        console.log("🚀 ~ file: RecipeDetails.js:23 ~ fetchRecipeDetails ~ response.data:", responseRecipes.data)
        setComments(responseRecipes.data.comments)
        scrollToBottom();
        // Clear the new comment input
        setNewComment("");
      } catch (error) {
        console.error(error);
      }
    };
  
  return (
    <div className="w-100 p-3 pt-5">

    <div className="container  rounded shadow p-3 pt-5">
    {recipe ? (
      <div className="text-center">
        <h1 className="  pb-3">{recipe.name}</h1>
        <hr className="p-3"/>
        <div className="align-items-center  ">
        <img src={recipe.imageUrl} alt={recipe.name}  style={{ maxWidth: "800px", maxHeight: "550px" }}    />
        </div>
        <p>Cooking Time: {recipe.cookingTime} minutes</p>
        <div className="instructions">
                <p className="card-text">{recipe.instructions}</p>
              </div>
              <hr/>
              <h5>Ingredients</h5>
              {
                recipe.ingredients.map((ingredient) => (
                  <ul className=" ">
                    <li className="card-text ">{ingredient}</li>
                  </ul>
                ))
              }
               {/* Add a form for adding comments */}
        <div>
            {cookies.access_token && (
              <div className="form-floating">
          <hr/>
            <textarea
               value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="form-control  bg-body-tertiary"
              id="floatingTextarea"
              placeholder="Leave a comment here"
            />
           
              <label for="floatingTextarea">Comments</label>
<br/>
            <button className="btn btn-success mb-3" onClick={handleCommentSubmit}>
              Submit Comment
            </button>
                </div>
            )  }
          </div>
          {comments.length > 0&& 
          <>
          <hr/>
          <h2>Comments</h2>
        <ul ref={bottomRef}>
          {comments.map((comment) => (
            <li key={comment._id} className="pb-2">
              <strong>{comment.user?.username}:</strong> {comment.content}
            </li>
          ))}
        </ul>
          </>
        }

        {/* Additional recipe details can be displayed here */}

       
      </div>
    ) : (
      <p>Loading...</p>
    )}
  </div>
    </div>
  )
}
