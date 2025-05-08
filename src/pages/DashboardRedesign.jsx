          {/* Right Column - Pet and Environment */}
          <div className="w-1/2 bg-[#FDFFE9] border-l border-[#4abe9c] flex flex-col h-screen">
            {/* Pet Display */}
            <div className="flex-1 flex items-center justify-center p-6">
              <div className="text-center">
                <img
                  src="/src/assets/pets/pixel-cat.gif"
                  alt="Tamagotchi pet"
                  className="w-64 h-64 object-contain mx-auto mb-4"
                />
                <h3 className="text-2xl font-bold text-[#486085]">
                  {userProfile.stats.petName} the {userProfile.stats.petType}
                </h3>
                <p className="text-xl text-[#486085]">Level {userProfile.stats.petLevel}</p>
              </div>
            </div>

            {/* Environment Display */}
            <div className="h-1/4 relative">
              <img
                src={backgroundImage}
                alt="Environment"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/20" />
            </div>
          </div> 