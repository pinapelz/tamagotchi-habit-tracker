import React from "react";
import { FaTwitter, FaFacebook, FaWhatsapp, FaShareAlt } from "react-icons/fa";

export default function ShareModal({ show, onClose }) {
  if (!show) return null;

  return (
    <>
      {/* Dimmed background */}
      <div
        className="fixed inset-0 bg-opacity-40 backdrop-blur-sm z-40"
        onClick={onClose}
      />
      {/* Main Modal */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none"
      >
        <div
          className="bg-[#fdfbef] rounded-xl shadow-xl p-6 max-w-md w-full relative pointer-events-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl"
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>

          {/* Title */}
          <h3 className="text-xl font-bold mb-6 text-[#486085]">Share with</h3>

          {/* Share buttons in circular layout */}
          <div className="flex justify-between items-start mb-8 px-2">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-[#f9f0e3] flex items-center justify-center mb-2 cursor-pointer hover:bg-[#f2e7d8]">
                <div className="text-[#4abe9c] text-2xl">
                  <FaTwitter />
                </div>
              </div>
              <span className="text-xs text-[#4abe9c]">Twitter</span>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-[#f9f0e3] flex items-center justify-center mb-2 cursor-pointer hover:bg-[#f2e7d8]">
                <div className="text-[#4abe9c] text-2xl">
                  <FaFacebook />
                </div>
              </div>
              <span className="text-xs text-[#4abe9c]">Facebook</span>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-[#f9f0e3] flex items-center justify-center mb-2 cursor-pointer hover:bg-[#f2e7d8]">
                <div className="text-[#4abe9c] text-2xl">
                  <FaWhatsapp />
                </div>
              </div>
              <span className="text-xs text-[#4abe9c]">Whatsapp</span>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-[#f9f0e3] flex items-center justify-center mb-2 cursor-pointer hover:bg-[#f2e7d8]">
                <div className="text-[#4abe9c] text-2xl">
                  <FaShareAlt />
                </div>
              </div>
              <span className="text-xs text-[#4abe9c]">More</span>
            </div>
          </div>

          {/* Share link section */}
          <div className="mt-4">
            <p className="text-center text-sm text-gray-400 mb-3">Or share with link</p>
            <div className="flex items-center border rounded-lg overflow-hidden bg-white">
              <input
                type="text"
                readOnly
                value={window.location.href}
                className="flex-1 px-3 py-2 text-sm outline-none text-gray-500"
              />
              <button
                className="px-3 py-2 bg-white text-[#4abe9c] hover:text-[#3a9880]"
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}