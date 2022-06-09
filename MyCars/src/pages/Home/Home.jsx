import React, { useContext, useEffect, useState } from 'react';
import { AuthenticationContext } from '../../context/authenticationContext';
import { useNavigate } from 'react-router';
import { Navbar } from '../../components/Navbar';
import { AnnouceCard } from '../../components/AnnouceCard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

import './home.css';

export const Home = () => {

  const { signed } = useContext(AuthenticationContext);
  const userLogado = JSON.parse(sessionStorage.getItem("@AuthFirebase:user"));
  const navigate = useNavigate();

  let [announces] = useState([]);

  useEffect(() => {
    function checkUserHasPassword() {
      if (!userLogado) return;
      const providerData = userLogado.providerData;
      if (providerData.length === 1 && providerData[0].providerId === 'google.com') {
        navigate("/completeAccount");
      }
    }

    if (signed) {
      checkUserHasPassword();
    }
  }, [navigate, userLogado, signed]);

  function showAnnounces() {
    announces = [];
    for (let i = 1; i <= 50; i++) {
      announces.push(i);
    }
  }

  showAnnounces();

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
          {announces.map((i) => {
            return (
              <AnnouceCard
                key={i}
                title={`Carro foda ${i}`}
                description="Esse carro é pika pagarai galera, comprem"
                price="60.000"
                yearFabrication="2008"
                yearVehicle="2009"
                quilometragem="90.000"
                estado="Rio de Janeiro - RJ" />
            )
          })}

        </div>
      </div>
    </div>
  )
}
