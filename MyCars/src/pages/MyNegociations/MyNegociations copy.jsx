
import React, { useEffect, useState } from 'react'
import { Sidebar } from '../../components/Sidebar';
import { Link } from 'react-router-dom';


import './MyNegociations.css';
import { collection, onSnapshot, query } from 'firebase/firestore';
import { db } from '../../services/firebaseConfig';

export default function MyNegociations() {


    const baseUrl = process.env.PUBLIC_URL + "/";
    const enviromnent = process.env.NODE_ENV;
    const basePath = (enviromnent === "production") ? baseUrl : "/";

    const userLogado = JSON.parse(sessionStorage.getItem("@AuthFirebase:user"));

    const [messages, setMessages] = useState([]);
    const [txtMessage, setTxtMessage] = useState("");
    const [messagesAnnouncements, setMessagesAnnouncements] = useState([]);

    const [scrollHeight, setScrollHeight] = useState(0);

    function scrollChat() {
        const chatHistory = document.querySelector("#chat-history");
        if (scrollHeight !== chatHistory.scrollHeight) {
            chatHistory.scrollTo(0, chatHistory.scrollHeight);
            setScrollHeight(chatHistory.scrollHeight);
        }
    }

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
                        t.idFrom === msg.idFrom && t.idTo === userLogado.uid
                    ))
                );

                setMessages(msgFiltered);
                setMessagesAnnouncements(msgAnnouncements);
            });
        }

        getMessages();
        scrollChat();

    }, [scrollChat]);


    // async function sendMessage() {

    //     if (txtMessage === "") return;
    //     let nameTo = "";
    //     let idTo = "";

    //     if (messages.length === 0 || announcement.dono !== `/users/${userLogado.uid}`) {
    //         const ownerDoc = doc(db, "users", announcement.dono.split('/')[2]);
    //         const ownerData = (await getDoc(ownerDoc)).data();
    //         nameTo = ownerData.name;
    //         idTo = announcement.dono;
    //     } else {
    //         const msgFiltered = messages.filter((msg) => {
    //             return msg.idFrom.id !== ` ${userLogado.uid}`;
    //         });

    //         idTo = msgFiltered[0].idFrom;
    //         nameTo = msgFiltered[0].nameFrom;
    //     }


    //     const messageData = {
    //         message: txtMessage,
    //         timestamp: Timestamp.fromDate(new Date()),
    //         nameFrom: userLogado.displayName,
    //         idFrom: userLogado.uid,
    //         announcement: announcementId,
    //         nameTo,
    //         idTo
    //     }

    //     addDoc(collection(db, "messageNegociation"), messageData);
    //     setTxtMessage("");
    //     scrollChat();
    // }

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
                <Sidebar current={"profile"} />


                <div className="container">
                    <div className="row clearfix">
                        <div className="col-lg-12">
                            <div className="card chat-app">

                                <div id="plist" className="people-list">

                                    <ul className="list-unstyled chat-list mt-2 mb-0" role="tablist" >
                                        <li className="clearfix">
                                            <img src="https://bootdey.com/img/Content/avatar/avatar1.png" alt="avatar" />
                                            <div className="about">
                                                <div className="name">Vincent Porter</div>
                                                <div className="status"> <i className="fa fa-circle offline"></i> left 7 mins ago </div>
                                            </div>
                                        </li>
                                        <li className="clearfix active">
                                            <img src="https://bootdey.com/img/Content/avatar/avatar2.png" alt="avatar" />
                                            <div className="about">
                                                <div className="name">Aiden Chavez</div>
                                                <div className="status"> <i className="fa fa-circle online"></i> online </div>
                                            </div>
                                        </li>
                                        <li className="clearfix">
                                            <img src="https://bootdey.com/img/Content/avatar/avatar3.png" alt="avatar" />
                                            <div className="about">
                                                <div className="name">Mike Thomas</div>
                                                <div className="status"> <i className="fa fa-circle online"></i> online </div>
                                            </div>
                                        </li>

                                    </ul>
                                </div>

                                <div className="chat">
                                    <div className="chat-header clearfix">
                                        <div className="row">
                                            <div className="col-lg-6">
                                                <a href="javascript:void(0);" data-toggle="modal" data-target="#view_info">
                                                    <img src="https://bootdey.com/img/Content/avatar/avatar2.png" alt="avatar" />
                                                </a>
                                                <div className="chat-about">
                                                    <h6 className="m-b-0">Aiden Chavez</h6>
                                                    <small>Last seen: 2 hours ago</small>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="chat-history" id="chat-history">
                                        <ul className="m-b-0">
                                            <li className="clearfix">
                                                <div className="message-data text-right">
                                                    <span className="message-data-time">10:10 AM, Today</span>
                                                    <img src="https://bootdey.com/img/Content/avatar/avatar7.png" alt="avatar" />
                                                </div>
                                                <div className="message other-message float-right"> Hi Aiden, how are you? How is the project coming along? </div>
                                            </li>
                                            <li className="clearfix">
                                                <div className="message-data">
                                                    <span className="message-data-time">10:12 AM, Today</span>
                                                </div>
                                                <div className="message my-message">Are we meeting today?</div>
                                            </li>
                                            <li className="clearfix">
                                                <div className="message-data">
                                                    <span className="message-data-time">10:15 AM, Today</span>
                                                </div>
                                                <div className="message my-message">Project has been already finished and I have results to show you.</div>
                                            </li>
                                        </ul>
                                    </div>




                                    <div className="chat-message clearfix">
                                        <div className="input-group mb-0">
                                            <div className="input-group-prepend">
                                                <span className="input-group-text"><i className="fa fa-send"></i></span>
                                            </div>
                                            <input type="text" className="form-control" placeholder="Enter text here..." />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>

    )
}
