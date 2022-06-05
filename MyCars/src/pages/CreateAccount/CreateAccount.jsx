import React, { useContext, useState } from 'react'
import { Navigate } from 'react-router';
import Navbar from '../../components/Navbar';
import { AuthenticationContext } from '../../context/authenticationContext';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faG } from '@fortawesome/free-solid-svg-icons';

import './createAccount.css';

export const CreateAccount = () => {
    const { signed, createUserEmailPassword, signInGoogle } = useContext(AuthenticationContext);

    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [name, setName] = useState();

    async function loginGoogle() {
        await signInGoogle();
    }


    async function createUser() {
        await createUserEmailPassword(email, password, name);
    }

    if (signed) {
        return <Navigate to="/profile" />;
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
                            <input type="password" name="" className='form-control' id="floatingPassword4" placeholder='Password' onChange={(e) => { setPassword(e.target.value) }} />
                            <label htmlFor="floatingPassword4">Senha</label>
                        </div>
                        <button type="button" className="w-100 btn btn-lg btn-primary" onClick={createUser}>Criar minha conta</button>
                        <h4 className="h4 mb-3 fw-normal" style={{marginTop:'30px', marginBottom:'30px'}}>Ou cadastre-se com sua conta Google</h4>
                        <button type="button" className="w-100 btn btn-lg btn-outline-primary" onClick={loginGoogle}><FontAwesomeIcon icon={faG} /> Cadastrar com Google</button>
                    </form>
                </main>
            </div>
        </div>

    )
}
