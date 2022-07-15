import { doc, getDoc } from 'firebase/firestore';
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router';
import { ThemeContext } from '../../App';
import Chat from '../../components/Chat/Chat';
import { Navbar } from '../../components/Navbar';
import { AuthenticationContext } from '../../context/authenticationContext';
import { db } from '../../services/firebaseConfig';

export default function MessageAnnouncement() {
    const { id } = useParams();

    const { signed } = useContext(AuthenticationContext);
    const { theme } = useContext(ThemeContext);

    const userLogado = JSON.parse(sessionStorage.getItem("@AuthFirebase:user"));

    const navigate = useNavigate();

    const [currentAnnouncement, setCurrentAnnouncement] = useState();

    const baseUrl = process.env.PUBLIC_URL + "/";

    const enviromnent = process.env.NODE_ENV;
    const basePath = (enviromnent === "production") ? baseUrl : "/";


    useEffect(() => {

        const getAnnouncements = async () => {

            if (!id || currentAnnouncement) return

            const announcementDoc = doc(db, "announcement", id);
            const response = (await getDoc(announcementDoc)).data();
            setCurrentAnnouncement(response);
        
      
        }

        function checkUserHasPassword() {
            const providerData = userLogado.providerData;
            if (providerData.length === 1 && providerData[0].providerId === 'google.com') {
                navigate(basePath + "completeAccount");
            }
        }

        getAnnouncements();

        if (signed) {
            checkUserHasPassword();
        }
    }, [setCurrentAnnouncement, id, currentAnnouncement, basePath, navigate, userLogado, signed]);


    return (
        <div id='root'>
            <Navbar current="comprar" />

            <div className="container">
                <Chat announcement={currentAnnouncement} announcementId={id} />

            </div>
        </div>
    )
}
