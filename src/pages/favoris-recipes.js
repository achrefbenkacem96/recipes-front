import React, { useEffect, useState } from "react";
import { useGetUserID } from "../hooks/useGetUserID";
import axios from "axios";
import { Link } from "react-router-dom";
import ReactPaginate from "react-paginate";
const ITEMS_PER_PAGE = 10;
export const FavorisRecipes = () => {
  const [loading, setLoading] = useState(true);
  const [favorisRecipes, setFavorisRecipes] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const userID = useGetUserID();

  console.log(favorisRecipes)

  useEffect(() => {
    const fetchFavorisRecipes = async () => {
      try {
        const response = await axios.get(
          process.env.REACT_APP_END_POINT_RECIPES+`recipes/favorisRecipes/${userID}?page=${currentPage + 1}`);
          const { data, total, totalPages } = response.data;
          console.log("🚀 ~ file: home.js:48 ~ fetchRecipes ~ total:", total)
          console.log("🚀 ~ file: home.js:48 ~ fetchRecipes ~ data:", data)
          setPageCount(Math.ceil(total / ITEMS_PER_PAGE));
          setFavorisRecipes(data);
          setLoading(false)
      } catch (err) {
        console.log(err);
      }
    };

    fetchFavorisRecipes();
  }, []);
  const handlePageClick = async (selectedPage) => {
    const userId = window.localStorage.getItem("userID");

    console.log("🚀 ~ file: home.js:102 ~ handlePageClick ~ selectedPage:", selectedPage)
    const response = await axios.get(  process.env.REACT_APP_END_POINT_RECIPES+`recipes/favorisRecipes/${userID}?page=${selectedPage.selected + 1}`);
    const { data, total, totalPages } = response.data;
    console.log("🚀 ~ file: home.js:48 ~ fetchRecipes ~ total:", total)
    console.log("🚀 ~ file: home.js:48 ~ fetchRecipes ~ data:", data)
    setPageCount(Math.ceil(total / ITEMS_PER_PAGE));
    setFavorisRecipes(data);
    setCurrentPage(selectedPage.selected);
  };
  return (
    <div className="home-container">
       
         {(favorisRecipes.length  === 0)&& !loading ? (
          <p className="no-favoris-recipes">No favoris recipes! Go to the<Link className="link" to="/">browse page</Link>to explore new recepies!</p>
        ) : (
          <div className="row">
            
           { favorisRecipes.map((recipe) => (
            <div key={recipe._id} className="col-12 col-md-4 pt-2">

              <div  className="card" style={{width: "20rem"}}>
                <img src={recipe.imageUrl} alt={recipe.name} className="card-img-top" />
                <div className="card-body">
                  <h5 className="card-title">{recipe.name}</h5>
                  <p className="card-text">Cooking Time: {recipe.cookingTime} minutes</p>
                  <Link to={`/recipe/${recipe._id}`} className="ms-3 text-decoration-none text-primary fs-6" >
                      View Details
                    </Link>
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
        )}
     </div>
  );
};