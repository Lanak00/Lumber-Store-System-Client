import { Link } from 'react-router-dom';
import classes from './MainNavigation.module.css';
import logo from '../../assets/logo/logo_image.png';

function MainNavigation() {
    return (
        <header className={classes.header}>
            <div className={classes.logo}>
                <img src={logo} alt="Lumber Shop Logo" className={classes.logoImg} />
                <span className={classes.logoText}>Lumber Shop</span>
            </div>
            <nav>
                <ul>
                    <li>
                        <Link to="/">Products</Link>
                    </li>
                </ul>
            </nav>
        </header>
    );
}

export default MainNavigation;

