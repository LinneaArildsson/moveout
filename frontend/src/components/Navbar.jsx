import {React} from 'react';
import { Link } from 'react-router-dom';
import { useLogout } from '../hooks/useLogout';
import { useAuthContext } from '../hooks/useAuthContext';

import homeIcon from '../style/moveout.png'

export default function Navbar() {
    const {logout} = useLogout();
    const {user} = useAuthContext();

    const handleClick = () => {
        logout();
    }

    return (
        <header>
            <div className="container">
                <Link to='/'><img src={homeIcon} alt='Home' className='navbar-logo' /></Link>
                <nav>
                    {user && (
                        <div>
                            
                            <button onClick={handleClick}>Logout</button>
                        </div>
                    )}
                    {!user && (
                        <div>
                            <Link to='/register'>Register</Link>
                            <Link to='/login'>Login</Link>
                        </div>
                    )}
                </nav>
            </div>
        </header>
    )
}