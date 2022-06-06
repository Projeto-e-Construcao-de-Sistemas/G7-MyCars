import React, { useContext, useEffect, useState } from 'react';
import { AuthenticationContext } from '../../context/authenticationContext';
import { useNavigate } from 'react-router';
import { Sidebar } from '../../components/Sidebar';
import { Link } from 'react-router-dom';

import './profile.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot, faSave, faTrash, faUser } from '@fortawesome/free-solid-svg-icons';
import { auth, db } from '../../services/firebaseConfig';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';

export const Profile = () => {

    const { signed } = useContext(AuthenticationContext);
    const userLogado = JSON.parse(sessionStorage.getItem("@AuthFirebase:user"));

    const navigate = useNavigate();

    const [name, setName] = useState(userLogado.displayName);
    const [email] = useState(userLogado.email);
    const [phone, setPhone] = useState(null);
    const [birthday, setBirthday] = useState('dd/mm/aaaa');
    const [cpf, setCpf] = useState(null);

    const [cep, setCep] = useState(null);
    const [rua, setRua] = useState(null);
    const [complemento, setComplemento] = useState(null);
    const [bairro, setBairro] = useState(null);
    const [estado, setEstado] = useState(null);
    const [cidade, setCidade] = useState(null);

    function handleCep(e) {
        setCep(e.target.value);
    }
    function handleRua(e) {
        setRua(e.target.value);
    }
    function handleComplemento(e) {
        setComplemento(e.target.value);
    }
    function handleBairro(e) {
        setBairro(e.target.value);
    }
    function handleEstado(e) {
        setEstado(e.target.value);
    }
    function handleCidade(e) {
        setCidade(e.target.value);
    }

    function handleName(e) {
        setName(e.target.value);
    }

    function handlePhone(e) {
        setPhone(e.target.value);
    }

    function handleBirthday(e) {
        setBirthday(e.target.value);
    }

    function handleCpf(e) {
        setCpf(e.target.value);
    }

    async function updateUserData() {
        await setDoc(doc(db, "users", userLogado.uid), {
            phone,
            birthday,
            cpf
        });
        await updateProfile(auth.currentUser, { displayName: name });
        await updateAddress();
        sessionStorage.setItem("@AuthFirebase:user", JSON.stringify(auth.currentUser));
        navigate('/');
    }

    async function updateAddress() {
        if (!cep && !rua && !bairro && !estado && !cidade) {
            return;
        }

        await setDoc(doc(db, "address", userLogado.uid), {
            cep,
            rua,
            bairro,
            estado,
            cidade,
            complemento
        });

    }

    function checkCep(e) {
        const cep = e.target.value.replace(/\D/g, '');
        fetch(`https://viacep.com.br/ws/${cep}/json/`)
            .then(res => res.json()).then(data => {
                setRua(data.logradouro);
                setBairro(data.bairro);
                setCidade(data.localidade);
                setEstado(data.uf);

                document.querySelector('#complemento').focus();
            });
    }

    useEffect(() => {
        function checkUserHasPassword() {
            const providerData = userLogado.providerData;
            if (providerData.length === 1 && providerData[0].providerId === 'google.com') {
                navigate("/completeAccount");
            }
        }

        async function retrieveUserData() {
            const userDoc = doc(db, 'users', userLogado.uid);
            const userData = (await getDoc(userDoc)).data();
            if (phone === null) setPhone(userData.phone);
            if (birthday === 'dd/mm/aaaa') setBirthday(userData.birthday);
            if (cpf === null) setCpf(userData.cpf);

        }

        async function retrieveUserAddress() {
            const userAddressDoc = doc(db, 'address', userLogado.uid);
            const userAddress = (await getDoc(userAddressDoc)).data();

            if (cep === null) setCep(userAddress.cep);
            if (rua === null) setRua(userAddress.rua);
            if (complemento === null) setComplemento(userAddress.complemento);
            if (bairro === null) setBairro(userAddress.bairro);
            if (estado === null) setEstado(userAddress.estado);
            if (cidade === null) setCidade(userAddress.cidade);
        }

        if (signed) {
            checkUserHasPassword();
            retrieveUserData();
            retrieveUserAddress();
        } else {
            navigate('/');
        }
    }, [navigate, userLogado, phone, birthday, cpf, signed])


    return (
        <div className="root">
            <header className='navbar navbar-light sticky-top bg-light flex-md-nowrap p-0 shadow'>
                <Link to="/" className='navbar-brand col-md-3 col-lg-2 me-0 px-3 '>MyCars</Link>
                <div className="navbar-nav">
                    <div className="nav-item text-nowrap">
                        <Link to="/" className="nav-link px-3">{userLogado.displayName}</Link>
                    </div>
                </div>
            </header>
            <div className="container-fluid">
                <Sidebar />

                <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4 ">
                    <h2 className='h2 pt-4'>Minha conta</h2>
                    <hr />
                    <div className="row">
                        <div className="col-md-5" style={{ borderRight: '1px solid #ebebeb' }}>
                            <h3 className="h3">
                                <FontAwesomeIcon icon={faUser} /> Dados pessoais</h3>

                            <form className='form-signin w-100 m-auto text-center'>

                                <div className="form-floating">
                                    <input value={name} name="name" type="text" id="floatingInput1" className="form-control" placeholder='Name' onChange={handleName} />
                                    <label htmlFor="floatingInput1">Nome</label>
                                </div>

                                <div className="form-floating">
                                    <input value={email} name="email" type="email" disabled id="floatingInput1" className="form-control" placeholder='example@example.com' />
                                    <label htmlFor="floatingInput1">Endereço de e-mail</label>
                                </div>

                                <div className="form-floating">
                                    <input value={phone} name="phone" type="text" id="floatingInput7" className="form-control" placeholder='Telefone' onChange={handlePhone} />
                                    <label htmlFor="floatingInput7">Telefone</label>
                                </div>
                                <div className="form-floating">
                                    <input value={birthday} name="birthday" type="date" id="floatingInput8" className="form-control" placeholder='Data de nascimento' onChange={handleBirthday} />
                                    <label htmlFor="floatingInput8">Data de nascimento</label>
                                </div>
                                <div className="form-floating">
                                    <input value={cpf} name="cpf" type="text" id="floatingInput9" className="form-control" placeholder='CPF' onChange={handleCpf} />
                                    <label htmlFor="floatingInput9">CPF</label>
                                </div>

                            </form>
                        </div>
                        <div className="col-md-5">
                            <h3 className="h3">
                                <FontAwesomeIcon icon={faLocationDot} /> Endereço</h3>

                            <form className='form-signin w-100 m-auto text-center'>

                                <div className="form-floating">
                                    <input value={cep} type="text" id="floatingInput2" className="form-control" placeholder='CEP' onBlur={checkCep} onChange={handleCep} />
                                    <label htmlFor="floatingInput2">CEP</label>
                                </div>
                                <div className="form-floating">
                                    <input value={rua} type="text" id="floatingInput3" className="form-control" placeholder='Rua' onChange={handleRua} />
                                    <label htmlFor="floatingInput3">Rua</label>
                                </div>
                                <div className="form-floating">
                                    <input value={complemento} type="text" id="complemento" className="form-control" placeholder='Complemento' onChange={handleComplemento} />
                                    <label htmlFor="complemento">Complemento</label>
                                </div>
                                <div className="form-floating">
                                    <input value={bairro} type="text" id="floatingInput5" className="form-control" placeholder='Bairro' onChange={handleBairro} />
                                    <label htmlFor="floatingInput5">Bairro</label>
                                </div>
                                <div className="form-floating">
                                    <input value={estado} type="text" id="floatingInput7" className="form-control" placeholder='Estado' onChange={handleEstado} />
                                    <label htmlFor="floatingInput7">Estado</label>
                                </div>
                                <div className="form-floating">
                                    <input value={cidade} type="text" id="floatingInput6" className="form-control" placeholder='Cidade' onChange={handleCidade} />
                                    <label htmlFor="floatingInput6">Cidade</label>
                                </div>
                            </form>
                        </div>
                    </div>
                    <div className="container row d-flex justify-content-between pt-5">
                        <button onClick={updateUserData} type="button" className='btn btn-success col-md-4' style={{ marginTop: '15px' }}>
                            <FontAwesomeIcon icon={faSave} /> Salvar alterações</button>
                        <button  type="button" className='btn btn-danger col-md-3' style={{ marginTop: '15px' }}>
                            <FontAwesomeIcon icon={faTrash} /> Deletar minha conta</button>

                    </div>
                </main>
            </div>
        </div>
    )
}

export default Profile;