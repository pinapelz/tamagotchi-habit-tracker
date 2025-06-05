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
import FriendsPage from './pages/Friends';
import Leaderboard from './pages/Leaderboard';
import NotificationsPage from './pages/NotificationsPage';
import About from './pages/About';
import ViewProfile from './pages/ViewProfile';
import Help from './pages/Help';
import Settings from './pages/Settings';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/dashboard" element={<Dashboard/>} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/about" element={<About />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/loading" element={<Loading />} />
      <Route path="/profile" element={<ProfilePage/>}/>
      <Route path="/profile/:userId" element={<ViewProfile/>}/>
      <Route path="/petcreation" element={<PetCreation/>}/>
      <Route path="/friends" element={<FriendsPage/>}/>
      <Route path="/leaderboard" element={<Leaderboard/>}/>
      <Route path="/notifications" element={<NotificationsPage />} />
      <Route path="/help" element={<Help />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
