import React, { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router';
import { AuthenticationContext } from '../../context/authenticationContext';
import './completeAccount.css';

export const CompleteAccount = () => {
    const { linkCredentials } = useContext(AuthenticationContext);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState();

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

        checkUserHasPassword();

        completeFields();
    }, []);


    async function completeAccount() {
        linkCredentials(password, name).then(() => {
            navigate("/profile");
        });
    }

    return (
        <div className="body login">
            <main className='form-signin w-100 m-auto text-center'>
                <form >
                    <h1 className="h3 mb-3 fw-normal">Complete your registration!</h1>
                    <div className="form-floating">
                        <input value={name || ''} type="text" id="floatingInput1" className="form-control" placeholder='Name' onChange={(e) => { setName(e.target.value) }} />
                        <label htmlFor="floatingInput1">Name</label>
                    </div>

                    <div className="form-floating">
                        <input value={email || ''} type="email" id="floatingInput2" className="form-control" disabled placeholder='name@example.com' onChange={(e) => { setEmail(e.target.value) }} />
                        <label htmlFor="floatingInput2">Email address</label>
                    </div>

                    <div className="form-floating">
                        <input type="password" name="" className='form-control' id="floatingPassword" placeholder='Password' onChange={(e) => { setPassword(e.target.value) }} />
                        <label htmlFor="floatingPassword">Password</label>
                    </div>
                    <button type="button" className="w-100 btn btn-lg btn-primary" onClick={completeAccount}>Complete registration</button>
                </form>
            </main>
        </div>
    )
}
