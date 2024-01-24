import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useGetUserID } from '../hooks/useGetUserID';
import { Link } from 'react-router-dom';
import ReactPaginate from "react-paginate";
import { useCookies } from 'react-cookie';
const ITEMS_PER_PAGE = 10;

export default function MyRecipes({ setSearchTerm, searchTerm}) {
  const [recipes, setRecipes] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [cookies, setCookies] = useCookies(["access_token"]);

  useEffect(() => {
    const fetchRecipesByName = async () => {
      try {
        // Use the /findbyname endpoint with the provided search term
        const response = await axios.get(process.env.REACT_APP_END_POINT_RECIPES+`recipes/findbyname?name=${searchTerm}&page=${currentPage + 1}`);
        const { data, total, totalPages } = response.data;
        console.log("🚀 ~ file: home.js:48 ~ fetchRecipes ~ total:", total)
        console.log("🚀 ~ file: home.js:48 ~ fetchRecipes ~ data:", data)

        setRecipes(data);
        setPageCount(Math.ceil(total / ITEMS_PER_PAGE));
      } catch (err) {
        console.log(err);
      }
    };


 

     fetchRecipesByName();
  }, [searchTerm]);
  useEffect(() => {
    // Assuming you have the user ID from some source (e.g., authentication)
    const userId = window.localStorage.getItem("userID");

    // Fetch recipes for the specified user
    const fetchRecipes = async () => {
      try {
        const response = await axios.get(process.env.REACT_APP_END_POINT_RECIPES+`recipes/user/${userId}?page=${currentPage + 1}`);
        const { data, total, totalPages } = response.data;
        console.log("🚀 ~ file: home.js:48 ~ fetchRecipes ~ total:", total)
        console.log("🚀 ~ file: home.js:48 ~ fetchRecipes ~ data:", data)

        setRecipes(data);
        setPageCount(Math.ceil(total / ITEMS_PER_PAGE));
      } catch (error) {
        console.error('Error fetching recipes:', error);
      }
    };

    fetchRecipes();
  }, []); // The empty dependency array ensures this effect runs only once on mount
  const handleDelete = async (recipeId) => {
    try {
      // Make a DELETE request to your server's delete recipe endpoint
      const response = await axios.delete(process.env.REACT_APP_END_POINT_RECIPES+`recipes/delete/${recipeId}`,
      {
        headers: { authorization: cookies.access_token },
      });

      // Check if the recipe was deleted successfully
      if (response.status === 200) {
        console.log('Recipe deleted successfully');
        const userId = window.localStorage.getItem("userID");

        const response = await axios.get(process.env.REACT_APP_END_POINT_RECIPES+`recipes/user/${userId}?page=${currentPage + 1}`);
        const { data, total, totalPages } = response.data;
        console.log("🚀 ~ file: home.js:48 ~ fetchRecipes ~ total:", total)
        console.log("🚀 ~ file: home.js:48 ~ fetchRecipes ~ data:", data)

        setRecipes(data);
        setPageCount(Math.ceil(total / ITEMS_PER_PAGE));
        // Optionally, you can update your component state or perform other actions
      } else {
        console.error('Failed to delete recipe');
      }
    } catch (error) {
      console.error('Error deleting recipe:', error);
    }
  };

  const handlePageClick = async (selectedPage) => {
    const userId = window.localStorage.getItem("userID");

    console.log("🚀 ~ file: home.js:102 ~ handlePageClick ~ selectedPage:", selectedPage)
    const response = await axios.get(process.env.REACT_APP_END_POINT_RECIPES+`recipes/user/${userId}?page=${selectedPage.selected + 1}`);
        const { data, total, totalPages } = response.data;
        console.log("🚀 ~ file: home.js:48 ~ fetchRecipes ~ total:", total)
        console.log("🚀 ~ file: home.js:48 ~ fetchRecipes ~ data:", data)

        setRecipes(data);
        setPageCount(Math.ceil(total / ITEMS_PER_PAGE));
    setCurrentPage(selectedPage.selected);
  };
  return (
    <div className='container'>
       <div className="row  ge-5 p-3">
       
        {recipes.map((recipe) => (
            <div key={recipe._id} className="col-12 col-md-4 py-2">

            <div className="card rounded shadow" style={{ width: "20rem" }}>
              <img src={recipe.imageUrl} alt={recipe.name} className="card-img-top" />
              <div className="card-body">
                <h5 className="card-title">{recipe.name}</h5>
                <p className="card-text">Cooking Time: {recipe.cookingTime} minutes</p>
                <div className='d-flex justify-content-between  align-items-center '>
              <div className=" "><Link  to={`/upadaterecipe/${recipe._id}`} className="btn btn-primary">
                modifier</Link></div>
              <div className="   "><button onClick={() => handleDelete(recipe._id)} className="ms-auto btn btn-danger">
  Delete
</button></div>
              </div>
              </div>
            </div>
          </div>
 
        ))}
        {pageCount > 1 && 
            <ReactPaginate
              previousLabel={"previous"}
              nextLabel={"next"}
              breakLabel={"..."}
              pageCount={pageCount}
              marginPagesDisplayed={2}
              pageRangeDisplayed={3}
              onPageChange={handlePageClick}
              containerClassName={"pagination justify-content-center"}
              pageClassName={"page-item"}
              pageLinkClassName={"page-link"}
              previousClassName={"page-item"}
              previousLinkClassName={"page-link"}
              nextClassName={"page-item"}
              nextLinkClassName={"page-link"}
              breakClassName={"page-item"}
              breakLinkClassName={"page-link"}
              activeClassName={"active"}
            />
        }
      </div>
    </div>
  );
}
