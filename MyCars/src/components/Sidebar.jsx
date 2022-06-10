import { faCar, faCommentDollar, faDollarSign, faMagnifyingGlass, faRightFromBracket, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './sidebar.css';
import { AuthenticationContext } from '../context/authenticationContext';
import { useState } from 'react';
import { ThemeContext } from '../App';

export const Sidebar = () => {

    const { signOutFromApp } = useContext(AuthenticationContext);
    const { toggleTheme } = useContext(ThemeContext);


    const [darkMode, setDarkMode] = useState(localStorage.getItem("theme") === "dark");
    const navigate = useNavigate();

    async function signOut() {
        await signOutFromApp();
        navigate("/login");
    }

    function changeTheme() {
        toggleTheme();
        setDarkMode(localStorage.getItem("theme") === "dark");
    }

    const baseUrl = process.env.PUBLIC_URL+"/";
    const enviromnent = process.env.NODE_ENV;
    const basePath = (enviromnent === "production") ? baseUrl : "/";

    return (
        <nav id="sidebarMenu" className='col-md-3 col-lg-2 d-md-block sidebar collapse' style={{textAlign:"center"}}>
            <div className="position-sticky pt-3">
                <ul className="nav flex-column">
                    <li className="nav-item">
                        <Link to={basePath+"/"} className='nav-link'>
                            <FontAwesomeIcon icon={faMagnifyingGlass} /> Buscar veículos</Link>
                    </li>
                    <li className="nav-item">
                        <Link to="#" className='nav-link active'>
                            <FontAwesomeIcon icon={faUser} /> Meu perfil</Link>
                    </li>
                    <li className="nav-item">
                        <Link to="#" className='nav-link'>
                            <FontAwesomeIcon icon={faCar} /> Meus anúncios</Link>
                    </li>
                    <li className="nav-item">
                        <Link to="#" className='nav-link'>
                            <FontAwesomeIcon icon={faDollarSign} /> Criar um anúncio</Link>
                    </li>
                    <li className="nav-item">
                        <Link to="#" className='nav-link'>
                            <FontAwesomeIcon icon={faCommentDollar} /> Minhas negociações</Link>
                    </li>
                    <li className='nav-item' >
                        <div class="form-check form-switch nav-link">
                            <input style={{float:'inherit', marginRight:'10px'}} className="form-check-input" type="checkbox" id="flexSwitchCheckDefault" checked={darkMode} onClick={changeTheme} />
                            <label className="form-check-label" for="flexSwitchCheckDefault"> Modo escuro</label>
                        </div>

                    </li>
                    <li className="nav-item">
                        <Link to="#" onClick={signOut} className='nav-link'>
                            <FontAwesomeIcon icon={faRightFromBracket} /> Sair</Link>
                    </li>

                </ul>
            </div>
        </nav>
    )
}

