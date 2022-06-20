import { createContext, useEffect, useState } from "react";
import {
    signInWithPopup,
    signOut,
    GoogleAuthProvider,
    EmailAuthProvider,
    linkWithCredential,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    updateProfile
} from "firebase/auth";

import { auth, db } from "../services/firebaseConfig";
import { Navigate } from "react-router-dom";
import { doc, setDoc } from "firebase/firestore";

const provider = new GoogleAuthProvider();

export const AuthenticationContext = createContext({});

export const AuthenticationProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const baseUrl = process.env.PUBLIC_URL + "/";
    const enviromnent = process.env.NODE_ENV;
    const basePath = (enviromnent === "production") ? baseUrl : "/";

    useEffect(() => {
        const loadStoreAuth = () => {
            const sessionToken = sessionStorage.getItem("@AuthFirebase:token");
            const sessionUser = sessionStorage.getItem("@AuthFirebase:user");

            if (sessionToken && sessionUser) {
                setUser(sessionUser);
            }
        };

        loadStoreAuth();
    });

    const signInGoogle = () => {
        signInWithPopup(auth, provider)
            .then((result) => {
                // This gives you a Google Access Token. You can use it to access the Google API.
                const credential = GoogleAuthProvider.credentialFromResult(result);
                const token = credential.accessToken;
                // The signed-in user info.
                const user = result.user;

                setUser(user);

                sessionStorage.setItem("@AuthFirebase:token", token);
                sessionStorage.setItem("@AuthFirebase:user", JSON.stringify(user));
            }).catch((error) => {
                console.log(error);
            });
    }

    const createUserEmailPassword = async (email, password, name, phone, birthday, cpf) => {
        try {
            const credential = await createUserWithEmailAndPassword(auth, email, password);
            const token = credential.token;
            const user = credential.user;

            updateProfile(auth.currentUser, { displayName: name }).then(() => {
                setUser(user);

                createUserData(phone, birthday, cpf, credential.user.uid).then(() => {
                    sessionStorage.setItem("@AuthFirebase:token", token);
                    sessionStorage.setItem("@AuthFirebase:user", JSON.stringify(user));

                    return <Navigate to={basePath + "login"} />;
                });
            }).catch((err) => console.log(err));
            
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    }

    const createUserData = async (phone, birthday, cpf, uid) => {
        await setDoc(doc(db, "users", uid), {
            phone,
            birthday,
            cpf
        });
    }

    const signInEmailPassword = async (email, password, name) => {
        try {
            const credential = await signInWithEmailAndPassword(auth, email, password);
            const token = credential.token;
            const user = credential.user;

            setUser(user);

            sessionStorage.setItem("@AuthFirebase:token", token);
            sessionStorage.setItem("@AuthFirebase:user", JSON.stringify(user));
            return true;
        } catch (error) {
            return false;
        }
    }

    const linkCredentials = async (password, name, phone, birthday, cpf) => {
        const credentialEmailPassword = EmailAuthProvider.credential(user.email, password);

        try {
            const usercred = await linkWithCredential(auth.currentUser, credentialEmailPassword);

            await updateProfile(auth.currentUser, { displayName: name });
            await createUserData(phone, birthday, cpf, usercred.user.uid);

            setUser(usercred.user);
            sessionStorage.setItem("@AuthFirebase:user", JSON.stringify(usercred.user));
            return <Navigate to={basePath} />;
        } catch (err) {
            console.log(err);
        }
    }

    function signOutFromApp() {
        signOut(auth).then(() => {
            sessionStorage.clear();
            setUser(null);
            console.log(basePath + "login");
            return <Navigate to={basePath + "login"} />
        }).catch((error) => {
            console.log(error);
            return <Navigate to={basePath} />
        });
    }

    return (
        <AuthenticationContext.Provider
            value={{
                signed: !!user,
                user,
                signOutFromApp,
                signInGoogle,
                createUserEmailPassword,
                signInEmailPassword,
                linkCredentials
            }}
        >
            {children}
        </AuthenticationContext.Provider>
    )

};