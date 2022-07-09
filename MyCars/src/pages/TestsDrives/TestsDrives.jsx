import React, { useContext, useEffect, useState } from 'react';
import { AuthenticationContext } from '../../context/authenticationContext';
import { useNavigate } from 'react-router';
import { Navbar } from '../../components/Navbar';

import { collection, getDocs, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../../services/firebaseConfig';
import { TestDriveCard } from '../../components/TestDriveCard/TestDriveCard';


export function TestsDrives() {

    const { signed } = useContext(AuthenticationContext);
    const userLogado = JSON.parse(sessionStorage.getItem("@AuthFirebase:user"));

    const baseUrl = process.env.PUBLIC_URL + "/";
    const enviromnent = process.env.NODE_ENV;
    const basePath = (enviromnent === "production") ? baseUrl : "/";

    const [announcements, setAnnouncements] = useState([]);
    const [cardsComponents, setCardsComponents] = useState([]);

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
            if (announcements.length !== 0) return;

            const q = query(collection(db, "announcement"), where("dono", "==", `/users/${userLogado.uid}`));
            onSnapshot(q, (snapshot) => {
                const announcementsData = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
                setAnnouncements(announcementsData);
            });
        }


        async function getTestsDrives() {
            if (cardsComponents.length !== 0) return;

            let cardData = [];

            for (let i = 0; i < announcements.length; i++) {
                const annoucement = announcements[i];

                const testDriveQuery = query(collection(db, "testsDrive"), where("annoucement", "==", `${annoucement.id}`), where("approved", "==", false), where("declined", "==", false));
                const testDriveSnapshot = await getDocs(testDriveQuery);

                testDriveSnapshot.forEach((doc) => {

                    const testDrive = ({ ...doc.data(), id: doc.id });

                    const testDriveDate = new Date(testDrive.dateTime);
                    const testDriveTime = `${testDriveDate.getHours()}:${testDriveDate.getMinutes()}`
                    const testDriveDateTimeString = ` ${testDriveDate.toLocaleDateString('pt-BR')} às ${testDriveTime}`

                    cardData.push({
                        title: annoucement.marca+" "+annoucement.modelo,
                        solicitanteName: testDrive.nomeSolicitante,
                        dateTime: testDriveDateTimeString,
                        id: testDrive.id,
                        imageUrl: annoucement.images[0]
                    });
                });
            }

            if (cardData.length !== 0) setCardsComponents(cardData);
        }


        if (signed) {
            checkUserHasPassword();
            getAnnouncements();
            getTestsDrives();
        }

    }, [navigate, userLogado, signed, announcements, setCardsComponents, cardsComponents, basePath]);

    function onUpdate(){
        window.location.reload();
    }

    return (
        <div className='root'>
            <Navbar current="testDrive" />
            <div className="container">

                <h3 className='text-center'>Solicitações de tests drives</h3>
                <div className="row row-cols-1 row-cols-md-5 g-4 pt-5">

                    {cardsComponents?.map((cardComponent) => {
                        return <TestDriveCard
                            title={cardComponent.title}
                            solicitanteName={cardComponent.solicitanteName}
                            dateTime={cardComponent.dateTime}
                            imageUrl={cardComponent.imageUrl}
                            id={cardComponent.id}
                            key={cardComponent.id}
                            onUpdate={onUpdate}
                        />
                    })}
                </div>
            </div>
        </div>

    )
}
