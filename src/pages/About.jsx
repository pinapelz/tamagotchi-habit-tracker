import { Link } from 'react-router-dom';
import cloudImage from '../assets/landing/cloud-pixel.webp'
import AuthNav from "../components/AuthNav";

function About() {
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

        <div className="bg-white rounded-2xl shadow-lg p-8 max-w-2xl text-center border border-gray-200">
          <h1 className="text-4xl font-medium mb-6">About Tamagotchi Habit Tracker</h1>
          <p className="text-lg max-w-2xl text-center mb-4">
            We are a team of 4 students at the University of California, Irvine (UCI), currently taking <span className="text-sky-600">Informatics 124</span>.
          </p>
          <p className="text-lg max-w-2xl text-center mb-4">
            As part of our coursework, we created the <span className="text-sky-600">Tamagotchi Habit Tracker</span>, a fun and motivational way to help users build better habits. Your digital pet's mood and wellness reflects how well you stick to your daily goals, encouraging you to stay consistent and take care of both yourself and your Tamagotchi Pet!
          </p>
          <p className="text-lg max-w-2xl text-center">
            We hope this app helps make building habits more enjoyable and rewarding. Thank you for visiting and learning more about our project!
          </p>
        </div>
      </main>
    </div>
    );
  }
  
  export default About;
