import React, { useContext, useEffect, useState } from 'react';
import { AuthenticationContext } from '../../context/authenticationContext';
import { useNavigate } from 'react-router';
import { Navbar } from '../../components/Navbar';
import { AnnouceCard } from '../../components/AnnouceCard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../../services/firebaseConfig';
import { TestDriveCard } from '../../components/TestDriveCard/TestDriveCard';


export function TestsDrives() {

    const { signed } = useContext(AuthenticationContext);
    const userLogado = JSON.parse(sessionStorage.getItem("@AuthFirebase:user"));

    const baseUrl = process.env.PUBLIC_URL + "/";
    const enviromnent = process.env.NODE_ENV;
    const basePath = (enviromnent === "production") ? baseUrl : "/";

    const [announcements, setAnnouncements] = useState([]);
    const [cardsComponents, setCardsComponents] = useState([])

    const navigate = useNavigate();


    useEffect(() => {
        function checkUserHasPassword() {
            if (!userLogado) return;
            const providerData = userLogado.providerData;
            if (providerData.length === 1 && providerData[0].providerId === 'google.com') {
                navigate(basePath + "completeAccount");
            }
        }


        function getTestsDrives(callback) {

            if (announcements.length != 0) return;   

            const q = query(collection(db, "announcement"), where("dono", "==", `/users/${userLogado.uid}`));
            onSnapshot(q, (snapshot) => {
                const announcementsData = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));

                for (let i = 0; i < announcementsData.length; i++) {
                    const annoucement = announcementsData[i];

                    const testDriveQuery = query(collection(db, "testsDrive"), where("annoucement", "==", `${annoucement.id}`));
                    onSnapshot(testDriveQuery, (snapshot) => {
                        const data = snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
                        annoucement.testsDrives = data;
                    });
                }

                callback();
                setAnnouncements(announcementsData);
                // console.log(announcementsData);
            });
        }
        
        function createCardsComponents() {
            announcements?.forEach((announcement) => {
                announcement?.testsDrives?.forEach((testDrive) => {
                    cardsComponents.push({
                        title: announcement.modelo,
                        solicitanteName: testDrive.nomeSolicitante,
                        dateTime: testDrive.dateTime,
                        id: testDrive.id,
                        imageUrl: announcement.images[0]
                    });
                });
            })
        }


        if (signed) {
            checkUserHasPassword();
            getTestsDrives(createCardsComponents);
        }

 
    }, [navigate, userLogado, signed]);

    // console.log(cardsComponents);


    // if(announcements.length !== 0) createCardsComponents();


    return (
        <div className='root'>
            <Navbar current="home" />
            <div className="container">

                <h3 className='text-center'>Solicitações de tests drives</h3>
                <div className="row row-cols-1 row-cols-md-5 g-4 pt-5">

                    {cardsComponents.map((cardComponent) => {
                        return <TestDriveCard
                            title={cardComponent.title}
                            solicitanteName={cardComponent.solicitanteName}
                            dateTime={"aa"}
                            imageUrl={cardComponent.imageUrl}
                            id={cardComponent.id}
                            key={cardComponent.id}
                        />
                    })}
                    {/* {(() => {


                        const cardComponents = [];

                        for (let i = 0; i < cardsComponents.length; i++) {
                            const cardComponent = cardsComponents[i];
                            console.log(cardsComponents);
                            cardComponents.push(
                                <TestDriveCard
                                    title={cardComponent.title}
                                    solicitanteName={cardComponent.solicitanteName}
                                    dateTime={cardComponent.dateTime}
                                    imageUrl={cardComponent.imageUrl}
                                    id={cardComponent.id}
                                    key={cardComponent.id}
                                />
                            )

                            return cardComponents;
                        }
                    })()} */}

                </div>
            </div>
        </div>

    )
}
