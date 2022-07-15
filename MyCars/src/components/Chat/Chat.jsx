import { faPaperPlane } from '@fortawesome/free-regular-svg-icons';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { addDoc, collection, doc, getDoc, getDocs, onSnapshot, orderBy, query, Timestamp, where } from 'firebase/firestore';
import { ref } from 'firebase/storage';
import React, { useEffect } from 'react'
import { useState } from 'react';
import { db } from '../../services/firebaseConfig';

import './Chat.css';
import ChatAnnouncement from './ChatAnnouncement';
import ChatHeader from './ChatHeader';
import MyMessage from './MyMessage';
import OtherMessage from './OtherMessage';

export default function Chat({ announcement, announcementId }) {

    const [placeHolder, setplaceHolder] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);

    const [messages, setMessages] = useState([]);
    const userLogado = JSON.parse(sessionStorage.getItem("@AuthFirebase:user"));

    const [txtMessage, setTxtMessage] = useState("");

    function scrollChat() {

        const chatHistory = document.querySelector("#chat-history");
        chatHistory.scrollTo(0, chatHistory.scrollHeight);
    }


    useEffect(() => {

        async function getMessages() {

            const messagesQuery = query(collection(db, "messageNegociation"), where("announcement", "==", `${announcementId}`));
            onSnapshot(messagesQuery, (snapshot) => {
                const messagesSorted = (snapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
                messagesSorted.sort((x, y) => {
                    return x.timestamp.toDate() < y.timestamp.toDate() ? 1 : -1
                }).reverse();

                setMessages(messagesSorted);

            });
        }

        getMessages();

        scrollChat();
    }, [scrollChat]);

    async function sendMessage() {

        let nameTo = "";
        let idTo = "";

        if (messages.length === 0 || announcement.dono !== `/users/${userLogado.uid}`) {
            const ownerDoc = doc(db, "users", announcement.dono.split('/')[2]);
            const ownerData = (await getDoc(ownerDoc)).data();
            nameTo = ownerData.name;
            idTo = announcement.dono;
        }else{
            const msgFiltered = messages.filter((msg)=>{
                return msg.idFrom.id !== ` ${userLogado.uid}`;
            });

            idTo = msgFiltered[0].idFrom;
            nameTo = msgFiltered[0].nameFrom;
        }

        
        const messageData = {
            message: txtMessage,
            timestamp: Timestamp.fromDate(new Date()),
            nameFrom: userLogado.displayName,
            idFrom: userLogado.uid,
            announcement: announcementId,
            nameTo,
            idTo
        }

        await addDoc(collection(db, "messageNegociation"), messageData);
        setTxtMessage("");
        scrollChat();
    }

    return (
        <div className="container">
            <div className="row clearfix">
                <div className="col-lg-12">
                    <div className="card chat-app">
                        <div id="plist" className="people-list">

                            <ul className="list-unstyled chat-list mt-2 mb-0">
                                <ChatAnnouncement name={`${announcement?.marca} ${announcement?.modelo} `} img={announcement?.images[0]} />
                            </ul>
                        </div>

                        <div className="chat">
                            <ChatHeader name={`${announcement?.marca} ${announcement?.modelo} `} img={announcement?.images[0]} />

                            <div className="chat-history" id="chat-history">
                                <ul className="m-b-0">

                                    {messages?.map((message) => {
                                        if (message.idFrom === `${userLogado.uid}`) {
                                            return <MyMessage key={message.id} message={message} />
                                        } else {
                                            return <OtherMessage key={message.id} message={message} />
                                        }
                                    })}

                                </ul>
                            </div>

                            <div className="chat-message clearfix">
                                <div className="input-group mb-0">
                                    <input type="text" value={txtMessage} className="form-control" placeholder="Digite sua mensagem" onKeyDown={(e) => { if (e.key === 'Enter') { sendMessage() } }} onChange={e => setTxtMessage(e.target.value)} />

                                    <button onClick={sendMessage} type="button" className="btn input-group-prepend" aria-describedby="button-addon2">
                                        <span className="input-group-text" id="button-addon2"><FontAwesomeIcon icon={faPaperPlane} /></span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
