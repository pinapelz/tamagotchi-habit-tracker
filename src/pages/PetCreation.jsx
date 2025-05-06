import { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavBar from "../components/NavBar";
import cloudImage from '../assets/landing/cloud-pixel.webp';
import pixelCat from "../assets/pets/pixel-cat.gif";

export default function PetCreation() {
  const navigate = useNavigate();
  const [selectedPet, setSelectedPet] = useState(null);
  const [petName, setPetName] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Mock pet data - replace images with actual assets when available
  const pets = [
    { id: "cat", name: "Cat", image: pixelCat },
    { id: "chick", name: "Chick", image: pixelCat }, // Replace with actual chick image
    { id: "bat", name: "Bat", image: pixelCat }, // Replace with actual bat image
    { id: "seal", name: "Seal", image: pixelCat }, // Replace with actual seal image
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
      // Simulate API call to save pet selection
      console.log("Creating pet:", { type: selectedPet, name: petName });
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Redirect to dashboard
      navigate("/dashboard");
    } catch (error) {
      console.error("Error creating pet:", error);
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 to-sky-200 flex flex-col">
        <NavBar enableMenu={false}/>
      
      <main className="flex-1 flex flex-col items-center justify-center px-4 relative overflow-hidden">
        {/* Decorative clouds */}
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
        
        <div className="bg-[#fffde7] rounded-3xl p-4 sm:p-10 w-full max-w-[90%] sm:max-w-2xl z-10">
          <h2 className="text-center text-2xl sm:text-3xl md:text-4xl mb-6 sm:mb-10">Pick your pet!</h2>
          
          {/* Pet Selection */}
          <div className="flex flex-wrap justify-center gap-4 sm:gap-8 mb-8">
            {pets.map((pet) => (
              <div 
                key={pet.id}
                onClick={() => handlePetSelect(pet.id)}
                className={`cursor-pointer transition-all p-4 rounded-2xl flex flex-col items-center
                  ${selectedPet === pet.id 
                    ? 'bg-[#ffe0b2] scale-105 border-2 border-[#e79c2d]' 
                    : 'bg-transparent hover:bg-[#f5f5dc] hover:scale-105'
                  }`}
              >
                <div className="w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center">
                  <img 
                    src={pet.image} 
                    alt={pet.name}
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
                <span className="mt-2 text-sm font-medium text-gray-700">{pet.name}</span>
              </div>
            ))}
          </div>
          
          {/* Pet Naming Form */}
          <form onSubmit={handleSubmit} className="mt-6">
            <div className="space-y-1 sm:space-y-2 mb-6">
              <label htmlFor="petName" className="block text-lg sm:text-xl text-center">
                Give your pet a name:
              </label>
              <input
                type="text"
                id="petName"
                value={petName}
                onChange={(e) => setPetName(e.target.value)}
                className="w-full max-w-xs mx-auto block bg-transparent border-b-2 border-gray-400 focus:border-[#e79c2d] outline-none py-2 px-1 text-center text-lg"
                placeholder="Enter a name"
                maxLength={20}
              />
              {error && <p className="text-red-500 text-center text-sm">{error}</p>}
            </div>

            <div className="flex justify-center mt-8">
              <button
                type="submit"
                disabled={isSubmitting}
                className="bg-[#ffe0b2] hover:bg-[#ffd180] text-black py-3 px-8 rounded-full text-lg sm:text-xl transition-colors flex items-center gap-2"
              >
                {isSubmitting ? "Creating..." : "Start Adventure!"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}