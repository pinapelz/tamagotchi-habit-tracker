// Stubbed fetchUserProfile function

export async function fetchUserProfile(userId) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        username: userId ? "OtherUser" : "TamaFan123",
        stats: {
          petName: "Pixel",
          petType: "Cat",
          petLevel: 7,
          streak: 12,
          habitsTracked: 5,
        },
        achievements: ["7 Day Streak", "Early Bird", "Hydration Hero"],
      });
    }, 500);
  });
}