import React, { useContext, useEffect, useState } from 'react';
import { AuthenticationContext } from '../../context/authenticationContext';
import { useNavigate } from 'react-router';
import { Navbar } from '../../components/Navbar';
import { AnnouceCard } from '../../components/AnnouceCard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

import './home.css';
import { collection, doc, getDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../../services/firebaseConfig';

export const Home = () => {

  const { signed } = useContext(AuthenticationContext);
  const userLogado = JSON.parse(sessionStorage.getItem("@AuthFirebase:user"));

  const baseUrl = process.env.PUBLIC_URL + "/";
  const enviromnent = process.env.NODE_ENV;
  const basePath = (enviromnent === "production") ? baseUrl : "/";

  const [announcements, setAnnouncements] = useState([]);
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

    function getAnnouncements() {
      onSnapshot(collection(db, "announcement"), (snapshot) => {
        setAnnouncements(snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
      });
    }

    async function getUserData() {
      if (userData) return;

      const userDoc = doc(db, 'users', userLogado.uid);
      // const userDataFromFirebase = (await getDoc(userDoc)).data();

      getDoc(userDoc).then((usr) => {
        const usrData = usr.data();
        setUserData(usrData);
        getAnnouncements();
      });

    }

    
    if (signed) {
      checkUserHasPassword();
      getUserData();
    } else {
      getAnnouncements();

    }
  }, [navigate, userLogado, signed, basePath]);



  return (
    <div className='root'>
      <Navbar current="home" />
      <div className="container">

        <div className='d-flex justify-content-center pt-3'>
          <div className="search col-sm-10 ">
            <FontAwesomeIcon icon={faSearch} className="fa-search" />
            <input type="text" className='form-control' placeholder='Pesquisar veículos' />
          </div>
        </div>

        <div className="row row-cols-1 row-cols-md-5 g-4 pt-5">
          {announcements.map((announcement) => {
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
                isFavorite={userData?.favorites.includes(announcement.id)}
              />
            )
          })}

        </div>
      </div>
    </div>
  )
}
