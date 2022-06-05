import React, { useContext, useEffect } from 'react';
import { AuthenticationContext } from '../../context/authenticationContext';
import { useNavigate } from 'react-router';

export const Profile = () => {

    const { signOutFromApp } = useContext(AuthenticationContext);
    const userLogado = JSON.parse(sessionStorage.getItem("@AuthFirebase:user"));
    const navigate = useNavigate();

    useEffect(() => {
        function checkUserHasPassword() {
            const providerData = userLogado.providerData;
            if (providerData.length === 1 && providerData[0].providerId === 'google.com') {
                navigate("/completeAccount");
            }
        }
    
        checkUserHasPassword();
    }, [navigate, userLogado])

    async function signOut() {
        await signOutFromApp();
        navigate("/login");
    }
    return (
        <div>
            <h1>{userLogado.displayName}</h1>
            <button onClick={signOut}>Sair</button>
        </div>
    )
}

export default Profile;