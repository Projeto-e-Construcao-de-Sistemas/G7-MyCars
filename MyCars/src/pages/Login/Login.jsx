import React, { useContext, useState } from 'react'
import { Navigate } from 'react-router';
import { Navbar } from '../../components/Navbar';
import { AuthenticationContext } from '../../context/authenticationContext';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faG } from '@fortawesome/free-solid-svg-icons';

import './login.css';
import { Link } from 'react-router-dom';

export const Login = () => {
    const { signInGoogle, signed, signInEmailPassword } = useContext(AuthenticationContext);

    const [email, setEmail] = useState();
    const [password, setPassword] = useState();

    async function loginGoogle() {
        await signInGoogle();
    }

    async function loginEmailPassword() {
        const success = await signInEmailPassword(email, password);
        if (!success) {
            document.querySelector('.alert').classList.remove('hidden');
        }
    }

    const baseUrl = process.env.PUBLIC_URL + "/";
    const enviromnent = process.env.NODE_ENV;
    const basePath = (enviromnent === "production") ? baseUrl : "/";

    if (signed) {
        return <Navigate to={basePath} />;
    }

    return (
        <div className="root">
            <Navbar current="login" />
            <div className="body login">

                <main className='form-signin w-100 m-auto text-center card'>
                    <form className='formLogin'>
                        <h1 className="h3 mb-3 fw-normal">Digite o seu e-mail e senha</h1>

                        <div className="alert alert-danger hidden">
                            Usuário ou senha incorreto
                        </div>

                        <div className="form-floating">
                            <input type="email" id="floatingInput1" className="form-control" placeholder='name@example.com' onChange={(e) => { setEmail(e.target.value) }} />
                            <label htmlFor="floatingInput1">Endereço de email</label>
                        </div>

                        <div className="form-floating">
                            <input type="password" name="" className='form-control' id="floatingPassword" placeholder='Password' onChange={(e) => { setPassword(e.target.value) }} />
                            <label htmlFor="floatingPassword">Senha</label>
                        </div>
                        <button className="w-100 btn btn-lg btn-primary" type='button' onClick={loginEmailPassword} >Entrar</button>
                        <h4 className="h4 mb-3 fw-normal" style={{ marginTop: '30px', marginBottom: '30px' }}>Ou entre com sua conta Google</h4>
                        <button type="button" className="w-100 btn btn-lg btn-outline-primary" onClick={loginGoogle}><FontAwesomeIcon icon={faG} /> Entrar com Google</button>
                    </form>
                    <Link to={basePath + "createAccount"} className='nav-link'>Não tem uma conta? Cadastre-se gratuitamente!</Link>
                </main>
            </div>
        </div>

    )
}
