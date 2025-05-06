import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Github, Mail } from "lucide-react"
import AuthNav from "../components/AuthNav"
import cloudImage from '../assets/images/cloud.png'

export default function SignupPage() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  })
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    password: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }
  }

  const validateForm = () => {
    let valid = true
    const newErrors = { ...errors }

    if (!formData.name.trim()) {
      newErrors.name = "Name is required"
      valid = false
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
      valid = false
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid"
      valid = false
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
      valid = false
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
      valid = false
    }

    setErrors(newErrors)
    return valid
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) return

    setIsSubmitting(true)

    try {
      // This would be replaced with your actual signup API call
      console.log("Signing up with:", formData)

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Redirect to loading page after successful signup with fromSignup parameter
      navigate("/loading?fromSignup=true")
    } catch (error) {
      console.error("Signup error:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleGoogleSignup = async () => {
    try {
      console.log("Signing up with Google")
      // This would be replaced with actual Google OAuth implementation
      // For example: await signIn('google')

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Redirect to loading page after successful signup with fromSignup parameter
      navigate("/loading?fromSignup=true")
    } catch (error) {
      console.error("Google signup error:", error)
    }
  }

  const handleGithubSignup = async () => {
    try {
      console.log("Signing up with GitHub")
      // This would be replaced with actual GitHub OAuth implementation
      // For example: await signIn('github')

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Redirect to loading page after successful signup with fromSignup parameter
      navigate("/loading?fromSignup=true")
    } catch (error) {
      console.error("GitHub signup error:", error)
    }
  }

  return (
    <div className="min-h-screen bg-[#def8fb] flex flex-col">
      <div className="container mx-auto px-4">
        <AuthNav />
      </div>
      <main className="flex-1 flex flex-col items-center justify-center px-4 relative overflow-hidden">
        <div className="absolute top-[-20px] left-[-20px] z-0">
          <img src={cloudImage} alt="Pixel cloud" width={120} height={120} className="opacity-80" />
        </div>

        <div className="absolute bottom-[-30px] left-[-10px] z-0">
          <img src={cloudImage} alt="Pixel cloud" width={140} height={140} className="opacity-80" />
        </div>

        <div className="absolute bottom-[-40px] right-[-20px] z-0">
          <img src={cloudImage} alt="Pixel cloud" width={160} height={160} className="opacity-80" />
        </div>

        <div className="bg-[#fffde7] rounded-3xl p-10 w-full max-w-md z-10">
          <h2 className="text-center text-2xl md:text-3xl mb-8">Let&apos;s Get Started!</h2>

          <div className="flex flex-col gap-4 mb-8">
            <button
              onClick={handleGoogleSignup}
              className="flex items-center justify-center gap-2 bg-white hover:bg-gray-100 text-gray-800 py-3 px-4 rounded-full border border-gray-300 transition-colors cursor-pointer"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" className="w-5 h-5">
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
              Sign up with Google
            </button>
            <button
              onClick={handleGithubSignup}
              className="flex items-center justify-center gap-2 bg-[#24292e] hover:bg-[#1a1e22] text-white py-3 px-4 rounded-full transition-colors cursor-pointer"
            >
              <Github className="w-5 h-5" />
              Sign up with GitHub
            </button>
          </div>

          <div className="relative flex items-center justify-center mb-8">
            <div className="border-t border-gray-300 absolute w-full"></div>
            <span className="bg-[#fffde7] px-4 relative text-gray-500 text-sm">OR</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="name" className="block text-lg">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-transparent border-b-2 border-gray-400 focus:border-[#e79c2d] outline-none py-2 px-1"
                placeholder="Enter your name"
              />
              {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="block text-lg">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-transparent border-b-2 border-gray-400 focus:border-[#e79c2d] outline-none py-2 px-1"
                placeholder="Enter your email"
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block text-lg">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full bg-transparent border-b-2 border-gray-400 focus:border-[#e79c2d] outline-none py-2 px-1"
                placeholder="Create a password"
              />
              {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
            </div>

            <div className="pt-4 flex justify-center">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#ffe0b2] hover:bg-[#ffd180] text-black py-3 px-8 rounded-full text-lg transition-colors flex items-center gap-2"
              >
                {isSubmitting ? "Signing Up..." : "Sign Up with Email"}
                <Mail className="w-5 h-5" />
              </button>
            </div>
          </form>

          <p className="text-center mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-[#e79c2d] hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </main>
    </div>
  )
} 