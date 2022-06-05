import React, { Component, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthenticationContext } from '../context/authenticationContext';

import './navbar.css';
export const Navbar = ({ current }) => {

    const { signOutFromApp, signed } = useContext(AuthenticationContext);
    const navigate = useNavigate();

    async function signOut() {
        await signOutFromApp();
        navigate("/login");
    }

    // const { current } = this.props;

    return (
        <div className='container'>
            <header className='d-flex flex-wrap align-items-center justify-content-center justify-content-md-between py-3 mb-4 border-bottom'>
                <Link to="/" className='d-flex align-items-center col-md-3 mb-2 mb-md-0 text-dark text-decoration-none'>
                    <span className="fs-4">MyCars</span>
                </Link>

                <ul className="nav nav-pills col-12 col-md-auto mb-2 justify-content-center mb-md-0">
                    <li className="nav-item"><Link to="/" className={`nav-link px-2 ${current === 'home' ? 'active' : ''}`}>Home</Link></li>
                    <li className="nav-item"><Link to="#" className='nav-link'>Comprar</Link></li>
                    <li className="nav-item"><Link to="#" className='nav-link'>Vender</Link></li>
                </ul>
                <div className="col-md-3 text-end">

                    {!signed ? (
                        <>
                        <Link to="/login" className='btn btn-outline-primary me-2'>Fazer Login</Link>
                        <Link to="/createAccount" type='button' className='btn btn-primary'>Cadastre-se</Link>
                        </>
                    ) : (
                        <button type="button" onClick={signOut} className='btn btn-outline-primary'>Sair</button>
                    )}
                </div>
            </header>
        </div>
    )
}