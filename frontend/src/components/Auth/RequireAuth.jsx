import { useEffect, useState } from 'react';
import { useLocation, Navigate, Outlet } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

const RequireAuth = ({ allowedRoles }) => {
    const { auth } = useAuth();
    const location = useLocation();
    const [redirectTo, setRedirectTo] = useState(null);

    useEffect(() => {
        const userIsLoggedIn = auth && auth.email;
        const userHasRequiredRole = allowedRoles && auth?.roles?.some(role => allowedRoles.includes(role));

        if (!userIsLoggedIn) {
            setRedirectTo('/login');
        } else if (allowedRoles && !userHasRequiredRole) {
            alert('You Shall Not Pass!')
            setRedirectTo('/homepage');
        } else {
            setRedirectTo(null);
        }
    }, [auth, allowedRoles, location.pathname]);

    if (redirectTo) {
        return <Navigate to={redirectTo} state={{ from: location }} replace />;
    }

    return <Outlet />;
};

export default RequireAuth;
