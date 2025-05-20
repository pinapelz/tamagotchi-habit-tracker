import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/layout/Layout";
import MobileLayout from "../components/layout/MobileLayout";
import cloudImage from '../assets/landing/cloud-pixel.webp';
import pixelCat from "../assets/pets/pixel-cat.gif";
import pixelBat from "../assets/pets/pixel-bat.gif";
import pixelDuck from "../assets/pets/pixel-duck.gif";
import pixelDog from "../assets/pets/pixel-dog.gif";
import LoadingPage from "./Loading";

export default function PetCreation() {
  const navigate = useNavigate();
  const [selectedPet, setSelectedPet] = useState(null);
  const [petName, setPetName] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const checkHasPet = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_DOMAIN}/api/has-pet`, {
          method: "GET",
          credentials: "include",
        });
        
        if (!response.ok) {
          if (response.status === 401) {
            navigate('/login');
            return;
          }
          throw new Error('Failed to check pet status');
        }
        
        const data = await response.json();
        
        if (data.has_pet) {
          navigate('/dashboard');
          return;
        }
        setLoading(false);
      } catch (err) {
        console.error("Error checking pet status:", err);
        setError("Unable to check pet status. Please try again later.");
        setLoading(false);
      }
    };
    
    checkHasPet();
  }, [navigate]);
  
  const pets = [
    { id: "cat", name: "Cat", image: pixelCat },
    { id: "duck", name: "Duck", image: pixelDuck },
    { id: "bat", name: "Bat", image: pixelBat },
    { id: "dog", name: "Dog", image: pixelDog },
  ];
  
  const handlePetSelect = (petId) => {
    setSelectedPet(petId);
    setError("");
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedPet) {
      setError("Please select a pet");
      return;
    }
    
    if (!petName.trim()) {
      setError("Please give your pet a name");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_DOMAIN}/api/create-pet`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          type: selectedPet, 
          name: petName 
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create pet");
      }
      
      // Successfully created pet, redirect to dashboard
      navigate("/dashboard");
    } catch (error) {
      console.error("Error creating pet:", error);
      setError(error.message || "Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingPage />;
  }

  const LayoutComponent = isMobile ? MobileLayout : Layout;

  return (
    <LayoutComponent userName="New User">
      <div className="min-h-screen bg-gradient-to-b from-sky-100 to-sky-200 flex flex-col">
        <main className="flex-1 flex flex-col items-center justify-center px-4 relative overflow-hidden">
          {/* Decorative clouds */}
          <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
            <img
              src={cloudImage}
              alt="Pixelated Cloud"
              className="hidden sm:block absolute top-10 left-[5%] sm:left-10 w-16 sm:w-20 opacity-50 sm:opacity-70 animate-bounce-slow"
            />
            {/* Other cloud images */}
          </div>
          
          <div className="bg-[#fdffe9] rounded-3xl p-4 sm:p-8 w-full max-w-[95%] sm:max-w-4xl z-10">
            <h2 className="text-center text-2xl sm:text-3xl md:text-4xl mb-8 sm:mb-16 font-sniglet">Pick your pet!</h2>
            
            {/* Pet Selection */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8 mb-8 sm:mb-12">
              {pets.map((pet) => (
                <button
                  key={pet.id}
                  onClick={() => handlePetSelect(pet.id)}
                  className={`flex flex-col items-center justify-center p-2 sm:p-4 rounded-xl transition-all ${
                    selectedPet === pet.id 
                      ? 'bg-[#ffe0b2] scale-105 border-2 border-[#e79c2d]' 
                      : 'hover:bg-[#f5f5dc] hover:scale-105'
                  }`}
                >
                  <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 flex items-center justify-center">
                    <img
                      src={pet.image}
                      alt={pet.name}
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                  <span className="mt-2 sm:mt-4 text-xs sm:text-sm font-medium text-gray-700">{pet.name}</span>
                </button>
              ))}
            </div>
            
            {/* Pet Naming Form */}
            {selectedPet && (
              <div className="space-y-4 sm:space-y-6">
                <div className="flex flex-col items-center">
                  <label htmlFor="petName" className="block text-base sm:text-lg text-center mb-2">
                    Give your pet a name:
                  </label>
                  <input
                    type="text"
                    id="petName"
                    value={petName}
                    onChange={(e) => setPetName(e.target.value)}
                    className="w-full max-w-[200px] sm:max-w-xs bg-transparent border-b-2 border-gray-400 focus:border-[#e79c2d] outline-none py-2 px-1 text-center text-base sm:text-lg"
                    placeholder="Enter a name"
                    maxLength={20}
                  />
                  {error && <p className="text-red-500 text-center text-xs sm:text-sm mt-2">{error}</p>}
                </div>

                <div className="flex justify-center">
                  <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="bg-[#ffe0b2] hover:bg-[#ffd180] text-black py-2 sm:py-3 px-6 sm:px-8 rounded-full text-base sm:text-lg transition-colors flex items-center gap-2"
                  >
                    {isSubmitting ? "Creating..." : "Start Adventure!"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </LayoutComponent>
  );
}