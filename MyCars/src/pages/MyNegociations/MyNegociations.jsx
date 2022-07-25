
import React, { useEffect, useState } from 'react'
import { Sidebar } from '../../components/Sidebar';
import { Link } from 'react-router-dom';


import './MyNegociations.css';
import { collection, doc, getDoc, onSnapshot, query } from 'firebase/firestore';
import { db } from '../../services/firebaseConfig';
import PeopleList from '../../components/Chat/PeopleList';
import Chat from '../../components/Chat/Chat';

export default function MyNegociations() {


    // const baseUrl = process.env.PUBLIC_URL + "/";
    // const enviromnent = process.env.NODE_ENV;
    // const basePath = (enviromnent === "production") ? baseUrl : "/";

    const basePath = "/";

    const userLogado = JSON.parse(sessionStorage.getItem("@AuthFirebase:user"));

    const [messages, setMessages] = useState([]);
    const [messagesAnnouncements, setMessagesAnnouncements] = useState([]);
    const [announcementsPeople, setAnnouncementsPeople] = useState([]);
    const [chatInfos, setChatInfos] = useState(null);
    const [msgLength, setMsgLength] = useState(messages.length);
    const [chatSelected, setChatSelected] = useState();


    useEffect(() => {

        async function getMessages() {

            const messagesQuery = query(collection(db, "messageNegociation"));
            onSnapshot(messagesQuery, (snapshot) => {
                const messagesSorted = (snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
                messagesSorted.sort((x, y) => {
                    return x.timestamp.toDate() < y.timestamp.toDate() ? 1 : -1
                }).reverse();

                const msgFiltered = messagesSorted.filter((msg) => {
                    return msg.idFrom === userLogado.uid || msg.idTo === userLogado.uid;
                });

                const msgAnnouncements = msgFiltered.filter((msg, index, self) =>
                    index === self.findIndex((t) => (
                        (t.announcement === msg.announcement) && (t.idFrom === msg.idFrom && t.idTo === userLogado.uid)
                    ))
                );

                setMessages(msgFiltered);
                setMsgLength(messages.length);
                setMessagesAnnouncements(msgAnnouncements);
            });
        }

        async function getAnnouncementsPeople() {
            if (messagesAnnouncements.length === 0) return;
            if (announcementsPeople.length !== 0) return;

            const announcementsPeopleList = [];
            for (let i = 0; i < messagesAnnouncements.length; i++) {
                const announcementId = messagesAnnouncements[i].announcement;
                const { nameFrom, idFrom } = messagesAnnouncements[i];


                const announcementDoc = doc(db, "announcement", announcementId);
                const announcement = (await getDoc(announcementDoc)).data();

                announcement.ownerName = nameFrom;
                announcement.idFrom = idFrom;
                announcement.id = announcementId;
                announcementsPeopleList.push(announcement);
            }

            setAnnouncementsPeople(announcementsPeopleList);
        }

        getMessages().then(() => {
            if (messages.length !== msgLength) {
                updateChatHistory();
            }
        });
        getAnnouncementsPeople();


        function updateChatHistory() {
            if (!chatSelected) return;
            const { msgFromId, announcementId } = chatSelected;


            const announcement = announcementsPeople.filter((announcementPeople) => {
                return announcementPeople.id === announcementId;
            })[0];

            const msgFiltered = messages.filter((msg) => {
                return (msg.announcement === announcementId) && (msg.idFrom === msgFromId || msg.idTo === msgFromId);
            });

            setChatInfos({
                announcement,
                announcementId,
                messagesChat: msgFiltered
            });
        }

    }, [setAnnouncementsPeople, setMessages, setMessagesAnnouncements, msgLength, setMsgLength, chatSelected, userLogado, announcementsPeople, messages, messagesAnnouncements]);


    function listItemClicked(item) {
        const msgFromId = item.currentTarget.id;

        const announcementId = item.currentTarget.classList[1];
        setChatSelected({ announcementId, msgFromId });

        const announcement = announcementsPeople.filter((announcementPeople) => {
            return announcementPeople.id === announcementId;
        })[0];

        const msgFiltered = messages.filter((msg) => {
            return (msg.announcement === announcementId) && (msg.idFrom === msgFromId || msg.idTo === msgFromId);
        });

        setChatInfos({
            announcement,
            announcementId,
            messagesChat: msgFiltered
        });
    }

    return (
        <div className="root">
            <header className='navbar navbar-light sticky-top flex-md-nowrap p-0 shadow'>

                <Link to={basePath} className='navbar-brand col-md-3 col-lg-2 me-0 px-3 '>MyCars</Link>
                <div className="navbar-nav">
                    <div className="nav-item text-nowrap">
                        <Link to={basePath} className="nav-link px-3">{userLogado.displayName}</Link>
                    </div>
                </div>
            </header>
            <div className="container-fluid">
                <Sidebar current={"myNegociations"} />

                <div className="container">
                    <div className="row clearfix">
                        <div className="col-lg-12">
                            <div className="card chat-app">

                                {(msgLength === 0) ?
                                    (<h2>Você não possui nenhuma mensagem até o momento.</h2>)
                                    : (
                                        <div>
                                            <PeopleList listAnnouncements={announcementsPeople} onClick={listItemClicked} ownerSet={true} />

                                            {chatInfos && <Chat announcementId={chatInfos.announcementId} announcement={chatInfos.announcement} messagesChat={chatInfos.messagesChat} />}
                                        </div>
                                    )
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
