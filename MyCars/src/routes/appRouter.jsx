import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { CompleteAccount } from '../pages/CompleteAccount/CompleteAccount';
import { CreateAccount } from '../pages/CreateAccount/CreateAccount';
import { Home } from '../pages/Home/Home';
import { Login } from '../pages/Login/Login';
import { Profile } from '../pages/Profile/Profile';
import { PrivateRoutes } from '.';
import { MyAnnouncements } from '../pages/MyAnnouncements/MyAnnouncements';
import CreateAnnouncement from '../pages/CreateAnnouncement/CreateAnnouncement';
import Annoucements from '../pages/Annoucements/Annoucements';

export const AppRoutes = () => {
    const baseUrl = process.env.PUBLIC_URL + "/";
    const enviromnent = process.env.NODE_ENV;
    const basePath = (enviromnent === "production") ? baseUrl : "/";

    return (
        <BrowserRouter>
            <Routes>
                <Route index path={basePath} exact element={<Home />} />
                <Route path={basePath + "login/"} exact element={<Login />} />
                <Route path={basePath + "createAccount/"} exact element={<CreateAccount />} />

                <Route path={basePath + "profile/"} exact element={<PrivateRoutes />}>
                    <Route path={basePath + "profile/"} exact element={<Profile />} />
                </Route>

                <Route path={basePath + "myAnnouncements/"} exact element={<PrivateRoutes />}>
                    <Route path={basePath + "myAnnouncements/"} exact element={<MyAnnouncements />} />
                </Route>

                <Route path={basePath + "createAnnouncement/"} exact element={<PrivateRoutes />} >
                    <Route path={basePath + "createAnnouncement/"} exact element={<CreateAnnouncement/>} />
                </Route>
                <Route path={basePath + "createAnnouncement/:id"} exact element={<PrivateRoutes />}>
                    <Route path={basePath + "createAnnouncement/:id"} exact element={<CreateAnnouncement />} />
                </Route>

                <Route path={basePath + "completeAccount"} exact element={<CompleteAccount />} />

                <Route path={basePath + "annoucement/:id"} exact element={<Annoucements/>}/>

            </Routes>
        </BrowserRouter>
    );
};