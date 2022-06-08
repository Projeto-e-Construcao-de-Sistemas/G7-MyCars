import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Navbar } from '../../components/Navbar';
import { AuthenticationContext } from '../../context/authenticationContext';
import './completeAccount.css';

import { useForm, Controller } from 'react-hook-form';
import InputMask from "react-input-mask";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";

export const CompleteAccount = () => {
    const { linkCredentials, signed } = useContext(AuthenticationContext);
    const navigate = useNavigate();

    const schema = yup.object({
        name: yup.string().required("Por favor, preencha o campo nome."),
        email: yup.string().email('Digite um e-mail válido').required('Por favor, preencha o campo e-mail.'),
        phone: yup.string().required('Por favor, digite um telefone válido com DDD.'),
        birthday: yup.string().required('Por favor preencha a data de nascimento.'),
        cpf: yup.string().required('Por favor preencha o CPF.'),
        password: yup.string().min(6, "A senha digitada precisa ter pelo menos 6 caracteres").required('Por favor digite uma senha.')
    });

    const { register, handleSubmit, setValue, control, formState: { errors } } = useForm({
        resolver: yupResolver(schema)
    });

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
            setValue("email", user.email);
            setValue("name", user.displayName);
        }

        if (signed) {
            checkUserHasPassword();
            completeFields();
        } else {
            navigate('/');
        }

    }, [navigate, signed, setValue]);

    async function onSubmit(user) {
        const { password, name, phone, birthday, cpf } = user;
        linkCredentials(password, name, phone, birthday, cpf).then(() => {
            navigate("/");
        });
    }

    return (
        <div className="root">
            <Navbar current="createAccount" />
            <div className="body login">
                <main className='form-signin w-100 m-auto text-center card'>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <h1 className="h3 mb-3 fw-normal">Só mais um passo!</h1>
                        <h1 className="h3 mb-3 fw-normal">Precisamos completar o seu cadastro!</h1>
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
                        <div className="form-floating">
                            <input type="password" name="password" minLength="6" className='form-control' id="password" placeholder='Password' {...register('password')} />
                            <label htmlFor="password">Senha</label>
                            <p className='error-message'>{errors.password?.message}</p>
                        </div>
                        <button type="submit" className="w-100 btn btn-lg btn-primary">Completar cadstro</button>
                    </form>
                </main>
            </div>
        </div>

    )
}
