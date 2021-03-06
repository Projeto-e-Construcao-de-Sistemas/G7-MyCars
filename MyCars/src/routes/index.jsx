import { useContext } from "react"
import { Navigate, Outlet } from "react-router-dom";
import { AuthenticationContext } from "../context/authenticationContext";

export const PrivateRoutes = () => {
    const { signed } = useContext(AuthenticationContext);
    const isUserOnSessionstorage = !!sessionStorage.getItem("@AuthFirebase:user");

    return (signed || isUserOnSessionstorage) ? <Outlet /> : <Navigate to="/login" />;
}