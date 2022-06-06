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

    const createUserEmailPassword = (email, password, name, phone, birthday, cpf) => {
        createUserWithEmailAndPassword(auth, email, password)
            .then((credential) => {
                const token = credential.token;
                const user = credential.user;

                updateProfile(auth.currentUser, { displayName: name }).then(() => {
                    setUser(user);

                    createUserData(phone, birthday, cpf, credential.user.uid).then(() => {
                        sessionStorage.setItem("@AuthFirebase:token", token);
                        sessionStorage.setItem("@AuthFirebase:user", JSON.stringify(user));

                        return <Navigate to="/login" />
                    });
                }).catch((err) => console.log(err));

            }).catch((error) => {
                console.log(error);
            });
    }

    const createUserData = async (phone, birthday, cpf, uid) => {
        await setDoc(doc(db, "users", uid), {
            phone,
            birthday,
            cpf
        });
    }

    const signInEmailPassword = (email, password, name) => {
        signInWithEmailAndPassword(auth, email, password)
            .then((credential) => {
                const token = credential.token;
                const user = credential.user;

                setUser(user);

                sessionStorage.setItem("@AuthFirebase:token", token);
                sessionStorage.setItem("@AuthFirebase:user", JSON.stringify(user));
            }).catch((error) => {
                console.log(error);
            });
    }

    const linkCredentials = async (password, name, phone, birthday, cpf) => {
        const credentialEmailPassword = EmailAuthProvider.credential(user.email, password);

        try {
            const usercred = await linkWithCredential(auth.currentUser, credentialEmailPassword);

            await updateProfile(auth.currentUser, { displayName: name });
            await createUserData(phone, birthday, cpf, usercred.user.uid);

            setUser(usercred.user);
            sessionStorage.setItem("@AuthFirebase:user", JSON.stringify(usercred.user));
            return <Navigate to="/" />;
        } catch (err) {
            console.log(err);
        }
    }

    function signOutFromApp() {
        signOut(auth).then(() => {
            sessionStorage.clear();
            setUser(null);

            return <Navigate to="/login" />
        }).catch((error) => {
            console.log(error);
            return <Navigate to="/" />
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