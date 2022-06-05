import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router';
import { Navbar } from '../../components/Navbar';
import { AuthenticationContext } from '../../context/authenticationContext';
import './completeAccount.css';

export const CompleteAccount = () => {
    const { linkCredentials, signed } = useContext(AuthenticationContext);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");

    const navigate = useNavigate();

    function checkUserHasPassword() {
        const user = JSON.parse(sessionStorage.getItem("@AuthFirebase:user"));
        const providerData = user.providerData;
        if (providerData.length === 2) {
            window.location.href = "/profile";
        }
    }

    useEffect(() => {

        function completeFields() {
            const user = JSON.parse(sessionStorage.getItem("@AuthFirebase:user"));
            setEmail(user.email);
            setName(user.displayName);
        }

        if (signed) {
            checkUserHasPassword();
            completeFields();
        }else{
            navigate('/');
        }

    }, [navigate]);


    async function completeAccount() {
        linkCredentials(password, name).then(() => {
            navigate("/");
        });
    }

    return (
        <div className="root">
            <Navbar current="createAccount" />
            <div className="body login">
                <main className='form-signin w-100 m-auto text-center card'>
                    <form >
                        <h1 className="h3 mb-3 fw-normal">Só mais um passo!</h1>
                        <h1 className="h3 mb-3 fw-normal">Precisamos completar o seu cadastro!</h1>
                        <div className="form-floating">
                            <input value={name || ''} type="text" id="floatingInput1" className="form-control" placeholder='Name' onChange={(e) => { setName(e.target.value) }} />
                            <label htmlFor="floatingInput1">Nome</label>
                        </div>

                        <div className="form-floating">
                            <input value={email || ''} type="email" id="floatingInput2" className="form-control" disabled placeholder='name@example.com' onChange={(e) => { setEmail(e.target.value) }} />
                            <label htmlFor="floatingInput2">Endereço de e-mail</label>
                        </div>

                        <div className="form-floating">
                            <input type="password" name="" className='form-control' id="floatingPassword" placeholder='Password' onChange={(e) => { setPassword(e.target.value) }} />
                            <label htmlFor="floatingPassword">Senha</label>
                        </div>
                        <button type="button" className="w-100 btn btn-lg btn-primary" onClick={completeAccount}>Completar cadstro</button>
                    </form>
                </main>
            </div>
        </div>

    )
}
