import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect } from 'react'
import { useState } from 'react';
import { db } from '../../services/firebaseConfig';
import ChatAnnouncement from './ChatAnnouncement'

export default function PeopleList({ listAnnouncements, onClick, ownerSet = false }) {

    const [listOfAnnouncements, setListOfAnnouncements] = useState(listAnnouncements);

    useEffect(() => {
        async function getOwner() {
            const announcementsFull = [];
            for (let i = 0; i < listAnnouncements.length; i++) {
                const announcement = listAnnouncements[i];
                const dono = announcement?.dono.split('/')[2];

                const ownerDoc = doc(db, "users", dono);
                const owner = (await getDoc(ownerDoc)).data();
                
                announcement.ownerName = owner.name;
                announcementsFull.push(announcement);
            }
        }


        if(!ownerSet) getOwner();
    }, [listAnnouncements, listOfAnnouncements, setListOfAnnouncements, ownerSet])

    return (
        <div id="plist" className="people-list">

            <ul className="list-unstyled chat-list mt-2 mb-0" >
                {listAnnouncements.map((announcement) => {
                    return <ChatAnnouncement key={`${announcement.id} ${announcement.idFrom}`}onClick={onClick} announcementId={announcement?.id} id={announcement?.idFrom} name={`${announcement?.marca} ${announcement?.modelo} `} img={announcement?.images[0]} owner={announcement?.ownerName}/>
                })}
            </ul>
        </div>
    )
}
