import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Header from "../Header/Header";
import useAuth from "../../hooks/useAuth";
import './Layout.scss';
import useWindowDimensions from "../../hooks/useWindowDimensions";


const UserLayout = () => {
    const { auth, setAuth } = useAuth();
    const location = useLocation();
    const { width } = useWindowDimensions();

    return (
        <main className="App">
            <Header />
            <div className="outlet user-outlet"><Outlet /></div>
        </main>
    )
}

export default UserLayout