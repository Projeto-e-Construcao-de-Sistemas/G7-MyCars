import React, { useContext } from 'react';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { db } from '../../services/firebaseConfig';
import { addDoc, collection, doc, getDoc } from 'firebase/firestore';
import { Navbar } from '../../components/Navbar';
import "./annoucements.css";

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { AuthenticationContext } from '../../context/authenticationContext';
import { Carousel } from '../../components/Carousel/Carousel';
import { ThemeContext } from '../../App';
import { Link } from 'react-router-dom';


export const Annoucements = () => {

  const { id } = useParams();

  const { signed } = useContext(AuthenticationContext);
  const { theme } = useContext(ThemeContext);

  const userLogado = JSON.parse(sessionStorage.getItem("@AuthFirebase:user"));

  const fipeAPI = "https://veiculos.fipe.org.br/api/veiculos";

  const navigate = useNavigate();

  const [currentAnnouncement, setCurrentAnnouncement] = useState();
  const [valorFipe, setValorFipe] = useState();
  const [validateState, setValidateState] = useState("");
  const [userIsOwner, setuserIsOwner] = useState(false);

  const baseUrl = process.env.PUBLIC_URL + "/";

  const enviromnent = process.env.NODE_ENV;
  const basePath = (enviromnent === "production") ? baseUrl : "/";


  const schema = yup.object({
    date: yup.string().required("Selecione uma data válida"),
    time: yup.string().required("Selecione um horário válido.")

  });


  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  });


  useEffect(() => {

    const getAnnouncements = async () => {

      if (!id || currentAnnouncement) return

      const announcementDoc = doc(db, "announcement", id);
      const response = (await getDoc(announcementDoc)).data();
      setCurrentAnnouncement(response);

      setuserIsOwner(currentAnnouncement?.dono.split('/')[2] === userLogado.uid)
    }

    function checkUserHasPassword() {
      const providerData = userLogado.providerData;
      if (providerData.length === 1 && providerData[0].providerId === 'google.com') {
        navigate(basePath + "completeAccount");
      }
    }

    getAnnouncements();


    async function getFipeValue() {
      const marca = await loadMarca();
      const modelo = await loadModelo(marca[0]?.Value);
      const ano = await laodAnos(marca[0]?.Value, modelo.Value);
      const veiculo = await loadVeiculo(marca[0]?.Value, modelo.Value, ano.Value);

      setValorFipe(veiculo.Valor);
    }

    async function loadVeiculo(codMarca, codModelo, codAno) {


      const [anoModelo, codigoTipoCombustivel] = codAno.split("-");

      const form = new FormData();
      form.append("codigoTabelaReferencia", 287);
      form.append("codigoTipoVeiculo", 1);
      form.append("codigoMarca", codMarca);
      form.append("codigoModelo", codModelo);
      form.append("ano", codAno);
      form.append("anoModelo", anoModelo);
      form.append("codigoTipoCombustivel", codigoTipoCombustivel);
      form.append("tipoConsulta", "tradicional");

      const response = await fetch(`${fipeAPI}/ConsultarValorComTodosParametros`, {
        method: 'POST',
        body: form
      });

      const veiculo = await response.json();

      return veiculo;
    }

    async function laodAnos(codMarca, codModelo) {

      const form = new FormData();
      form.append("codigoTabelaReferencia", 287);
      form.append("codigoTipoVeiculo", 1);
      form.append("codigoMarca", codMarca);
      form.append("codigoModelo", codModelo);

      const response = await fetch(`${fipeAPI}/ConsultarAnoModelo`, {
        method: 'POST',
        body: form
      });

      const anos = await response.json();

      const anosFiltered = anos.filter((ano) => {
        return ano.Label.toLowerCase().includes(currentAnnouncement.anoModelo.toLowerCase())
      });


      return (anosFiltered.length === 0) ? anos[0] : anosFiltered[0];
    }


    async function loadModelo(codMarca) {

      const form = new FormData();
      form.append("codigoTabelaReferencia", 287);
      form.append("codigoTipoVeiculo", 1);
      form.append("codigoMarca", codMarca);

      const response = await fetch(`${fipeAPI}/ConsultarModelos`, {
        method: 'POST',
        body: form
      });
      const modelos = await response.json();


      const modelosFiltered = modelos?.Modelos?.filter((item) => {
        return item.Label.toLowerCase().includes(currentAnnouncement.modelo.toLowerCase());
      });

      return modelosFiltered[0];
    }

    async function loadMarca() {
      const form = new FormData();
      form.append("codigoTabelaReferencia", 287);
      form.append("codigoTipoVeiculo", 1);

      const response = await fetch(`${fipeAPI}/ConsultarMarcas`, {
        method: 'POST',
        body: form
      });
      const marcas = await response.json();

      const marcaAnuncio = marcas?.filter((marca) => {
        if (currentAnnouncement?.marca.toLowerCase() === "chevrolet") {
          return marca.Label.toLowerCase() === `gm - ${currentAnnouncement.marca.toLowerCase()}`;
        }

        return marca?.Label.toLowerCase() === currentAnnouncement?.marca.toLowerCase();
      });

      return marcaAnuncio;
    }

    getFipeValue();

    if (signed) {
      checkUserHasPassword();
    }
  }, [setCurrentAnnouncement, id, currentAnnouncement, setValorFipe, basePath, navigate, userLogado, signed]);

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
      dateTime: dateTime.getTime(),
      annoucement: id,
      approved: false,
      declined: false
    }

    await addDoc(collection(db, "testsDrive"), testDriveData);

    document.getElementById("btnCancel").click();
    document.getElementById("success").classList.remove("hidden");
    setValidateState("");
  }

  let linkChat;
  if (signed) {
    if (currentAnnouncement?.dono.split('/')[2] === userLogado.uid) {
      linkChat = <Link to={`${basePath}myNegociations`} className="btn btn-outline-secondary col-sm-12" type="button">Visualizar mensagens do anúncio.</Link>;
    } else {
      linkChat = <Link to={`${basePath}messageAnnouncement/${id}`} className="btn btn-outline-secondary col-sm-12" type="button">Enive uma mensagem ao vendedor!</Link>;

    }
  } else {
    linkChat = <Link to={basePath + "login"} className="btn btn-outline-secondary col-sm-12">Enive uma mensagem ao vendedor!</Link>;
  }

  return (
    <div className='root'>
      <Navbar current="comprar" />

      <div className="container">

        <Carousel images={currentAnnouncement?.images} title="Carro pika" />

        <div className="row align-items-md-stretch">
          <div className="col-md-8">
            <div className={`h-100 p-5 bg-${theme} ${(theme === "dark") ? "text-white" : ""} border rounded-3`}>
              <h2 >{`${currentAnnouncement?.marca} ${currentAnnouncement?.modelo}`}</h2>

              <ul className='list-group list-group-horizontal'>
                <li className={`list-group-item  ${(theme === "dark") ? "text-white" : ""}`}>
                  <h5>Ano:</h5>
                  <strong>{`${currentAnnouncement?.anoModelo}/${currentAnnouncement?.anoFabricacao}`}</strong>
                </li>

                <li className={`list-group-item  ${(theme === "dark") ? "text-white" : ""}`}>
                  <h5>Cor:</h5>
                  <strong>{currentAnnouncement?.cor}</strong>
                </li>

                <li className={`list-group-item  ${(theme === "dark") ? "text-white" : ""}`}>
                  <h5>Final da placa:</h5>
                  <strong>{currentAnnouncement?.placa.charAt(currentAnnouncement?.placa?.length - 1)}</strong>
                </li>

                <li className={`list-group-item  ${(theme === "dark") ? "text-white" : ""}`}>
                  <h5>Quilometragem:</h5>
                  <strong>{currentAnnouncement?.quilometragem}Km</strong>
                </li>

                <li className={`list-group-item  ${(theme === "dark") ? "text-white" : ""}`}>
                  <h5>Tipo de câmbio:</h5>
                  <strong>{currentAnnouncement?.tipoCambio}</strong>
                </li>
              </ul>

              <div className="row pt-3">
                <strong>Descrição do anúncio:</strong>
                <p>{currentAnnouncement?.descricao}</p>
              </div>

              <div className="row justify-content-between">
                <div className="col-sm-6">
                  <h3 className='pt-3'>Valor anunciado:</h3>
                  <h3> R$ {currentAnnouncement?.valor}</h3>
                </div>
                <div className="col-sm-6">
                  <h3 className='pt-3'>Valor da tabela Fipe: </h3>
                  <h3>{valorFipe}</h3>
                </div>
              </div>

            </div>
          </div>

          <div className="col-md-4">
            <div className={`h-100 p-5 bg-${theme} border rounded-3  ${(theme === "dark") ? "text-white" : ""} `}>

              <div className="pb-5">
                <h4>Gostou do veículo? Que tal agendar um test drive?</h4>
                {(signed) ?
                  (<button className="btn btn-outline-secondary col-sm-12" type="button" data-bs-toggle={userIsOwner ? "modal" : "#"} data-bs-target={userIsOwner ? "#modal" : "#"} >Clique aqui para agendar um test drive!</button>)
                  :
                  (<Link to={basePath + "login"} className="btn btn-outline-secondary col-sm-12">Clique aqui para agendar um test drive!</Link>)
                }
              </div>

              <div className="">

                <h4>Ou se preferir, mande uma mensagem ao vendedor!</h4>
                {linkChat}
              </div>
            </div>
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