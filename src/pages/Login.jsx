import { useState, useEffect } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { Mail } from "lucide-react"
import AuthNav from "../components/AuthNav"
import cloudImage from '../assets/landing/cloud-pixel.webp'

export default function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  const emailFromSignup = searchParams.get("email")
  const [showSuccessMessage, setShowSuccessMessage] = useState(false)

  const [loginInfo, setLoginInfo] = useState({
    email: emailFromSignup || "",
    password: "",
  })
  const [errorMsgs, setErrorMsgs] = useState({
    email: "",
    password: "",
  })
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (emailFromSignup) {
      setShowSuccessMessage(true)
      // Hide success message after 5 seconds
      const timer = setTimeout(() => {
        setShowSuccessMessage(false)
      }, 5000)
      return () => clearTimeout(timer)
    }
  }, [emailFromSignup])

  // handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setLoginInfo((prev) => ({
      ...prev,
      [name]: value,
    }))

    // clear error when typing
    if (errorMsgs[name]) {
      setErrorMsgs((prev) => ({
        ...prev,
        [name]: "",
      }))
    }
  }

  // super basic validation - will improve later maybe
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

  // login form submit
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!checkForm()) return;

    setIsLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_DOMAIN}/api/authenticate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginInfo),
        credentials: "include", // Include cookies for session management
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Login successful:", data);
        navigate("/loading");
      } else {
        console.error("Login failed:", data.message);
        setErrorMsgs((prev) => ({
          ...prev,
          email: data.message,
        }));
      }
    } catch (error) {
      console.error("Login error:", error);
      setErrorMsgs((prev) => ({
        ...prev,
        email: "An unexpected error occurred.",
      }));
    } finally {
      setIsLoading(false);
    }
  };

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

          {showSuccessMessage && (
            <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded-lg">
              <p className="text-sm">Account created successfully! Please log in to continue.</p>
            </div>
          )}

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
