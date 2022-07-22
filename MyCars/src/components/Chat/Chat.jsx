import { faPaperPlane } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { addDoc, collection, doc, getDoc, Timestamp } from 'firebase/firestore';
import React, { useEffect } from 'react'
import { useState } from 'react';
import { db } from '../../services/firebaseConfig';

import './Chat.css';
import ChatHeader from './ChatHeader';
import MyMessage from './MyMessage';
import OtherMessage from './OtherMessage';

export default function Chat({ announcement, announcementId, messagesChat}) {

    const userLogado = JSON.parse(sessionStorage.getItem("@AuthFirebase:user"));
    const [txtMessage, setTxtMessage] = useState("");

    const [scrollHeight, setScrollHeight] = useState(0);

    function scrollChat() {
        const chatHistory = document.querySelector("#chat-history");
        if (scrollHeight !== chatHistory.scrollHeight) {
            chatHistory.scrollTo(0, chatHistory.scrollHeight);
            setScrollHeight(chatHistory.scrollHeight);
        }
    }


    useEffect(() => {

        scrollChat();

    }, [scrollChat, announcementId]);


    async function sendMessage() {

        if (txtMessage === "") return;
        let nameTo = "";
        let idTo = "";

        if (messagesChat.length === 0 || announcement.dono !== `/users/${userLogado.uid}`) {
            const ownerDoc = doc(db, "users", announcement.dono.split('/')[2]);
            const ownerData = (await getDoc(ownerDoc)).data();
            nameTo = ownerData.name;
            idTo = announcement.dono.split('/')[2];
        } else {
            const msgFiltered = messagesChat.filter((msg) => {
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

        addDoc(collection(db, "messageNegociation"), messageData);
        setTxtMessage("");
        scrollChat();
    }


    return (
        <div className="chat">
            <ChatHeader name={`${announcement?.marca} ${announcement?.modelo} `} img={announcement?.images[0]} owner={announcement?.ownerName} />

            <div className="chat-history" id="chat-history">
                <ul className="m-b-0">

                    {messagesChat?.map((message) => {
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

    )
}
