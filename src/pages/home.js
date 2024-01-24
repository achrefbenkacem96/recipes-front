import React, { useEffect, useState } from "react";
import { useGetUserID } from "../hooks/useGetUserID";
import axios from "axios";
import { Link } from "react-router-dom";
import { MdFavoriteBorder, MdFavorite } from "react-icons/md";
import ReactPaginate from "react-paginate";
import { useCookies } from "react-cookie";
const ITEMS_PER_PAGE = 10;

export const Home = ({ setSearchTerm, searchTerm}) => {
  const [recipes, setRecipes] = useState([]);
  const [favorisRecipes, setFavorisRecipes] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(0);
  const [cookies, setCookies] = useCookies(["access_token"]);

  const userID = useGetUserID();
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


    const fetchFavorisRecipes = async () => {
      try {
        const response = await axios.get(
          process.env.REACT_APP_END_POINT_RECIPES+`recipes/favorisRecipes/ids/${userID}`,
          {
            headers: { authorization: cookies.access_token },
          }
        );
        setFavorisRecipes(response.data.favorisRecipes);
      } catch (err) {
        console.log(err);
      }
    };

    fetchFavorisRecipes();
    fetchRecipesByName();
  }, [searchTerm, userID]);
  useEffect(() => {

    const fetchRecipes = async () => {
      try {
        const response = await axios.get(process.env.REACT_APP_END_POINT_RECIPES+`recipes?page=${currentPage + 1}`);
        const { data, total, totalPages } = response.data;
        setRecipes(data);
        setPageCount(Math.ceil(total / ITEMS_PER_PAGE));
      } catch (err) {
        console.log(err);
      }
    };

    const fetchFavorisRecipes = async () => {
      try {
        const response = await axios.get(
          process.env.REACT_APP_END_POINT_RECIPES+`recipes/favorisRecipes/ids/${userID}`
        );
        setFavorisRecipes(response.data.favorisRecipes);
      } catch (err) {
        console.log(err);
      }
    };

    fetchRecipes();
    fetchFavorisRecipes();
  }, []);

  const mFavorisRecipes = async (recipeID) => {
    try {
      let checkRcipe = favorisRecipes.find((recipe) => recipe == recipeID)
      console.log("🚀 ~ file: home.js:67 ~ mFavorisRecipes ~ favorisRecipes:", favorisRecipes)
      console.log("🚀 ~ file: home.js:67 ~ mFavorisRecipes ~ checkRcipe:", checkRcipe)
      if (!checkRcipe) {
        const response = await axios.put(process.env.REACT_APP_END_POINT_RECIPES+"recipes/favoris", {
          recipeID,
          userID,
        });
        setFavorisRecipes(response.data.favorisRecipes);

        console.log("🚀 ~ file: home.js:76 ~ mFavorisRecipes ~ response.data.favorisRecipes:", response.data.favorisRecipes)
      } else {
        const response = await axios.delete(process.env.REACT_APP_END_POINT_RECIPES+"recipes/favoris/"+userID+"/"+recipeID,
        {
          headers: { authorization: cookies.access_token },
        });
        setFavorisRecipes(response.data.favorisRecipes);
        console.log("🚀 ~ file: home.js:83 ~ mFavorisRecipes ~ response.data.favorisRecipes:", response.data.favorisRecipes)

      }
    } catch (err) {
      console.log(err);
    }
  };

  const isRecipeSaved = (id) => favorisRecipes.includes(id);
  const handlePageClick = async (selectedPage) => {
    console.log("🚀 ~ file: home.js:102 ~ handlePageClick ~ selectedPage:", selectedPage)
    const response = await axios.get(process.env.REACT_APP_END_POINT_RECIPES+`recipes?page=${selectedPage.selected + 1}`);
        const { data, total, totalPages } = response.data;
        console.log("🚀 ~ file: home.js:48 ~ fetchRecipes ~ total:", total)
        console.log("🚀 ~ file: home.js:48 ~ fetchRecipes ~ data:", data)

        setRecipes(data);
        setPageCount(Math.ceil(total / ITEMS_PER_PAGE));
    setCurrentPage(selectedPage.selected);
  };
  return (
    <div className=" container">
      <div className="row  g-5 p-3">
        {recipes.map((recipe) => (
          <div key={recipe._id} className="col-12 col-md-4  ">

            <div className="card rounded shadow" style={{ width: "20rem" }}>
              <img src={recipe.imageUrl} alt={recipe.name} className="card-img-top" />
              <div className="card-body">
                <h5 className="card-title">{recipe.name}</h5>
                <p className="card-text">Cooking Time: {recipe.cookingTime} minutes</p>
                <div className="d-flex align-items-center justify-content-between">
                  <div>
                    <Link to={`/recipe/${recipe._id}`} className="ms-3 text-decoration-none text-primary fs-6" >
                      View Details
                    </Link>
                  </div>
                  <div>
                    {userID && <button
                      onClick={() => mFavorisRecipes(recipe._id)}
                      className={`btn btn-danger `}
                    >
                      {isRecipeSaved(recipe._id) ? <MdFavorite />

                        : <MdFavoriteBorder />
                      }
                    </button>}
                  </div>



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
      />}
      </div>
    </div>
  );
};