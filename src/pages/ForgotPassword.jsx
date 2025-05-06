import { useState } from "react"
import { Link } from "react-router-dom"
import { ArrowLeft, Mail } from "lucide-react"
import AuthNav from "../components/AuthNav"
import cloudImage from '../assets/landing/cloud-pixel.webp'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const validateEmail = (email) => {
    const regex = /\S+@\S+\.\S+/
    return regex.test(email)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Reset error state
    setError("")

    // Validate email
    if (!email.trim()) {
      setError("Email is required")
      return
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address")
      return
    }

    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Show success message
      setIsSuccess(true)
    } catch (error) {
      console.error("Error:", error)
      setError("Something went wrong. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleTryAgain = () => {
    setIsSuccess(false)
    setEmail("")
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

        <div className="bg-[#fffde7] rounded-3xl p-4 sm:p-10 w-full max-w-[90%] sm:max-w-md z-10">
          <Link to="/login" className="flex items-center text-[#e79c2d] hover:underline mb-4 sm:mb-6 text-sm sm:text-base">
            <ArrowLeft className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
            Back to Login
          </Link>

          {!isSuccess ? (
            <>
              <h2 className="text-center text-xl sm:text-2xl md:text-3xl mb-3 sm:mb-4">Forgot Password</h2>
              <p className="text-center text-gray-600 mb-4 sm:mb-8 text-sm sm:text-base">
                Enter your email address and we'll send you a link to reset your password.
              </p>

              <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-6">
                <div className="space-y-1 sm:space-y-2">
                  <label htmlFor="email" className="block text-base sm:text-lg">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-transparent border-b-2 border-gray-400 focus:border-[#e79c2d] outline-none py-1 sm:py-2 px-1 text-sm sm:text-base"
                    placeholder="Enter your email"
                  />
                  {error && <p className="text-red-500 text-xs sm:text-sm">{error}</p>}
                </div>

                <div className="pt-2 sm:pt-4 flex justify-center">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-[#ffe0b2] hover:bg-[#ffd180] text-black py-2 sm:py-3 px-6 sm:px-8 rounded-full text-base sm:text-lg transition-colors flex items-center gap-2"
                  >
                    {isSubmitting ? "Sending..." : "Send Reset Link"}
                    <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="text-center">
              <h2 className="text-xl sm:text-2xl md:text-3xl mb-3 sm:mb-4">Check Your Email</h2>
              <p className="text-gray-600 mb-4 sm:mb-8 text-sm sm:text-base">
                We've sent a password reset link to your email address.
              </p>
              <div className="space-y-3 sm:space-y-4">
                <button onClick={handleTryAgain} className="text-[#e79c2d] hover:underline text-sm sm:text-base">
                  Try a different email
                </button>
                <div>
                  <Link
                    to="/login"
                    className="bg-[#ffe0b2] hover:bg-[#ffd180] text-black py-2 sm:py-3 px-6 sm:px-8 rounded-full text-base sm:text-lg transition-colors inline-block"
                  >
                    Return to Login
                  </Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
} 