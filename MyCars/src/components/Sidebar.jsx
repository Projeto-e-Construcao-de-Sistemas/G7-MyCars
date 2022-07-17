import { faCar, faCarOn, faCommentDollar, faDollarSign, faMagnifyingGlass, faRightFromBracket, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './sidebar.css';
import { AuthenticationContext } from '../context/authenticationContext';
import { useState } from 'react';
import { ThemeContext } from '../App';

export const Sidebar = ({ current }) => {

    const { signOutFromApp } = useContext(AuthenticationContext);
    const { toggleTheme } = useContext(ThemeContext);


    const [darkMode, setDarkMode] = useState(localStorage.getItem("theme") === "dark");
    const navigate = useNavigate();

    const baseUrl = process.env.PUBLIC_URL + "/";
    const enviromnent = process.env.NODE_ENV;
    const basePath = (enviromnent === "production") ? baseUrl : "/";


    async function signOut() {
        await signOutFromApp();
        navigate(basePath + "login");
    }

    function changeTheme() {
        toggleTheme();
        setDarkMode(localStorage.getItem("theme") === "dark");
    }

    return (
        <nav id="sidebarMenu" className='col-md-3 col-lg-2 d-md-block sidebar collapse' style={{ textAlign: "center" }}>
            <div className="position-sticky pt-3">
                <ul className="nav flex-column">
                    <li className="nav-item">
                        <Link to={basePath} className='nav-link'>
                            <FontAwesomeIcon icon={faMagnifyingGlass} /> Buscar veículos</Link>
                    </li>
                    <li className="nav-item">
                        <Link to={basePath + "profile"} className={`nav-link ${current === 'profile' ? 'active' : ''}`}>
                            <FontAwesomeIcon icon={faUser} /> Meu perfil</Link>
                    </li>
                    <li className="nav-item">
                        <Link to={basePath + "myAnnouncements"} className={`nav-link ${current === 'myAnnouncements' ? 'active' : ''}`}>
                            <FontAwesomeIcon icon={faCar} /> Meus anúncios</Link>
                    </li>
                    <li className="nav-item">
                        <Link to={basePath + "createAnnouncement"} className={`nav-link ${current === 'createAnnouncement' ? 'active' : ''}`}>
                            <FontAwesomeIcon icon={faDollarSign} /> Criar um anúncio</Link>
                    </li>
                    <li className="nav-item">
                        <Link to={basePath + "myNegociations"} className={`nav-link ${current === 'myNegociations' ? 'active' : ''}`}>
                            <FontAwesomeIcon icon={faCommentDollar} /> Minhas negociações</Link>
                    </li>

                    <li className="nav-item">
                        <Link to={basePath + "testsDrives/"} className={`nav-link px-2 ${current === 'testDrive' ? 'active' : ''}`}>
                            <FontAwesomeIcon icon={faCarOn}/> Solicitações de tests drives
                            </Link>
                    </li>

                    <li className='nav-item' >
                        <div className="form-check form-switch nav-link">
                            <input style={{ float: 'inherit', marginRight: '10px' }} className="form-check-input" type="checkbox" id="flexSwitchCheckDefault" checked={darkMode} onChange={changeTheme} />
                            <label className="form-check-label" htmlFor="flexSwitchCheckDefault"> Modo escuro</label>
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

