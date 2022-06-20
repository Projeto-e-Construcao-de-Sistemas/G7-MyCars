import React, { useContext, useEffect } from 'react';
import { AuthenticationContext } from '../../context/authenticationContext';
import { useNavigate } from 'react-router';
import { Sidebar } from '../../components/Sidebar';
import { Link } from 'react-router-dom';

import './MyAnnouncements.css';

export const MyAnnouncements = () => {

    const { signed } = useContext(AuthenticationContext);
    const userLogado = JSON.parse(sessionStorage.getItem("@AuthFirebase:user"));

    const baseUrl = process.env.PUBLIC_URL + "/";
    const enviromnent = process.env.NODE_ENV;
    const basePath = (enviromnent === "production") ? baseUrl : "/";

    const navigate = useNavigate();

    useEffect(() => {
        function checkUserHasPassword() {
            const providerData = userLogado.providerData;
            if (providerData.length === 1 && providerData[0].providerId === 'google.com') {
                navigate(basePath + "completeAccount");
            }
        }
     
        if (signed) {
            checkUserHasPassword();
        } else {
            navigate(basePath);
        }
    }, [navigate, userLogado, signed, basePath])


    return (
        <div className="root">
            <header className='navbar navbar-light sticky-top flex-md-nowrap p-0 shadow'>
                <Link to={basePath} className='navbar-brand col-md-3 col-lg-2 me-0 px-3 '>MyCars</Link>
                <div className="navbar-nav">
                    <div className="nav-item text-nowrap">
                        <Link to={basePath} className="nav-link px-3">{userLogado.displayName}</Link>
                    </div>
                </div>
            </header>
            <div className="container-fluid">
                <Sidebar current={"myAnnouncements"}/>

                <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4 ">
                    <h2 className='h2 pt-4'>Meus Anúncios</h2>
                    <hr />

                </main>
            </div>
        </div>
    )
}

export default MyAnnouncements;