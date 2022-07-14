import { faPaperPlane } from '@fortawesome/free-regular-svg-icons';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect } from 'react'
import { useState } from 'react';

import './Chat.css';
import ChatAnnouncement from './ChatAnnouncement';
import ChatHeader from './ChatHeader';
import MyMessage from './MyMessage';
import OtherMessage from './OtherMessage';

export default function Chat({ announcement }) {

    const [placeHolder, setplaceHolder] = useState([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);


    useEffect(() => {
      

        function scrollChat(){

            const chatHistory = document.querySelector("#chat-history");
            chatHistory.scrollTo(0, chatHistory.scrollHeight);
        }

        scrollChat();
    }, [])
    
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
                            <ChatHeader name={`${announcement?.marca} ${announcement?.modelo} `} img={announcement?.images[0]}/>

                            <div className="chat-history" id="chat-history">
                                <ul className="m-b-0">

                                    {placeHolder.map((i) => {
                                        if (i % 2 === 0) {
                                            return <MyMessage key={i} dateTime={new Date()} message={"Opa, e ai vei"} />
                                        } else {
                                            return <OtherMessage key={i} dateTime={new Date()} message={"Opa, e ai vei"} />
                                        }
                                    })}

                                </ul>
                            </div>

                            <div className="chat-message clearfix">
                                <div className="input-group mb-0">
                                    <input type="text" className="form-control" placeholder="Enter text here..." />
                                    <div className="input-group-prepend">
                                        <span className="input-group-text"><FontAwesomeIcon icon={faPaperPlane} /></span>
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
