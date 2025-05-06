import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import NotFoundPage from './pages/NotFoundPage';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import Loading from './pages/Loading';
import ProfilePage from './pages/ProfilePage'
import PetCreation from './pages/PetCreation';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/dashboard" element={<Dashboard/>} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/loading" element={<Loading />} />
      <Route path="/profile" element={<ProfilePage/>}/>
      <Route path="/petcreation" element={<PetCreation/>}/>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
