import React, { useContext, useEffect } from 'react';
import { AuthenticationContext } from '../../context/authenticationContext';
import { useNavigate } from 'react-router';
import { Sidebar } from '../../components/Sidebar';
import { Link } from 'react-router-dom';

import './profile.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLocationDot, faSave, faTrash, faUser } from '@fortawesome/free-solid-svg-icons';
import { auth, db } from '../../services/firebaseConfig';
import { deleteDoc, doc, getDoc, setDoc } from 'firebase/firestore';
import { deleteUser, updateProfile } from 'firebase/auth';
import { Modal } from '../../components/Modal';

import { useForm, Controller } from 'react-hook-form';
import InputMask from "react-input-mask";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";

export const Profile = () => {

    const { signed, signOutFromApp } = useContext(AuthenticationContext);
    const userLogado = JSON.parse(sessionStorage.getItem("@AuthFirebase:user"));

    const baseUrl = process.env.PUBLIC_URL + "/";
    const enviromnent = process.env.NODE_ENV;
    const basePath = (enviromnent === "production") ? baseUrl : "/";

    const navigate = useNavigate();

    const schema = yup.object({
        name: yup.string().required("Por favor, preencha o campo nome."),
        email: yup.string().email('Digite um e-mail válido').required('Por favor, preencha o campo e-mail.'),
        phone: yup.string().required('Por favor, digite um telefone válido com DDD.'),
        birthday: yup.string().required('Por favor preencha a data de nascimento.'),
        cpf: yup.string().required('Por favor preencha o CPF.')
    });

    const { register, handleSubmit, setValue, setFocus, control, formState: { errors } } = useForm({
        resolver: yupResolver(schema)
    });

    async function onSubmit(userData) {
        const loadingBtn = document.querySelector("#loading");
        loadingBtn.classList.remove('hidden');
        loadingBtn.parentElement.setAttribute("disabled", "disabled");

        const { name, phone, birthday, cpf, cep, rua, bairro, estado, cidade, complemento } = userData;
        await setDoc(doc(db, "users", userLogado.uid), {
            phone,
            birthday,
            cpf
        });
        await updateProfile(auth.currentUser, { displayName: name });

        await updateAddress(cep, rua, bairro, estado, cidade, complemento);
        sessionStorage.setItem("@AuthFirebase:user", JSON.stringify(auth.currentUser));
        document.querySelector('.alert').classList.remove('hidden');

        loadingBtn.classList.add('hidden');
        loadingBtn.parentElement.removeAttribute("disabled", "disabled");
    }

    async function updateAddress(cep, rua, bairro, estado, cidade, complemento) {
        if (cep === "" && rua === "" && bairro === "" && estado === "" && cidade === "") {
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

    async function deleteUserData() {
        try {
            await deleteUser(auth.currentUser);
        } catch (err) {
            alert('Você precisa realizar login novamente para executar essa ação.');
            return signOutFromApp();
        }

        await deleteDoc(doc(db, "address", userLogado.uid));
        await deleteDoc(doc(db, "users", userLogado.uid));
        signOutFromApp();
        navigate(basePath + "login");
    }

    function checkCep(e) {

        const cep = e.target.value.replace(/\D/g, '');
        fetch(`https://viacep.com.br/ws/${cep}/json/`)
            .then(res => res.json()).then(data => {
                setValue("rua", data.logradouro);
                setValue("bairro", data.bairro);
                setValue("cidade", data.localidade);
                setValue("estado", data.uf);

                setFocus("complemento");
            });
    }

    useEffect(() => {
        function checkUserHasPassword() {
            const providerData = userLogado.providerData;
            if (providerData.length === 1 && providerData[0].providerId === 'google.com') {
                navigate(basePath + "completeAccount");
            }
        }

        async function retrieveUserData() {

            const userDoc = doc(db, 'users', userLogado.uid);
            const userData = (await getDoc(userDoc)).data();
            setValue("name", userLogado.displayName);
            setValue("email", userLogado.email);
            setValue("birthday", userData.birthday);
            setValue("cpf", userData.cpf);
            setValue("phone", userData.phone);
        }

        async function retrieveUserAddress() {
            const userAddressDoc = doc(db, 'address', userLogado.uid);
            const userAddress = (await getDoc(userAddressDoc)).data();

            if (userAddress) {
                setValue("cep", userAddress.cep);
                setValue("rua", userAddress.rua);
                setValue("complemento", userAddress.complemento);
                setValue("bairro", userAddress.bairro);
                setValue("estado", userAddress.estado);
                setValue("cidade", userAddress.cidade);
            }
        }

        if (signed) {
            checkUserHasPassword();
            retrieveUserData();
            retrieveUserAddress();
        } else {
            navigate(basePath);
        }
    }, [navigate, userLogado, signed, setValue, basePath])


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

                <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4 ">
                    <h2 className='h2 pt-4'>Minha conta</h2>
                    <hr />

                    <div className="alert alert-success col-sm-3 d-flex justify-content-between hidden">
                        <strong>Informações salvas com sucesso!</strong>
                        <button type="button" className="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="row">
                            <div className="col-md-5" style={{ borderRight: '1px solid #ebebeb' }}>
                                <h3 className="h3">
                                    <FontAwesomeIcon icon={faUser} /> Dados pessoais</h3>

                                <div className='form-signin w-100 m-auto text-center'>

                                    <div className="form-floating">
                                        <input type="text" id="name" name='name' className="form-control"  {...register('name')} />
                                        <label htmlFor="name">Nome</label>
                                        <p className='error-message'>{errors.name?.message}</p>
                                    </div>

                                    <div className="form-floating">
                                        <input type="email" name="email" id="email" className="form-control" disabled {...register('email')} />
                                        <label htmlFor="email">Endereço de e-mail</label>
                                        <p className='error-message'>{errors.email?.message}</p>
                                    </div>

                                    <div className="form-floating">
                                        <Controller
                                            name="phone"
                                            control={control}
                                            defaultValue=""
                                            rules={{
                                                required: true,
                                            }}
                                            id="phone"
                                            className="form-control"
                                            render={({ field }) => (
                                                <InputMask
                                                    mask="(99)99999-9999"
                                                    maskChar="_"
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                >
                                                    {(inputProps) => (
                                                        <input
                                                            className="form-control"
                                                            {...inputProps}
                                                            type="text"
                                                        />
                                                    )}
                                                </InputMask>
                                            )}
                                        />
                                        <label htmlFor="phone">Telefone com DDD</label>
                                        <p className='error-message'>{errors.phone?.message}</p>

                                    </div>
                                    <div className="form-floating">
                                        <input type="date" id="birthday" name="birthday" className="form-control" placeholder='Data de nascimento' max="2999-12-31" {...register('birthday')} />
                                        <label htmlFor="birthday">Data de nascimento</label>
                                        <p className='error-message'>{errors.birthday?.message}</p>
                                    </div>
                                    <div className="form-floating">
                                        <Controller
                                            name="cpf"
                                            control={control}
                                            defaultValue=""
                                            rules={{
                                                required: true,
                                            }}
                                            id="cpf"
                                            className="form-control"
                                            render={({ field }) => (
                                                <InputMask
                                                    mask="999.999.999-99"
                                                    maskChar="_"
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                >
                                                    {(inputProps) => (
                                                        <input
                                                            className="form-control"
                                                            {...inputProps}
                                                            type="text"
                                                        />
                                                    )}
                                                </InputMask>
                                            )}
                                        />
                                        <label htmlFor="cpf">CPF</label>
                                        <p className='error-message'>{errors.cpf?.message}</p>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-5">
                                <h3 className="h3">
                                    <FontAwesomeIcon icon={faLocationDot} /> Endereço</h3>

                                <div className='form-signin w-100 m-auto text-center'>

                                    <div className="form-floating">
                                        <input type="text" id="cep" name="cep" className="form-control" placeholder='CEP'{...register("cep")} onBlur={checkCep} />
                                        <label htmlFor="cep">CEP</label>
                                    </div>
                                    <div className="form-floating">
                                        <input type="text" id="rua" name="rua" className="form-control" placeholder='Rua'{...register("rua")} />
                                        <label htmlFor="rua">Rua</label>
                                    </div>
                                    <div className="form-floating">
                                        <input type="text" id="complemento" name="complemento" className="form-control" placeholder='Complemento' {...register("complemento")} />
                                        <label htmlFor="complemento">Complemento</label>
                                    </div>
                                    <div className="form-floating">
                                        <input type="text" id="bairro" name="bairro" className="form-control" placeholder='Bairro' {...register("bairro")} />
                                        <label htmlFor="bairro">Bairro</label>
                                    </div>
                                    <div className="form-floating">
                                        <input type="text" id="estado" name="estado" className="form-control" placeholder='Estado' {...register("estado")} />
                                        <label htmlFor="estado">Estado</label>
                                    </div>
                                    <div className="form-floating">
                                        <input type="text" id="cidade" name="cidade" className="form-control" placeholder='Cidade' {...register("cidade")} />
                                        <label htmlFor="cidade">Cidade</label>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="container row d-flex justify-content-between pt-5">
                            <button type="submit" className='btn btn-success col-md-4' style={{ marginTop: '15px' }}>
                                <span className="spinner-border spinner-border-sm hidden" id="loading" role="status" aria-hidden="true" style={{ marginRight: '15px' }}> </span>
                                <FontAwesomeIcon icon={faSave} style={{ marginRight: '5px' }} />
                                Salvar alterações
                            </button>
                            <button data-bs-toggle="modal" data-bs-target="#modal" type="button" className='btn btn-danger col-md-3' style={{ marginTop: '15px' }}>
                                <FontAwesomeIcon icon={faTrash} /> Deletar meu perfil</button>
                        </div>
                    </form>
                    <Modal
                        title={"Tem certeza que deseja excluir o seu perfil?"}
                        textBody={"Essa ação não poderá ser desfeita!"}
                        confirmText={"Sim! Excluir meu perfil!"}
                        cancelText={"Não! Cancelar"}
                        onConfirm={deleteUserData}
                    />
                </main>
            </div>
        </div>
    )
}

export default Profile;