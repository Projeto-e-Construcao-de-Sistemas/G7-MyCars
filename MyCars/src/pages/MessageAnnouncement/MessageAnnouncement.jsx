import { collection, doc, getDoc, onSnapshot, query, where } from 'firebase/firestore';
import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router';
import Chat from '../../components/Chat/Chat';
import PeopleList from '../../components/Chat/PeopleList';
import { Navbar } from '../../components/Navbar';
import { AuthenticationContext } from '../../context/authenticationContext';
import { db } from '../../services/firebaseConfig';

export default function MessageAnnouncement() {
    const { id } = useParams();

    const { signed } = useContext(AuthenticationContext);

    const userLogado = JSON.parse(sessionStorage.getItem("@AuthFirebase:user"));

    const navigate = useNavigate();

    const [currentAnnouncement, setCurrentAnnouncement] = useState();
    const [messages, setMessages] = useState([]);

    const baseUrl = process.env.PUBLIC_URL + "/";

    const enviromnent = process.env.NODE_ENV;
    const basePath = (enviromnent === "production") ? baseUrl : "/";


    useEffect(() => {

        const getAnnouncements = async () => {
            if (!id || currentAnnouncement) return;

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

        async function getOwner() {
            if(!currentAnnouncement) return;
                const dono = currentAnnouncement?.dono.split('/')[2];

                const ownerDoc = doc(db, "users", dono);
                const owner = (await getDoc(ownerDoc)).data();
                
                currentAnnouncement.ownerName = owner.name;
        }

        
        async function getMessages() {
            if(messages.length !== 0) return;

            const messagesQuery = query(collection(db, "messageNegociation"), where("announcement", "==", `${id}`));
            onSnapshot(messagesQuery, (snapshot) => {
                const messagesSorted = (snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
                messagesSorted.sort((x, y) => {
                    return x.timestamp.toDate() < y.timestamp.toDate() ? 1 : -1
                }).reverse();

                const msgFiltered = messagesSorted.filter((msg) => {
                    return msg.idFrom === userLogado.uid || msg.idTo === userLogado.uid;
                });

                setMessages(msgFiltered);
            });
        }

        
        getAnnouncements().then(()=>{
            getMessages();
        });
        getOwner();
        
        if (signed) {
            checkUserHasPassword();
        }
    }, [setCurrentAnnouncement, id, currentAnnouncement, basePath, navigate, userLogado, signed, messages]);

    return (
        <div id='root'>
            <Navbar current="comprar" />

            <div className="container">
                <div className="row clearfix">
                    <div className="col-lg-12">
                        <div className="card chat-app">

                            <PeopleList listAnnouncements={[currentAnnouncement]} />

                            <Chat announcement={currentAnnouncement} announcementId={id} messagesChat={messages} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
