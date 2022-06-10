import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { CompleteAccount } from '../pages/CompleteAccount/CompleteAccount';
import { CreateAccount } from '../pages/CreateAccount/CreateAccount';
import { Home } from '../pages/Home/Home';
import { Login } from '../pages/Login/Login';
import { Profile } from '../pages/Profile/Profile';
import { PrivateRoutes } from '.';

export const AppRoutes = () => {
    const baseUrl = process.env.PUBLIC_URL+"/";
    const enviromnent = process.env.NODE_ENV;
    const basePath = (enviromnent === "production") ? baseUrl : "/";
    return (
        <BrowserRouter>
            <Routes>
                <Route index path={basePath} element={<Home />} />
                <Route path={basePath+"login"} element={<Login />} />
                <Route path={basePath+"createAccount"} element={<CreateAccount />} />

                <Route path={basePath+"profile"} element={<PrivateRoutes />}>
                    <Route path={basePath+"profile"} element={<Profile />} />
                </Route>
                <Route path={basePath+"completeAccount"} element={<CompleteAccount />} />

            </Routes>
        </BrowserRouter>
    );
};