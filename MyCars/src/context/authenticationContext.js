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

import { auth } from "../services/firebaseConfig";
import { Navigate } from "react-router-dom";

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

    const createUserEmailPassword = (email, password, name) => {
        createUserWithEmailAndPassword(auth, email, password)
            .then((credential) => {
                const token = credential.token;
                const user = credential.user;

                updateProfile(auth.currentUser, { displayName: name }).then(() => {
                    setUser(user);

                    sessionStorage.setItem("@AuthFirebase:token", token);
                    sessionStorage.setItem("@AuthFirebase:user", JSON.stringify(user));

                }).catch((err) => console.log(err));

                return <Navigate to="/login" />
            }).catch((error) => {
                console.log(error);
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

    const linkCredentials = async (password, name) => {
        const credentialEmailPassword = EmailAuthProvider.credential(user.email, password);

        try {
            const usercred = await linkWithCredential(auth.currentUser, credentialEmailPassword);

            await updateProfile(auth.currentUser, { displayName: name });
            setUser(usercred.user);
            sessionStorage.setItem("@AuthFirebase:user", JSON.stringify(usercred.user));
            return <Navigate to="/profile" />;

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