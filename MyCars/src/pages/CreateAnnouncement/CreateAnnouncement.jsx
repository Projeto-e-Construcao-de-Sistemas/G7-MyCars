import React, { useContext, useEffect, useState } from 'react';
import { AuthenticationContext } from '../../context/authenticationContext';
import { useNavigate } from 'react-router';
import { Sidebar } from '../../components/Sidebar';
import { Link } from 'react-router-dom';

import './CreateAnnouncement.css';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../services/firebaseConfig';

import { carTypes } from "./carTypes";

import { useForm, Controller } from 'react-hook-form';
import InputMask from "react-input-mask";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { ImageInput } from '../../components/ImageInput/ImageInput';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

export const CreateAnnouncement = () => {

    const { signed } = useContext(AuthenticationContext);
    const userLogado = JSON.parse(sessionStorage.getItem("@AuthFirebase:user"));

    const baseUrl = process.env.PUBLIC_URL + "/";
    const enviromnent = process.env.NODE_ENV;
    const basePath = (enviromnent === "production") ? baseUrl : "/";

    const navigate = useNavigate();

    const [notAddress, setNotAddress] = useState(false);
    const [carTypesFiltered, setCarTypesFiltered] = useState([]);
    const [imageCount, setImageCount] = useState(0);

    const schema = yup.object({
        // anoModelo: yup.number().required("Por favor preencha o ano do modelo"),
        // anoFabricacao: yup.number().required("Por favor preencha o ano de fabricação")
    });

    const { register, handleSubmit, setValue, setFocus, control, formState: { errors } } = useForm({
        resolver: yupResolver(schema)
    });

    function onChangeMarca(e) {
        const selectedOption = e.target.value;
        setCarTypesFiltered(carTypes.filter(carType => carType.marca === selectedOption));
    }

    function onModeloChange(e) {
        document.querySelector("#otherInfos").classList.remove("hidden");
    }
    
    function onSubmit(announcement) {
        console.log(announcement);
    }

    useEffect(() => {
        function checkUserHasPassword() {
            const providerData = userLogado.providerData;
            if (providerData.length === 1 && providerData[0].providerId === 'google.com') {
                navigate(basePath + "completeAccount");
            }
        }

        async function retrieveUserAddress() {
            const userAddressDoc = doc(db, 'address', userLogado.uid);
            const userAddress = (await getDoc(userAddressDoc)).data();

            if (!userAddress) setNotAddress(true);

        }

        if (signed) {
            checkUserHasPassword();
            retrieveUserAddress();

        } else {
            navigate(basePath);
        }
    }, [navigate, userLogado, signed, basePath])


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
            <div className="container-fluid" style={{paddingBottom: "10rem"}}>
                <Sidebar current={"createAnnouncement"} />

                <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4" >
                    <h2 className='h2 pt-4'>Criar um anúncio</h2>
                    <hr />

                    <div className="container d-flex justify-content-center">
                        {notAddress ? (
                            <div className="alert alert-danger col-sm-6 d-flex justify-content-between">
                                <div>
                                    <h4 className="alert-heading">Parece que você não possui endereço cadastrado!</h4>
                                    <p>Usuários sem endereço não podem criar anúncios.</p>
                                    <Link to={basePath + "profile"} className="alert-link">Clique aqui para adicionar um endereço</Link>
                                </div>
                            </div>
                        ) : <></>}
                    </div>

                    <form className='container col-sm-8' onSubmit={handleSubmit(onSubmit)}>
                        <div className="container">


                            <div className="row">
                                <label htmlFor="marca" className='form-label'>Marca:</label>
                                <select name="marca" className='form-select' disabled={notAddress} onChange={onChangeMarca}>
                                    <option value="">Escolha uma marca</option>
                                    {carTypes.map((carType) => {
                                        return <option value={carType.marca}>{carType.marca}</option>
                                    })}
                                </select>
                                {/* <p className='error-message'>{errors.name?.message}</p> */}
                            </div>

                            {carTypesFiltered.length != 0 ? (
                                <div className="row">
                                    <label htmlFor="modelo" className='form-label'>Modelo:</label>
                                    <select name="modelo" className='form-select' onChange={onModeloChange}>
                                        <option value="">Escolha um modelo</option>
                                        {carTypesFiltered[0].modelos.map((carTypeFiltered) => {
                                            return <option value={carTypeFiltered}>{carTypeFiltered}</option>
                                        })}
                                    </select>
                                    {/* <p className='error-message'>{errors.name?.message}</p> */}
                                </div>
                            ) : <></>}
                        </div>
                        <div id="otherInfos" className="hidden pt-3">

                            <div className="row">
                                <div className="form-floating col-sm-6">
                                    <input type="text" pattern='[0-9]+' maxLength="4" id="anoModelo" name="anoModelo" className="form-control" placeholder='Ano do modelo' {...register("anoModelo")} />
                                    <label htmlFor="anoModelo">Ano do modelo</label>
                                    <p className='error-message'>{errors.name?.message}</p>
                                </div>
                                <div className="form-floating col-sm-6">
                                    <input type="text" maxLength={4} pattern='[0-9]+' id="anoFabricacao" name="anoFabricacao" className="form-control" placeholder='Ano de fabricação' {...register("anoFabricacao")} />
                                    <label htmlFor="anoFabricacao">Ano de fabricação</label>
                                    <p className='error-message'>{errors.name?.message}</p>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-sm-6">
                                    <label htmlFor="valor">Valor:</label>
                                    <div className="input-group">
                                        <span className="input-group-text" id="basic-addon1">R$</span>
                                        <input aria-describedby="basic-addon1" type="double" id="valor" name="valor" className="form-control col-sm-6" placeholder='Valor' {...register("valor")} />
                                    </div>
                                    <p className='error-message'>{errors.name?.message}</p>
                                </div>

                                <div className="col-sm-6">
                                    <label htmlFor="quilometragem">Quilometragem:</label>
                                    <div className="input-group col-sm-6">
                                        <input aria-describedby="basic-addon2" type="double" id="quilometragem" name="quilometragem" className="form-control" placeholder='Quilometragem' {...register("quilometragem")} />
                                        <span className="input-group-text" id="basic-addon2">Km</span>
                                        <p className='error-message'>{errors.name?.message}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-sm-6">
                                    <label htmlFor="tipoCambio">Tipo de Câmbio</label>
                                    <select name="tipoCambio" className='form-select' {...register("tipoCambio")}>
                                        <option value="">Selecione o tipo de Câmbio</option>
                                        <option value="manual">Manual</option>
                                        <option value="automatico">Automático</option>
                                        <option value="automatizado">Automatizado</option>
                                    </select>
                                </div>
                                <div className="col-sm-6">
                                    <label htmlFor="tipoVeiculo">Tipo do veículo</label>
                                    <select name="tipoVeiculo" className='form-select' {...register("tipoVeiculo")}>
                                        <option value="">Selecione o tipo do veículo</option>
                                        <option value="novo">Novo</option>
                                        <option value="seminovo">Seminovo</option>
                                        <option value="usado">Usado</option>
                                    </select>
                                </div>
                            </div>

                            <div className="row pt-3">
                                <div className="form-floating col-sm-4">
                                    <input type="text" id="cor" name="cor" className="form-control" placeholder='cor' {...register("cor")} />
                                    <label htmlFor="cor">Cor</label>
                                    <p className='error-message'>{errors.name?.message}</p>
                                </div>

                                <div className="form-floating col-sm-4">
                                    <input type="text" maxLength="7" id="placa" name="placa" className="form-control" placeholder='placa' {...register("placa")} />
                                    <label htmlFor="placa">Placa</label>
                                    <p className='error-message'>{errors.name?.message}</p>
                                </div>

                                <div className="form-floating col-sm-4">
                                    <input type="number" id="limiteTestDrive" name="limiteTestDrive" className="form-control" placeholder='limiteTestDrive' {...register("limiteTestDrive")} />
                                    <label htmlFor="limiteTestDrive">Limite de tests Drive</label>
                                    <p className='error-message'>{errors.name?.message}</p>
                                </div>
                            </div>

                            <div className="row">
                                <label htmlFor="descricao">Descrição:</label>
                                <textarea id="descricao" rows="5" name="descricao" className="form-control" placeholder='Escreva uma descrição do seu anúncio' {...register("descricao")} >
                                </textarea>
                                <p className='error-message'>{errors.name?.message}</p>
                            </div>

                            <div className="row">
                                <h4>Insira ao menos uma imagem do veículo</h4>
                                <div className="container">
                                    <div className="row">
                                        {(()=>{
                                            const images = [];
                                            for(let i = 0; i<= imageCount; i++){
                                                images.push(<ImageInput key={i} isFirst={(i==0)} setImageCount={setImageCount} imageCount={imageCount} index={i} register={register}/>);
                                            }

                                            return images;
                                        })()}
                                        <FontAwesomeIcon icon={faPlus} className="imgAdd" onClick={()=>setImageCount(imageCount+1)}/>
                                    </div>
                                </div>
                                <button type="submit" className='btn btn-success col-sm-12'>Criar anúncio</button>
                            </div>
                        </div>
                    </form>

                </main>
            </div>
        </div>
    )
}

export default CreateAnnouncement;