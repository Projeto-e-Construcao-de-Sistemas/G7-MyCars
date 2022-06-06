import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { CompleteAccount } from '../pages/CompleteAccount/CompleteAccount';
import { CreateAccount } from '../pages/CreateAccount/CreateAccount';
import { Home } from '../pages/Home/Home';
import { Login } from '../pages/Login/Login';
import { Profile } from '../pages/Profile/Profile';
import { PrivateRoutes } from '.';

export const AppRoutes = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route index path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/createAccount" element={<CreateAccount />} />

                <Route path="/profile" element={<PrivateRoutes />}>
                    <Route path="/profile" element={<Profile />} />
                </Route>
                <Route path="/completeAccount" element={<CompleteAccount />} />

            </Routes>
        </BrowserRouter>
    );
};