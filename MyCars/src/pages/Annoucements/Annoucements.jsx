import React, { useContext } from 'react';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { db } from '../../services/firebaseConfig';
import { addDoc, collection, doc, getDoc, onSnapshot, updateDoc } from 'firebase/firestore';
import { Navbar } from '../../components/Navbar';
import { Link } from 'react-router-dom';
import "./annoucements.css";

import { Modal } from 'bootstrap';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { AuthenticationContext } from '../../context/authenticationContext';

export const Annoucements = () => {

  const { id } = useParams();

  const { signed } = useContext(AuthenticationContext);
  const userLogado = JSON.parse(sessionStorage.getItem("@AuthFirebase:user"));

  const navigate = useNavigate();

  const [currentAnnouncement, setCurrentAnnouncement] = useState();
  const [validateState, setValidateState] = useState("");

  const baseUrl = process.env.PUBLIC_URL + "/";

  const enviromnent = process.env.NODE_ENV;
  const basePath = (enviromnent === "production") ? baseUrl : "/";


  const schema = yup.object({
    date: yup.string().required("Selecione uma data válida"),
    time: yup.string().required("Selecione um horário válido.")

  });


  const { register, handleSubmit, setValue, unregister, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  });


  useEffect(() => {

    const getAnnouncements = async () => {

      if (!id || currentAnnouncement) return

      const announcementDoc = doc(db, "announcement", id);
      const response = (await getDoc(announcementDoc)).data();
      setCurrentAnnouncement(response)
    }

    function checkUserHasPassword() {
      const providerData = userLogado.providerData;
      if (providerData.length === 1 && providerData[0].providerId === 'google.com') {
        navigate(basePath + "completeAccount");
      }
    }

    getAnnouncements();

    if (signed) {
      checkUserHasPassword();
    }
  }, [setCurrentAnnouncement, id]);

  async function onSubmit(testDrive) {
    const { date, time } = testDrive;

    const nextDay = new Date(new Date().getTime() + (24 * 60 * 60 * 1000));
    const dateTime = new Date(`${date}T${time}`);

    if (dateTime <= nextDay) {
      setValidateState("O test-drive só poderá ser agendado com no mínimo 24h de antecendência.");
      return;
    }

    if (time < "08:00:00" || time > "18:00:00") {
      setValidateState("O test-drive só poderá ser agendado em horário comercial.");
      return;
    }

    const solicitante = userLogado.uid;

    const testDriveData = {
      solicitante,
      nomeSolicitante: userLogado.displayName,
      dateTime,
      annoucement: id,
      approved: false
    }

    await addDoc(collection(db, "testsDrive"), testDriveData);

    document.getElementById("btnCancel").click();
    document.getElementById("success").classList.remove("hidden");
    setValidateState("");
  }

  return (
    <div className='root'>
      <Navbar current="home" />

      <div className="container">

        <div className="alert alert-success hidden" id="success" role="alert">
          Test drive solicitado com sucesso!
        </div>
      </div>
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
            {signed ? (
              <div>
                <Link to={basePath} type='button' className='btn btn-primary btn-block'>Fazer oferta</Link>
                <button to={basePath} data-bs-toggle="modal" data-bs-target="#modal" type='button' className='btn btn-primary '>Test-drive</button>
              </div>
            ) : (<></>)
            }
          </div>
        </div>
      </div>


      <div className="modal" tabIndex="-1" id="modal">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Solicitar Test Drive</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="modal-body">
                <h5>Selecione a data e o horário do test drive:</h5>
                <input type="date" name="date" id="testDriveDate" {...register("date")} />
                <input type="time" name="time" id="testDriveTime" {...register("time")} />

                <p className='error-message'>{errors.date?.message}</p>
                <p className='error-message'>{errors.time?.message}</p>
                <p className='error-message'>{validateState}</p>

              </div>
              <div className="modal-footer">
                <button type="submit" className="btn btn-primary">Solicitar</button>
                <button type="button" className="btn btn-secondary" id="btnCancel" data-bs-dismiss="modal">Cancelar</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Annoucements;