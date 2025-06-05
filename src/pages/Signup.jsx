import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Mail } from "lucide-react"
import AuthNav from "../components/AuthNav"
import cloudImage from '../assets/landing/cloud-pixel.webp'

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
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_DOMAIN}/api/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        console.log("Signup successful:", data);
        navigate("/loading?fromSignup=true");
      } else {
        console.error("Signup failed:", data.message);
        setErrors((prev) => ({
          ...prev,
          email: data.message,
        }));
      }
    } catch (error) {
      console.error("Signup error:", error);
      setErrors((prev) => ({
        ...prev,
        email: "An unexpected error occurred.",
      }));
    } finally {
      setIsSubmitting(false);
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
          <h2 className="text-center text-xl sm:text-2xl md:text-3xl mb-4 sm:mb-8">Let&apos;s Get Started!</h2>

          <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-6">
            <div className="space-y-1 sm:space-y-2">
              <label htmlFor="name" className="block text-base sm:text-lg">
                User Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-transparent border-b-2 border-gray-400 focus:border-[#e79c2d] outline-none py-1 sm:py-2 px-1 text-sm sm:text-base"
                placeholder="Enter your user name"
              />
              {errors.name && <p className="text-red-500 text-xs sm:text-sm">{errors.name}</p>}
            </div>

            <div className="space-y-1 sm:space-y-2">
              <label htmlFor="email" className="block text-base sm:text-lg">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-transparent border-b-2 border-gray-400 focus:border-[#e79c2d] outline-none py-1 sm:py-2 px-1 text-sm sm:text-base"
                placeholder="Enter your email"
              />
              {errors.email && <p className="text-red-500 text-xs sm:text-sm">{errors.email}</p>}
            </div>

            <div className="space-y-1 sm:space-y-2">
              <label htmlFor="password" className="block text-base sm:text-lg">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full bg-transparent border-b-2 border-gray-400 focus:border-[#e79c2d] outline-none py-1 sm:py-2 px-1 text-sm sm:text-base"
                placeholder="Create a password"
              />
              {errors.password && <p className="text-red-500 text-xs sm:text-sm">{errors.password}</p>}
            </div>

            <div className="pt-2 sm:pt-4 flex justify-center">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#ffe0b2] hover:bg-[#ffd180] text-black py-2 sm:py-3 px-6 sm:px-8 rounded-full text-base sm:text-lg transition-colors flex items-center gap-2"
              >
                {isSubmitting ? "Signing Up..." : "Sign Up with Email"}
                <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </div>
          </form>

          <p className="text-center mt-4 sm:mt-6 text-sm sm:text-base">
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