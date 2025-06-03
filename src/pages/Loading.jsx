import { useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import doorImage from '../assets/images/door.png'

export default function LoadingPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const searchParams = new URLSearchParams(location.search)
  const fromSignup = searchParams.get("fromSignup") === "true"

  useEffect(() => {
    const timer = setTimeout(() => {
      if (fromSignup) {
        navigate("/login")
      } else {
        navigate("/dashboard")
      }
    }, 3000)

    return () => clearTimeout(timer)
  }, [navigate, fromSignup])

  return (
    <div className="min-h-screen bg-[#def8fb] flex items-center justify-center">
      <div className="flex flex-col items-center">
        <div className="animate-pulse">
          <img 
            src={doorImage}
            alt="Door" 
            width={280} 
            height={593}
            className="mx-auto"
          />
        </div>
        <p className="text-[#000000] text-3xl font-sniglet -mt-1">Loading...</p>
      </div>
    </div>
  )
} 