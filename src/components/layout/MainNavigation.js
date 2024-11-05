import { Link, useNavigate } from 'react-router-dom';
import classes from './MainNavigation.module.css';
import logo from '../../assets/logo/logo_image.png';
import { FaShoppingCart } from 'react-icons/fa';

function MainNavigation({ isLoggedIn, setIsLoggedIn }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    navigate('/');
  };

  const getUserRoleFromToken = () => {
    const token = localStorage.getItem('token');
    if (!token) return null;

    try {
      const tokenPayload = JSON.parse(atob(token.split('.')[1]));
      return tokenPayload['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  };

  const userRole = getUserRoleFromToken();
  console.log(userRole)
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
          {isLoggedIn && userRole === 'Client' && (
            <>
              <li>
                <Link to="/orders">Moje porudzbine</Link>
              </li>
              <li>
                <Link to="/cart">
                  <FaShoppingCart size={23} />
                </Link>
              </li>
            </>
          )}
          {isLoggedIn && userRole === 'Administrator' && (
            <>
              <li>
                <Link to="/users">Korisnici</Link>
              </li>
            </>
          )}
          {isLoggedIn && (userRole === 'Employee' || userRole === 'Administrator') && (
            <li>
              <Link to="/orders">Porudzbine</Link>
            </li>
          )}
          {isLoggedIn ? (
            <li>
              <button onClick={handleLogout} className={classes.actionButton}>
                Odjavi se
              </button>
            </li>
          ) : (
            <li>
              <Link to="/login" className={classes.actionButton}>
                Prijavi se
              </Link>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
}

export default MainNavigation;
