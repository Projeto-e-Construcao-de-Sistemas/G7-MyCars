import React, { useContext, useState } from 'react'
import { Navigate } from 'react-router';
import { Navbar } from '../../components/Navbar';
import { AuthenticationContext } from '../../context/authenticationContext';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faG } from '@fortawesome/free-solid-svg-icons';

import './createAccount.css';

export const CreateAccount = () => {
    const { signed, createUserEmailPassword, signInGoogle } = useContext(AuthenticationContext);

    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [name, setName] = useState();
    const [phone, setPhone] = useState();
    const [birthday, setBirthday] = useState();
    const [cpf, setCpf] = useState();

    async function loginGoogle() {
        await signInGoogle();
    }

    async function createUser() {
        await createUserEmailPassword(email, password, name, phone, birthday, cpf);
    }

    if (signed) {
        return <Navigate to="/" />;
    }

    return (
        <div className="root">
            <Navbar current="createAccount" />
            <div className="body login ">
                <main className='form-signin w-100 m-auto text-center card'>
                    <form >
                        <h1 className="h3 mb-3 fw-normal">Cadastre-se gratuitamente!</h1>

                        <div className="form-floating">
                            <input type="text" id="floatingInput" className="form-control" placeholder='Name' onChange={(e) => { setName(e.target.value) }} />
                            <label htmlFor="floatingInput">Nome</label>
                        </div>

                        <div className="form-floating">
                            <input type="email" id="floatingInput3" className="form-control" placeholder='name@example.com' onChange={(e) => { setEmail(e.target.value) }} />
                            <label htmlFor="floatingInpu3t">Endereço de e-mail</label>
                        </div>

                        <div className="form-floating">
                            <input type="text" id="floatingInput7" className="form-control" placeholder='Telefone' onChange={(e) => { setPhone(e.target.value) }} />
                            <label htmlFor="floatingInput7">Telefone</label>
                        </div>
                        <div className="form-floating">
                            <input type="date" id="floatingInput8" className="form-control" placeholder='Data de nascimento' onChange={(e) => { setBirthday(e.target.value) }} />
                            <label htmlFor="floatingInput8">Data de nascimento</label>
                        </div>
                        <div className="form-floating">
                            <input type="text" id="floatingInput9" className="form-control" placeholder='CPF' onChange={(e) => { setCpf(e.target.value) }} />
                            <label htmlFor="floatingInput9">CPF</label>
                        </div>
                        <div className="form-floating">
                            <input type="password" name="" minLength="6" className='form-control' id="floatingPassword4" placeholder='Password' onChange={(e) => { setPassword(e.target.value) }} />
                            <label htmlFor="floatingPassword4">Senha</label>
                        </div>
                        <button type="button" className="w-100 btn btn-lg btn-primary" onClick={createUser}>Criar minha conta</button>
                        <h4 className="h4 mb-3 fw-normal" style={{ marginTop: '30px', marginBottom: '30px' }}>Ou cadastre-se com sua conta Google</h4>
                        <button type="button" className="w-100 btn btn-lg btn-outline-primary" onClick={loginGoogle}><FontAwesomeIcon icon={faG} /> Cadastrar com Google</button>
                    </form>
                </main>
            </div>
        </div>

    )
}
