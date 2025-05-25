import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { useAuth } from './contexts/AuthContext'
import LandingPage from './pages/LandingPage'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login'
import Signup from './pages/Signup'
import ForgotPassword from './pages/ForgotPassword'
import Loading from './pages/Loading'
import PetCreation from './pages/PetCreation'
import ProfilePage from './pages/ProfilePage'
import FriendsPage from './pages/Friends'
import NotFoundPage from './pages/NotFoundPage'
import Leaderboard from './pages/Leaderboard'
import NotificationsPage from './pages/NotificationsPage'
import About from './pages/About'

console.log('Google Client ID:', import.meta.env.VITE_GOOGLE_CLIENT_ID);
console.log('API Domain:', import.meta.env.VITE_API_DOMAIN);

function AppRoutes() {
  const { loading, error } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/loading" element={<Loading />} />
      <Route path="/petcreation" element={<PetCreation />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/friends" element={<FriendsPage />} />
      <Route path="/leaderboard" element={<Leaderboard />} />
      <Route path="/notifications" element={<NotificationsPage />} />
      <Route path="/about" element={<About />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  )
}

export default App
