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

        <div className="bg-[#fffde7] rounded-3xl p-10 w-full max-w-md z-10">
          <Link to="/login" className="flex items-center text-[#e79c2d] hover:underline mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Login
          </Link>

          {!isSuccess ? (
            <>
              <h2 className="text-center text-2xl md:text-3xl mb-4">Forgot Password</h2>
              <p className="text-center text-gray-600 mb-8">
                Enter your email address and we'll send you a link to reset your password.
              </p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-lg">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-transparent border-b-2 border-gray-400 focus:border-[#e79c2d] outline-none py-2 px-1"
                    placeholder="Enter your email"
                  />
                  {error && <p className="text-red-500 text-sm">{error}</p>}
                </div>

                <div className="pt-4 flex justify-center">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-[#ffe0b2] hover:bg-[#ffd180] text-black py-3 px-8 rounded-full text-lg transition-colors flex items-center gap-2"
                  >
                    {isSubmitting ? (
                      "Sending..."
                    ) : (
                      <>
                        Send Reset Link
                        <Mail className="w-5 h-5" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-green-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl mb-4">Check Your Email</h2>
              <p className="text-gray-600 mb-6">
                We've sent a password reset link to:
                <br />
                <span className="font-medium text-gray-800 block mt-2">{email}</span>
              </p>
              <p className="text-gray-600 mb-8">
                Please check your inbox and follow the instructions to reset your password.
              </p>
              <div className="space-y-4">
                <button onClick={handleTryAgain} className="text-[#e79c2d] hover:underline">
                  Try a different email
                </button>
                <div>
                  <Link
                    to="/login"
                    className="bg-[#ffe0b2] hover:bg-[#ffd180] text-black py-3 px-8 rounded-full text-lg transition-colors inline-block"
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