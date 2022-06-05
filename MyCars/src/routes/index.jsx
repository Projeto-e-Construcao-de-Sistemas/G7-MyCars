import { useContext } from "react"
import { Navigate, Outlet } from "react-router-dom";
import { AuthenticationContext } from "../context/authenticationContext";

export const PrivateRoutes = () => {
    const { signed } = useContext(AuthenticationContext);

    return signed ? <Outlet /> : <Navigate to="/login" />;
}