import './App.scss';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import UserLayout from './components/Layouts/UserLayout';
import Homepage from './components/Homepage/Homepage';
import AdminHomepage from './components/AdminHomepage/AdminHomepage';
import Register from './components/Auth/Register';
import Unauthorized from './components/Auth/Unauthorized';
import Login from './components/Auth/Login';
import RequireAuth from './components/Auth/RequireAuth';
import { RickAndMortyProvider } from './contexts/RickAndMortyProvider';
import { QueryClient, QueryClientProvider } from 'react-query';
import { useEffect } from 'react';

const queryClient = new QueryClient();

function App() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === '/') {
      navigate('/login');
    }
  }, [location, navigate]);

  return (
    <Routes>
      <Route path="/" element={<UserLayout />}>
        <Route path="register" element={<Register />} />
        <Route path="unauthorized" element={<Unauthorized />} />
        <Route path="login" element={<Login />} />

        <Route element={<RequireAuth allowedRoles={['USER', 'ADMIN']} />}>
          <Route path="homepage" element={
            <RickAndMortyProvider>
              <QueryClientProvider client={queryClient}>
                <Homepage />
              </QueryClientProvider>
            </RickAndMortyProvider>
          } />
        </Route>
        <Route element={<RequireAuth allowedRoles={['ADMIN']} />}>
          <Route path="admin-homepage" element={<AdminHomepage />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
