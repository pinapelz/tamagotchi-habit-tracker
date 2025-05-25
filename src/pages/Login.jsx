import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Mail } from "lucide-react"
import { FaGithub } from "react-icons/fa"
import AuthNav from "../components/AuthNav"
import cloudImage from '../assets/landing/cloud-pixel.webp'
import { auth } from '../firebase';
import { GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword } from 'firebase/auth';

export default function LoginPage() {
  const navigate = useNavigate()
  const [loginInfo, setLoginInfo] = useState({
    email: "",
    password: "",
  })
  const [errorMsgs, setErrorMsgs] = useState({
    email: "",
    password: "",
  })
  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setLoginInfo((prev) => ({
      ...prev,
      [name]: value,
    }))

    if (errorMsgs[name]) {
      setErrorMsgs((prev) => ({
        ...prev,
        [name]: "",
      }))
    }
  }

  const checkForm = () => {
    let formOk = true
    const newErrors = { ...errorMsgs }

    if (!loginInfo.email.trim()) {
      newErrors.email = "Email is required"
      formOk = false
    } else if (!/\S+@\S+\.\S+/.test(loginInfo.email)) {
      newErrors.email = "Email is invalid"
      formOk = false
    }

    if (!loginInfo.password) {
      newErrors.password = "Password is required"
      formOk = false
    }

    setErrorMsgs(newErrors)
    return formOk
  }

  const handleLogin = async (e) => {
    e.preventDefault()

    if (!checkForm()) return

    setIsLoading(true)

    try {
      await signInWithEmailAndPassword(auth, loginInfo.email, loginInfo.password);
      navigate("/dashboard");
    } catch (error) {
      console.error("Login error:", error);
      setErrorMsgs({
        email: "Invalid email or password",
        password: "Invalid email or password",
      });
    } finally {
      setIsLoading(false);
    }
  }

  const loginWithGithub = async () => {
    try {
      console.log("GitHub login not implemented yet")
      // TODO: implement GitHub login with Firebase
    } catch (error) {
      console.error("GitHub login error:", error)
    }
  }

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      navigate('/dashboard');
    } catch (error) {
      console.error('Error during Google login:', error);
      setErrorMsgs({
        email: "Google login failed",
        password: "Google login failed",
      });
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 to-sky-200 flex flex-col">
      <div className="container mx-auto px-4">
        <AuthNav />
      </div>
      <main className="flex-1 flex flex-col items-center justify-center px-4 relative overflow-hidden">
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <img
            src={cloudImage}
            alt="Pixelated Cloud"
            className="hidden sm:block absolute top-10 left-[5%] sm:left-10 w-16 sm:w-20 opacity-50 sm:opacity-70 animate-bounce-slow"
          />
          <img
            src={cloudImage}
            alt="Pixelated Cloud"
            className="absolute bottom-5 right-[5%] sm:right-5 w-16 sm:w-24 opacity-50 sm:opacity-70 animate-bounce-slow"
          />
          <img
            src={cloudImage}
            alt="Pixelated Cloud"
            className="absolute top-[20%] -left-8 sm:left-[-30px] w-16 sm:w-24 opacity-40 sm:opacity-60 animate-bounce-slow"
          />
          <img
            src={cloudImage}
            alt="Pixelated Cloud"
            className="absolute bottom-[20%] -right-8 sm:right-[-30px] w-16 sm:w-20 opacity-40 sm:opacity-60 animate-bounce-slow"
          />
          <img
            src={cloudImage}
            alt="Pixelated Cloud"
            className="hidden sm:block absolute top-[-5px] right-[25%] w-20 sm:w-32 opacity-40 sm:opacity-60 animate-bounce-slow"
          />
        </div>

        <div className="bg-[#fffde7] rounded-3xl p-4 sm:p-10 w-full max-w-[90%] sm:max-w-md z-10">
          <h2 className="text-center text-xl sm:text-2xl md:text-3xl mb-4 sm:mb-8">Welcome Back!</h2>

          <div className="flex flex-col gap-2 sm:gap-4 mb-4 sm:mb-8">
            <button
              onClick={handleGoogleLogin}
              className="flex items-center justify-center gap-2 bg-white hover:bg-gray-100 text-gray-800 py-2 sm:py-3 px-4 rounded-full border border-gray-300 transition-colors cursor-pointer text-sm sm:text-base w-full"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" className="w-4 h-4 sm:w-5 sm:h-5">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Log in with Google
            </button>
            <button
              onClick={loginWithGithub}
              className="flex items-center justify-center gap-2 bg-[#24292e] hover:bg-[#1a1e22] text-white py-2 sm:py-3 px-4 rounded-full transition-colors cursor-pointer text-sm sm:text-base"
            >
              <FaGithub className="w-4 h-4 sm:w-5 sm:h-5" />
              Log in with GitHub
            </button>
          </div>

          <div className="relative flex items-center justify-center mb-4 sm:mb-8">
            <div className="border-t border-gray-300 absolute w-full"></div>
            <span className="bg-[#fffde7] px-4 relative text-gray-500 text-xs sm:text-sm">OR</span>
          </div>

          <form onSubmit={handleLogin} className="space-y-3 sm:space-y-6">
            <div className="space-y-1 sm:space-y-2">
              <label htmlFor="email" className="block text-base sm:text-lg">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={loginInfo.email}
                onChange={handleInputChange}
                className="w-full bg-transparent border-b-2 border-gray-400 focus:border-[#e79c2d] outline-none py-1 sm:py-2 px-1 text-sm sm:text-base"
                placeholder="Enter your email"
              />
              {errorMsgs.email && <p className="text-red-500 text-xs sm:text-sm">{errorMsgs.email}</p>}
            </div>

            <div className="space-y-1 sm:space-y-2">
              <label htmlFor="password" className="block text-base sm:text-lg">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={loginInfo.password}
                onChange={handleInputChange}
                className="w-full bg-transparent border-b-2 border-gray-400 focus:border-[#e79c2d] outline-none py-1 sm:py-2 px-1 text-sm sm:text-base"
                placeholder="Enter your password"
              />
              {errorMsgs.password && <p className="text-red-500 text-xs sm:text-sm">{errorMsgs.password}</p>}
            </div>

            <div className="flex justify-end">
              <Link to="/forgot-password" className="text-[#e79c2d] hover:underline text-xs sm:text-sm">
                Forgot password?
              </Link>
            </div>

            <div className="pt-2 sm:pt-4 flex justify-center">
              <button
                type="submit"
                disabled={isLoading}
                className="bg-[#ffe0b2] hover:bg-[#ffd180] text-black py-2 sm:py-3 px-6 sm:px-8 rounded-full text-base sm:text-lg transition-colors flex items-center gap-2"
              >
                {isLoading ? "Logging In..." : "Log In with Email"}
                <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </form>

          <p className="text-center mt-4 sm:mt-6 text-sm sm:text-base">
            Don&apos;t have an account?{" "}
            <Link to="/signup" className="text-[#e79c2d] hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </main>
    </div>
  )
} 