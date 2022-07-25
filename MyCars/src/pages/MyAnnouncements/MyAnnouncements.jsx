import React, { useContext, useEffect, useState } from 'react';
import { AuthenticationContext } from '../../context/authenticationContext';
import { useNavigate } from 'react-router';
import { Sidebar } from '../../components/Sidebar';
import { Link } from 'react-router-dom';

import './MyAnnouncements.css';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../../services/firebaseConfig';
import { AnnouceCard } from '../../components/AnnouceCard';

export const MyAnnouncements = () => {

    const { signed } = useContext(AuthenticationContext);
    const userLogado = JSON.parse(sessionStorage.getItem("@AuthFirebase:user"));

    // const baseUrl = process.env.PUBLIC_URL + "/";
    // const enviromnent = process.env.NODE_ENV;
    // const basePath = (enviromnent === "production") ? baseUrl : "/";

    const basePath = "/";

    const navigate = useNavigate();

    const [announcements, setAnnouncements] = useState([]);

    useEffect(() => {
        function checkUserHasPassword() {
            const providerData = userLogado.providerData;
            if (providerData.length === 1 && providerData[0].providerId === 'google.com') {
                navigate(basePath + "completeAccount");
            }
        }

        function getAnnouncements() {
            const q = query(collection(db, "announcement"), where("dono", "==", `/users/${userLogado.uid}`));
            onSnapshot(q, (snapshot) => {
                setAnnouncements(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
            });
        }

        if (signed) {
            checkUserHasPassword();
            getAnnouncements();
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
                <Sidebar current={"myAnnouncements"} />

                <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4 ">
                    <h2 className='h2 pt-4'>Meus Anúncios</h2>
                    <hr />
                    {announcements.length === 0 ? (
                        <h4>Parece que você não possui nenhum anúncio... Tente <Link to={basePath + "createAnnouncement"}>criar um anúncio!</Link></h4>
                    ) : (
                        <div className="row row-cols-1 row-cols-md-5 g-4 pt-5">

                            {announcements.map((announcement) => {
                                return (
                                    <AnnouceCard
                                        key={announcement.id}
                                        id={announcement.id}
                                        title={announcement.modelo}
                                        description={announcement.descricao}
                                        price={announcement.valor}
                                        yearFabrication={announcement.anoFabricacao}
                                        yearVehicle={announcement.anoModelo}
                                        quilometragem={announcement.quilometragem}
                                        imageUrl={announcement.images[0]}
                                        estado="Rio de Janeiro - RJ"
                                        editable={true}
                                        finalizado={announcement.anuncioFinalizado} />
                                )
                            })}

                        </div>
                    )}
                </main>
            </div>
        </div>
    )
}

export default MyAnnouncements;