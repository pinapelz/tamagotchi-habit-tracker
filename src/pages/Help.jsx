import React, { useState, useEffect } from "react";
import Layout from "../components/layout/Layout";
import MobileLayout from "../components/layout/MobileLayout";
import { ChevronDown, ChevronUp, PawPrint, Users, Trophy, Bell, Clock, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Help() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [openSection, setOpenSection] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch user profile data
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_DOMAIN}/api/profile`, {
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) {
          if (response.status === 401) {
            navigate('/login');
            return;
          }
          throw new Error("Failed to fetch profile data");
        }

        const { data } = await response.json();
        setUserProfile(data);
      } catch (err) {
        console.error("Error fetching profile:", err);
        setError(err.message);
      }
    };

    fetchProfileData();
  }, [navigate]);

  const faqs = [
    {
      question: "What is Tamagotchi Tracker?",
      answer: "Tamagotchi Tracker is a habit-tracking app that helps you build good habits while taking care of a virtual pet. Your pet grows and thrives as you complete your daily habits!"
    },
    {
      question: "How do I create a new habit?",
      answer: "Go to your dashboard and click the 'Add Habit' button. Fill in the habit details like name, frequency, and time of day. Your pet will help you stay motivated to complete your habits!"
    },
    {
      question: "How does the pet system work?",
      answer: "Your pet's happiness and growth are tied to your habit completion. Complete your habits regularly to keep your pet happy and help it level up. Different pets have different personalities and growth rates!"
    },
    {
      question: "What are achievements?",
      answer: "Achievements are special badges you earn by reaching milestones in your habit journey. They can be earned for maintaining streaks, completing habits, or reaching pet levels."
    },
    {
      question: "How do I add friends?",
      answer: "Visit the Friends page and click 'Add Friend'. You can search for users by their username and send them friend requests. Once accepted, you can see their progress and compete on the leaderboard!"
    }
  ];

  const features = [
    {
      icon: <PawPrint className="text-[#4abe9c]" size={24} />,
      title: "Virtual Pet",
      description: "Choose and raise your own virtual pet that grows with your habits"
    },
    {
      icon: <Clock className="text-[#4abe9c]" size={24} />,
      title: "Habit Tracking",
      description: "Create and track daily habits with reminders and progress tracking"
    },
    {
      icon: <Users className="text-[#4abe9c]" size={24} />,
      title: "Social Features",
      description: "Connect with friends, share progress, and compete on leaderboards"
    },
    {
      icon: <Trophy className="text-[#4abe9c]" size={24} />,
      title: "Achievements",
      description: "Earn badges and rewards for reaching milestones"
    },
    {
      icon: <Bell className="text-[#4abe9c]" size={24} />,
      title: "Notifications",
      description: "Get reminders for your habits and updates about your pet"
    },
    {
      icon: <Star className="text-[#4abe9c]" size={24} />,
      title: "Streaks",
      description: "Build momentum with daily streaks and watch your progress grow"
    }
  ];

  const tips = [
    "Start with small, achievable habits and gradually increase difficulty",
    "Set specific times for your habits to build consistency",
    "Check in with your pet daily to maintain its happiness",
    "Connect with friends to stay motivated and accountable",
    "Celebrate your achievements and pet's growth milestones"
  ];

  const LayoutComponent = isMobile ? MobileLayout : Layout;

  return (
    <LayoutComponent userName={userProfile?.user?.display_name || "User"}>
      <div className="min-h-screen font-sniglet pt-12 pb-8 px-4 sm:px-6 bg-gradient-to-b from-[#eaf6f0] to-[#fdfbef]">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl text-[#486085] font-medium mb-4">Help Center</h1>
            <p className="text-[#486085]">Everything you need to know about Tamagotchi Tracker</p>
          </div>

          {/* Features Section */}
          <div className="bg-white rounded-xl border border-[#4abe9c] shadow-sm p-6 mb-8">
            <h2 className="text-xl text-[#486085] font-medium mb-6">Key Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start gap-4 p-4 bg-[#f8faf9] rounded-lg">
                  <div className="flex-shrink-0">{feature.icon}</div>
                  <div>
                    <h3 className="font-medium text-[#486085] mb-1">{feature.title}</h3>
                    <p className="text-sm text-gray-600">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* FAQs Section */}
          <div className="bg-white rounded-xl border border-[#4abe9c] shadow-sm p-6 mb-8">
            <h2 className="text-xl text-[#486085] font-medium mb-6">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="border-b border-gray-100 last:border-0 pb-4 last:pb-0">
                  <button
                    onClick={() => setOpenSection(openSection === index ? null : index)}
                    className="w-full flex items-center justify-between text-left"
                  >
                    <span className="font-medium text-[#486085]">{faq.question}</span>
                    {openSection === index ? (
                      <ChevronUp className="text-[#4abe9c]" size={20} />
                    ) : (
                      <ChevronDown className="text-[#4abe9c]" size={20} />
                    )}
                  </button>
                  {openSection === index && (
                    <p className="mt-2 text-gray-600">{faq.answer}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Tips Section */}
          <div className="bg-white rounded-xl border border-[#4abe9c] shadow-sm p-6">
            <h2 className="text-xl text-[#486085] font-medium mb-6">Tips for Success</h2>
            <ul className="space-y-3">
              {tips.map((tip, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#4abe9c] text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                    {index + 1}
                  </div>
                  <span className="text-gray-600">{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </LayoutComponent>
  );
} 
