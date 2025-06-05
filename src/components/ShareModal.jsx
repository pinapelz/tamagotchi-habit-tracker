import React from "react";
import { FaTwitter, FaFacebook, FaWhatsapp, FaInstagram } from "react-icons/fa";

export default function ShareModal({ show, onClose }) {
  if (!show) return null;

  return (
    <>
      {/* Dimmed background */}
      <div
        className="fixed inset-0 bg-black/20 z-40"
        onClick={onClose}
      />
      {/* Main Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none p-4">
        <div
          className="bg-white rounded-lg p-4 max-w-sm w-full relative pointer-events-auto shadow-lg animate-fadeIn"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close button */}
          <button
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 transition-colors text-2xl font-light"
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>

          {/* Title */}
          <h3 className="text-lg font-medium mb-4 text-gray-800">Share Progress</h3>

          {/* Share buttons in circular layout */}
          <div className="flex justify-between items-start mb-6 px-2">
            <div className="flex flex-col items-center">
              <div className="w-14 h-14 rounded-full bg-[#f9f0e3] flex items-center justify-center mb-2 cursor-pointer hover:bg-[#f2e7d8]">
                <div className="text-[#4abe9c] text-xl">
                  <FaTwitter />
                </div>
              </div>
              <span className="text-xs text-[#4abe9c]">Twitter</span>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-14 h-14 rounded-full bg-[#f9f0e3] flex items-center justify-center mb-2 cursor-pointer hover:bg-[#f2e7d8]">
                <div className="text-[#4abe9c] text-xl">
                  <FaFacebook />
                </div>
              </div>
              <span className="text-xs text-[#4abe9c]">Facebook</span>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-14 h-14 rounded-full bg-[#f9f0e3] flex items-center justify-center mb-2 cursor-pointer hover:bg-[#f2e7d8]">
                <div className="text-[#4abe9c] text-xl">
                  <FaWhatsapp />
                </div>
              </div>
              <span className="text-xs text-[#4abe9c]">Whatsapp</span>
            </div>

            <div className="flex flex-col items-center">
              <div className="w-14 h-14 rounded-full bg-[#f9f0e3] flex items-center justify-center mb-2 cursor-pointer hover:bg-[#f2e7d8]">
                <div className="text-[#4abe9c] text-xl">
                  <FaInstagram />
                </div>
              </div>
              <span className="text-xs text-[#4abe9c]">Instagram</span>
            </div>
          </div>

          {/* Share link section */}
          <div className="mt-4">
            <p className="text-center text-sm text-gray-400 mb-2">Or share with link</p>
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
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
