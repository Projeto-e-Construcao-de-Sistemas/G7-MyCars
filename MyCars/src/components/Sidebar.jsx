import { faCar, faCommentDollar, faDollarSign, faMagnifyingGlass, faRightFromBracket, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './sidebar.css';
import { AuthenticationContext } from '../context/authenticationContext';
import { useState } from 'react';
import { ThemeContext } from '../App';
import { useEffect } from 'react';

export const Sidebar = () => {

    const { signOutFromApp } = useContext(AuthenticationContext);
    const {toggleTheme} = useContext(ThemeContext);


    const [darkMode, setDarkMode] = useState(localStorage.getItem("theme") === "dark");
    const navigate = useNavigate();


    async function signOut() {
        await signOutFromApp();
        navigate("/login");
    }


    function changeTheme(){
        toggleTheme();
        setDarkMode(localStorage.getItem("theme") === "dark");
    }

    return (
        <nav id="sidebarMenu" className='col-md-3 col-lg-2 d-md-block sidebar collapse'>
            <div className="position-sticky pt-3">
                <ul className="nav flex-column">
                    <li className="nav-item">
                        <Link to="/" className='nav-link'>
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
                        <input type="checkbox" id="theme" checked={darkMode} onClick={changeTheme}/>
                        <label for="theme"> Modo Escuro
                        </label>
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

