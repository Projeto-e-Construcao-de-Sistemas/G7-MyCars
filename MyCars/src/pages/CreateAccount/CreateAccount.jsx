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

    function validatePassword() {
        if(password){
            if(password.length < 6){
                window.alert("A senha precisa possuir no mínimo 6 digitos");
                return false
            }
        }
        return false
    }

    function validateCPF(){
        console.log("cpf")
        let bool = true
        let cpfV = cpf.replace(/[^\d]+/g,'')	
	    if(cpfV === '') bool = false	
        if(cpfV.length < 11) bool = false
        if( cpfV === "00000000000" || 
            cpfV === "11111111111" || 
            cpfV === "22222222222" || 
            cpfV === "33333333333" || 
            cpfV === "44444444444" || 
            cpfV === "55555555555" || 
            cpfV === "66666666666" || 
            cpfV === "77777777777" || 
            cpfV === "88888888888" || 
            cpfV=== "99999999999") bool = false
        //algoritmo de validação de cpf
        var add;
        var rev;
        add = 0;
        if (cpfV === "00000000000") bool = false;
        for (let i=1; i<=9; i++) add = add + parseInt(cpfV.substring(i-1, i)) * (11 - i);
        rev = (add * 10) % 11;

            if ((rev === 10) || (rev === 11))  rev = 0;
            if (rev !== parseInt(cpfV.substring(9, 10)) ) bool = false;

        add = 0;
            for (let i = 1; i <= 10; i++) add = add + parseInt(cpfV.substring(i-1, i)) * (12 - i);
            rev = (add * 10) % 11;

            if ((rev === 10) || (rev === 11))  rev = 0;
            if (rev !== parseInt(cpfV.substring(10, 11) ) ) bool = false;
            if(bool === false){
                window.alert("CPF inválido")
                return false
            }
            return true
    }

    function validateBirthday(){
        let date = new Date()
        let year = date.getFullYear()
        let bday = birthday.split("-")
        console.log(bday, year)
        if(bday[0] > year-18){
            console.log("false")
            return false
        }
        console.log("true")
    }

    async function createUser() {       
        if(validateBirthday()){
            await createUserEmailPassword(email, password, name, phone, birthday, cpf);
        }
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
                            <input type="text" id="floatingInput7" className="form-control" placeholder='Telefone' maxLength="11" onChange={(e) => { setPhone(e.target.value) }} />
                            <label htmlFor="floatingInput7">Telefone com DDD</label>
                        </div>
                        <div className="form-floating">
                            <input type="date" id="floatingInput8" className="form-control" placeholder='Data de nascimento' max="2999-12-31" onChange={(e) => { setBirthday(e.target.value) }} />
                            <label htmlFor="floatingInput8">Data de nascimento</label>
                        </div>
                        <div className="form-floating">
                            <input type="text" id="floatingInput9" className="form-control" placeholder='CPF' maxLength="11" onChange={(e) => { setCpf(e.target.value) }} />
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
