import React, { useContext, useEffect, useState } from 'react';
import { AuthenticationContext } from '../../context/authenticationContext';
import { useNavigate } from 'react-router';
import { Navbar } from '../../components/Navbar';
import { AnnouceCard } from '../../components/AnnouceCard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart, faSearch } from '@fortawesome/free-solid-svg-icons';

// import './home.css';
import { collection, doc, getDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../../services/firebaseConfig';

export const Favorites = () => {

    const { signed } = useContext(AuthenticationContext);
    const userLogado = JSON.parse(sessionStorage.getItem("@AuthFirebase:user"));

    const baseUrl = process.env.PUBLIC_URL + "/";
    const enviromnent = process.env.NODE_ENV;
    const basePath = (enviromnent === "production") ? baseUrl : "/";

    const [announcements, setAnnouncements] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [userData, setUserData] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        function checkUserHasPassword() {
            if (!userLogado) return;
            const providerData = userLogado.providerData;
            if (providerData.length === 1 && providerData[0].providerId === 'google.com') {
                navigate(basePath + "completeAccount");
            }
        }

        function getAnnouncements(usrData) {
            onSnapshot(collection(db, "announcement"), (snapshot) => {
                const announcements = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }))

                const fav = announcements.filter((announcement)=>{
                    return usrData.favorites.includes(announcement.id);
                });

                setFavorites(fav);
            });
        }

        async function getUserData() {
            if (userData) return;

            const userDoc = doc(db, 'users', userLogado.uid);
            // const userDataFromFirebase = (await getDoc(userDoc)).data();
            getDoc(userDoc).then((usr) => {
                const usrData = usr.data();
                setUserData(usrData);
                getAnnouncements(usrData);
            });

        }

        getUserData();

        if (signed) {
            checkUserHasPassword();
        }
    }, [navigate, userLogado, signed, basePath, favorites, setFavorites]);

    function handleClick(e){
        const announceId = e.currentTarget.id;

        const favs = favorites.filter((fav)=>{
            return fav.id !== announceId;
        });

        setFavorites(favs);
    }

    return (
        <div className='root'>
            <Navbar current="favorites" />
            <div className="container">

                <div className='d-flex justify-content-center pt-3'>
                    <h2>Anúncios favoritos</h2>
                </div>
                    {(favorites.length === 0)&&<h4 className='text-muted' style={{textAlign:'center'}}>Você não possui nenhum anúncio favorito! Clique no ícone de <FontAwesomeIcon icon={faHeart} /> para adicionar!</h4>}

                <div className="row row-cols-1 row-cols-md-5 g-4 pt-5">


                    {favorites.map((announcement) => {
                        return (
                            <AnnouceCard
                                key={announcement.id}
                                title={`${announcement.marca} ${announcement.modelo}`}
                                description={announcement.descricao}
                                price={announcement.valor}
                                yearFabrication={announcement.anoFabricacao}
                                yearVehicle={announcement.anoModelo}
                                quilometragem={announcement.quilometragem}
                                imageUrl={announcement.images[0]}
                                id={announcement.id}
                                estado="Rio de Janeiro - RJ"
                                isFavorite={true}
                                handleClick={handleClick}
                            />
                        )
                    })}

                </div>
            </div>
        </div>
    )
}
