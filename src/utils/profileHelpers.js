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

export function getHashedBackgroundValue(input, upper_bound) {
  if (typeof input !== "string" || !input.length || typeof upper_bound !== "number" || upper_bound <= 0) {
    return 0;
  }
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = ((hash << 5) - hash) + input.charCodeAt(i);
    hash |= 0;
  }
  return (Math.abs(hash) % upper_bound);
}