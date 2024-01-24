import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Home } from './pages/home';
import { Login } from './pages/login';
import { Register } from './pages/register';
import { CreateRecipe } from './pages/create-recipe';
 import { Navbar } from './components/Navbar';
import 'bootstrap/dist/css/bootstrap.min.css';
import RecipeDetails from './pages/RecipeDetails';
import Profile from './pages/profile';
import MyRecipes from './pages/my-recipes';
import Upadaterecipe from './pages/upadate-recipe';
import { useState } from 'react';
import { FavorisRecipes } from './pages/favoris-recipes';
   
function App() {
  const [searchTerm, setSearchTerm] = useState(""); // State to store the search term

  return (
    <Router>
      <Navbar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <div className="App">
       <Routes>
        <Route path="/" element={<Home searchTerm={searchTerm} setSearchTerm={setSearchTerm} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/create-recipe" element={<CreateRecipe />} />
        <Route path="/recipe/:recipeId" element={<RecipeDetails />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/myrecipes" element={<MyRecipes searchTerm={searchTerm} setSearchTerm={setSearchTerm} />} />
        <Route path="/upadaterecipe/:recipeId" element={<Upadaterecipe />} />
        <Route path="/favoris-recipes" element={<FavorisRecipes />} />
      </Routes>
    </div>
     </Router>
  );
}

export default App;
