import { useState, useEffect } from "react"
import { Link, useNavigate, useLocation } from "react-router-dom"
import { ArrowLeft, Lock } from "lucide-react"
import AuthNav from "../components/AuthNav"
import cloudImage from '../assets/landing/cloud-pixel.webp'

export default function ResetPasswordPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  const token = searchParams.get("token")
  const email = searchParams.get("email")

  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  })
  const [errors, setErrors] = useState({
    password: "",
    confirmPassword: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    // Validate token and email presence
    if (!token || !email) {
      setError("Invalid or expired reset link. Please request a new password reset.")
    }
  }, [token, email])

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

    if (!formData.password) {
      newErrors.password = "Password is required"
      valid = false
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
      valid = false
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password"
      valid = false
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
      valid = false
    }

    setErrors(newErrors)
    return valid
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      // Simulate API call - Commented out for now
      /*
      const response = await fetch(`${import.meta.env.VITE_API_DOMAIN}/api/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          email,
          password: formData.password,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to reset password')
      }
      */

      // Simulate successful password reset
      await new Promise(resolve => setTimeout(resolve, 1000)) // Simulate network delay
      setIsSuccess(true)
    } catch (error) {
      console.error('Error:', error)
      setError('Failed to reset password. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (error && !token) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-sky-100 to-sky-200 flex flex-col">
        <div className="container mx-auto px-4">
          <AuthNav />
        </div>
        <main className="flex-1 flex flex-col items-center justify-center px-4">
          <div className="bg-[#fffde7] rounded-3xl p-8 w-full max-w-md text-center">
            <h2 className="text-2xl mb-4">Invalid Reset Link</h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <Link
              to="/forgot-password"
              className="bg-[#ffe0b2] hover:bg-[#ffd180] text-black py-2 px-6 rounded-full text-base transition-colors inline-block"
            >
              Request New Reset Link
            </Link>
          </div>
        </main>
      </div>
    )
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
        </div>

        <div className="bg-[#fffde7] rounded-3xl p-4 sm:p-10 w-full max-w-[90%] sm:max-w-md z-10">
          <Link to="/login" className="flex items-center text-[#e79c2d] hover:underline mb-4 sm:mb-6 text-sm sm:text-base">
            <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
            Back to Login
          </Link>

          {!isSuccess ? (
            <>
              <h2 className="text-center text-xl sm:text-2xl md:text-3xl mb-3 sm:mb-4">Reset Password</h2>
              <p className="text-center text-gray-600 mb-4 sm:mb-8 text-sm sm:text-base">
                Please enter your new password below.
              </p>

              <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-6">
                <div className="space-y-1 sm:space-y-2">
                  <label htmlFor="password" className="block text-base sm:text-lg">
                    New Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full bg-transparent border-b-2 border-gray-400 focus:border-[#e79c2d] outline-none py-1 sm:py-2 px-1 text-sm sm:text-base"
                    placeholder="Enter new password"
                  />
                  {errors.password && <p className="text-red-500 text-xs sm:text-sm">{errors.password}</p>}
                </div>

                <div className="space-y-1 sm:space-y-2">
                  <label htmlFor="confirmPassword" className="block text-base sm:text-lg">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full bg-transparent border-b-2 border-gray-400 focus:border-[#e79c2d] outline-none py-1 sm:py-2 px-1 text-sm sm:text-base"
                    placeholder="Confirm new password"
                  />
                  {errors.confirmPassword && <p className="text-red-500 text-xs sm:text-sm">{errors.confirmPassword}</p>}
                </div>

                {error && <p className="text-red-500 text-sm text-center">{error}</p>}

                <div className="pt-2 sm:pt-4 flex justify-center">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-[#ffe0b2] hover:bg-[#ffd180] text-black py-2 sm:py-3 px-6 sm:px-8 rounded-full text-base sm:text-lg transition-colors flex items-center gap-2"
                  >
                    {isSubmitting ? "Resetting..." : "Reset Password"}
                    <Lock className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="text-center">
              <h2 className="text-xl sm:text-2xl md:text-3xl mb-3 sm:mb-4">Password Reset Successful!</h2>
              <p className="text-gray-600 mb-4 sm:mb-8 text-sm sm:text-base">
                Your password has been reset successfully. You can now log in with your new password.
              </p>
              <Link
                to="/login"
                className="bg-[#ffe0b2] hover:bg-[#ffd180] text-black py-2 sm:py-3 px-6 sm:px-8 rounded-full text-base sm:text-lg transition-colors inline-block"
              >
                Go to Login
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  )
} 