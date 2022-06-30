import React, { } from 'react';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { db } from '../../services/firebaseConfig';
import { addDoc, doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore';
import { Navbar } from '../../components/Navbar';
import { Link } from 'react-router-dom';
import "./annoucements.css"


export const Annoucements = () => {

  const { id } = useParams();
  const [currentAnnouncement, setCurrentAnnouncement] = useState();

  const baseUrl = process.env.PUBLIC_URL+"/";
  const enviromnent = process.env.NODE_ENV;
  const basePath = (enviromnent === "production") ? baseUrl : "/";

  useEffect(() => {

    const getAnnouncements = async () => {

      if (!id || currentAnnouncement) return

      const announcementDoc = doc(db, "announcement", id);
      const response = (await getDoc(announcementDoc)).data();
      setCurrentAnnouncement(response)
    }

    getAnnouncements();

  }, [setCurrentAnnouncement, id]);

  return (
    <div className='root'>
      <Navbar current="home" />
      <div className='announce d-flex flex-column justify-content-center pt-5 pb-2 mx-auto'>
        <div className='d-flex justify-content-center'>
          <img src={currentAnnouncement?.images[0]} alt="" className='' />
          <div className='info border d-flex flex-wrap justify-content-between'>
            <h2>{currentAnnouncement?.marca} {currentAnnouncement?.modelo} {currentAnnouncement?.anoModelo}</h2>
            <p id='descricao'>{currentAnnouncement?.descricao}</p>
            <p><h5>Quilometragem: </h5>{currentAnnouncement?.quilometragem} Km</p>
            <p><h5>Cor: </h5> {currentAnnouncement?.cor}</p>
            <p><h5>Cambio: </h5> {currentAnnouncement?.tipoCambio}</p>
            <p><h5> {currentAnnouncement?.tipoVeiculo}</h5></p>
            <Link to={basePath} type='button' className='btn btn-primary btn-block'>Fazer oferta</Link>
            <Link to={basePath} type='button' className='btn btn-primary '>Test-drive</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Annoucements;