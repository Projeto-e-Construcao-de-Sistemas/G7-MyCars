import React, { } from 'react';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { db } from '../../services/firebaseConfig';
import { addDoc, doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore';
import { Navbar } from '../../components/Navbar';


export const Annoucements = () => {

  const { id } = useParams();
  const [currentAnnouncement, setCurrentAnnouncement] = useState();
  const [image, setImage] = useState();



  useEffect(() => {

    const getAnnouncements = async () => {

      if (!id || currentAnnouncement) return

      const announcementDoc = doc(db, "announcement", id);
      const response = (await getDoc(announcementDoc)).data();
      setCurrentAnnouncement(response)
    }

    getAnnouncements();

  }, [setCurrentAnnouncement, id]);

  console.log(currentAnnouncement)

  return (
    <div className='root'>
      <Navbar current="home" />
      <div className='card w-50 position-absolute top-50 start-50 translate-middle'>
        <img src={currentAnnouncement?.images[0]} alt="" className='' />
        {/* <p>{image}</p> */}
      </div>
    </div>
  )
}

export default Annoucements;