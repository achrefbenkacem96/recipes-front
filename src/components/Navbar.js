import { Link, useLocation } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';
 
export const Navbar = ({ setSearchTerm, searchTerm}) => {
    const [cookies, setCookies] = useCookies(["access_token"]);
    const navigate = useNavigate();
    let location = useLocation();
    console.log("🚀 ~ file: Navbar.js:9 ~ Navbar ~ location:", location)

    const logout = () => {
        setCookies("access_token", "");
        window.localStorage.removeItem("userID");
        window.localStorage.removeItem("email");
        navigate("/");
    };

    return (
<nav class="navbar navbar-expand-lg z-3 bg-body-tertiary">
  <div class="container-fluid">
  <Link className="navbar-brand" to="/">Home</Link>
    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse nav-item" id="navbarSupportedContent">
      <ul class="navbar-nav  mb-2 mb-lg-0">
         
          {cookies.access_token &&
          <>
        <li class="nav-item">
            <Link className="nav-link pe-3" to="/profile">profile</Link>
        </li>
        <li class="nav-item dropdown">
          <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
          Recipes
          </a>
          <ul class="dropdown-menu">
          <li className="nav-item">
              <Link className="nav-link" to="/create-recipe">Create Recipe</Link>
          </li>
          <li className="nav-item">
              <Link className="nav-link" to="/favoris-recipes">Favoris</Link>
          </li>
          <li className="nav-item">
              <Link className="nav-link" to="/myrecipes">My Recipes</Link>
          </li>
          </ul>
        </li>
          </>
        }
        
      </ul>
        <div  >
             {(location.pathname == "/myrecipes" || location.pathname == "/" )&&
                <input value={searchTerm}  onChange={(e) => setSearchTerm(e.target.value)} className="form-control  ms-5 me-2 " type="search" placeholder="Search" aria-label="Search" />
            } 
        </div>
        <div className='ms-auto'>
            {!cookies.access_token ?
             (   <Link className="btn w-100 btn-primary" to="/login">Login</Link>):
             (  <button
                    className={`btn w-100  pe-3 btn-danger ${!cookies.access_token ? 'd-none' : ''}`}
                    onClick={() => logout()}
                >
                    Log out
                </button>)
            }
        </div>
     </div>
  </div>
</nav>
 
    );
};
