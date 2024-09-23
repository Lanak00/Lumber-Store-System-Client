import { Link, useNavigate} from 'react-router-dom';
import classes from './MainNavigation.module.css';
import logo from '../../assets/logo/logo_image.png';
import { FaShoppingCart } from 'react-icons/fa';

function MainNavigation({ isLoggedIn, setIsLoggedIn }) {
const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token'); 
    setIsLoggedIn(false); // Update state on logout
    navigate("/");
  };

  return (
    <header className={classes.header}>
      <div className={classes.logo}>
        <img src={logo} alt="Lumber Shop Logo" className={classes.logoImg} />
        <span className={classes.logoText}>Lumber Shop</span>
      </div>
      <nav>
        <ul>
          <li>
            <Link to="/">Proizvodi</Link>
          </li>
          {isLoggedIn ? (
            <>
              <li>
                <Link to="/orders">Moje porudzbine</Link>
              </li>
              <li>
                <Link to="/cart">
                  <FaShoppingCart size={24} /> 
                </Link>
              </li>
              <li>
                <button onClick={handleLogout} className={classes.actionButton}>
                  Odjavi se
                </button>
              </li>
            </>
          ) : (
            <li>
              <Link to="/login" className={classes.actionButton}>Prijavi se</Link> 
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
}

export default MainNavigation;
