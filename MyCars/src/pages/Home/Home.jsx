import React, { useContext, useEffect, useState } from 'react';
import { AuthenticationContext } from '../../context/authenticationContext';
import { useNavigate } from 'react-router';
import { Navbar } from '../../components/Navbar';
import { AnnouceCard } from '../../components/AnnouceCard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

import './home.css';
import { collection, disableNetwork, doc, getDocs, getDocsFromServer, onSnapshot, query } from 'firebase/firestore';
import { db } from '../../services/firebaseConfig';

export const Home = () => {

  const { signed } = useContext(AuthenticationContext);
  const userLogado = JSON.parse(sessionStorage.getItem("@AuthFirebase:user"));
  

  const [announcements, setAnnouncements] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    function checkUserHasPassword() {
      if (!userLogado) return;
      const providerData = userLogado.providerData;
      if (providerData.length === 1 && providerData[0].providerId === 'google.com') {
        navigate("/completeAccount");
      }
    }

    function getAnnouncements() {
      onSnapshot(collection(db, "announcement"), (snapshot)=>{
        setAnnouncements(snapshot.docs.map((doc) => ({...doc.data(), id: doc.id})));
      });
  
    }
  
    getAnnouncements();

    if (signed) {
      checkUserHasPassword();
    }
  }, [navigate, userLogado, signed]);


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
                title={announcement.modelo}
                description={announcement.descricao}
                price={announcement.valor}
                yearFabrication={announcement.anoFabricacao}
                yearVehicle={announcement.anoModelo}
                quilometragem={announcement.quilometragem}
                imageUrl={announcement.images[0]}
                estado="Rio de Janeiro - RJ" />
            )
          })}

        </div>
      </div>
    </div>
  )
}
