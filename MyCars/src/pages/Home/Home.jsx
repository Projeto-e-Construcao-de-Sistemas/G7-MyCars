import React, { useContext, useEffect } from 'react';
import { AuthenticationContext } from '../../context/authenticationContext';
import { useNavigate } from 'react-router';
import { Navbar } from '../../components/Navbar';

export const Home = () => {

  const { signed } = useContext(AuthenticationContext);
  const userLogado = JSON.parse(sessionStorage.getItem("@AuthFirebase:user"));
  const navigate = useNavigate();

  useEffect(() => {
    function checkUserHasPassword() {
      if(!userLogado) return;
      const providerData = userLogado.providerData;
      if (providerData.length === 1 && providerData[0].providerId === 'google.com') {
        navigate("/completeAccount");
      }
    }

    if (signed) {
      checkUserHasPassword();
    }
  }, [navigate, userLogado, signed])


  return (
    <div className='root'>
      <Navbar current="home" />
    </div>
  )
}
